const express=require("express");
const path=require("path");
const Database=require("better-sqlite3");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");

const app=express(), PORT=process.env.PORT||3010, SECRET=process.env.JWT_SECRET||"change-this-secret";
const db=new Database("atolye.db");
db.pragma("journal_mode=WAL");
db.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS machines(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,name TEXT NOT NULL,model TEXT,serial TEXT,hours REAL DEFAULT 0,note TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS maintenance(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,machine_id INTEGER NOT NULL,job TEXT NOT NULL,date TEXT NOT NULL,next_date TEXT,note TEXT,FOREIGN KEY(user_id) REFERENCES users(id),FOREIGN KEY(machine_id) REFERENCES machines(id));`);
app.use(express.json());app.use(cookieParser());app.use(express.static(path.join(__dirname,"public"),{etag:false,setHeaders:(res)=>res.setHeader("Cache-Control","no-store")}));

function auth(req,res,next){try{let t=req.cookies.token;if(!t)return res.status(401).json({error:"Giriş gerekli"});req.user=jwt.verify(t,SECRET);next()}catch(e){res.status(401).json({error:"Oturum geçersiz"})}}
app.post("/api/register",async(req,res)=>{let {name,email,password}=req.body;if(!name||!email||!password||password.length<6)return res.status(400).json({error:"Ad, e-posta ve en az 6 karakter şifre gerekli"});try{let hash=await bcrypt.hash(password,10),x=db.prepare("INSERT INTO users(name,email,password) VALUES(?,?,?)").run(name,email.toLowerCase(),hash);let token=jwt.sign({id:x.lastInsertRowid,name,email:email.toLowerCase()},SECRET,{expiresIn:"7d"});res.cookie("token",token,{httpOnly:true,sameSite:"lax"}).json({ok:true})}catch(e){res.status(400).json({error:"Bu e-posta zaten kayıtlı"})}});
app.post("/api/login",async(req,res)=>{let {email,password}=req.body,u=db.prepare("SELECT * FROM users WHERE email=?").get((email||"").toLowerCase());if(!u||!(await bcrypt.compare(password||"",u.password)))return res.status(401).json({error:"E-posta veya şifre hatalı"});let token=jwt.sign({id:u.id,name:u.name,email:u.email},SECRET,{expiresIn:"7d"});res.cookie("token",token,{httpOnly:true,sameSite:"lax"}).json({ok:true})});
app.post("/api/logout",(req,res)=>{res.clearCookie("token").json({ok:true})});
app.get("/api/me",auth,(req,res)=>res.json(req.user));
app.get("/api/machines",auth,(req,res)=>res.json(db.prepare("SELECT * FROM machines WHERE user_id=? ORDER BY id DESC").all(req.user.id)));
app.post("/api/machines",auth,(req,res)=>{let {name,model,serial,hours,note}=req.body;if(!name)return res.status(400).json({error:"Makina adı gerekli"});let x=db.prepare("INSERT INTO machines(user_id,name,model,serial,hours,note) VALUES(?,?,?,?,?,?)").run(req.user.id,name,model||"",serial||"",Number(hours)||0,note||"");res.json({id:x.lastInsertRowid})});
app.delete("/api/machines/:id",auth,(req,res)=>{db.prepare("DELETE FROM maintenance WHERE machine_id=? AND user_id=?").run(req.params.id,req.user.id);db.prepare("DELETE FROM machines WHERE id=? AND user_id=?").run(req.params.id,req.user.id);res.json({ok:true})});
app.get("/api/maintenance",auth,(req,res)=>res.json(db.prepare("SELECT m.*,x.name machine FROM maintenance m JOIN machines x ON x.id=m.machine_id WHERE m.user_id=? ORDER BY m.date DESC").all(req.user.id)));
app.post("/api/maintenance",auth,(req,res)=>{let {machine_id,job,date,next_date,note}=req.body;if(!machine_id||!job||!date)return res.status(400).json({error:"Makina, işlem ve tarih gerekli"});let ok=db.prepare("SELECT id FROM machines WHERE id=? AND user_id=?").get(machine_id,req.user.id);if(!ok)return res.status(403).json({error:"Makina bulunamadı"});db.prepare("INSERT INTO maintenance(user_id,machine_id,job,date,next_date,note) VALUES(?,?,?,?,?,?)").run(req.user.id,machine_id,job,date,next_date||"",note||"");res.json({ok:true})});
app.delete("/api/maintenance/:id",auth,(req,res)=>{db.prepare("DELETE FROM maintenance WHERE id=? AND user_id=?").run(req.params.id,req.user.id);res.json({ok:true})});
app.listen(PORT,()=>console.log(`Makinacı V8 http://localhost:${PORT}`));