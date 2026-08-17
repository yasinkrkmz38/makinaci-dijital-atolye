const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser");
const helmet=require("helmet");
const rateLimit=require("express-rate-limit");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {Pool}=require("pg");

const app=express();
const PORT=process.env.PORT||3000;
const JWT_SECRET=process.env.JWT_SECRET||"DEVELOPMENT_ONLY_CHANGE_ME";
const DATABASE_URL=process.env.DATABASE_URL;

if(!DATABASE_URL){
  console.error("DATABASE_URL tanımlı değil.");
  process.exit(1);
}

const pool=new Pool({
  connectionString:DATABASE_URL,
  ssl: process.env.NODE_ENV==="production" ? {rejectUnauthorized:false} : false
});

app.set("trust proxy",1);
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"300kb"}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public"),{maxAge:"1h"}));

const authLimiter=rateLimit({windowMs:15*60*1000,max:60,standardHeaders:true,legacyHeaders:false});
app.use("/api/auth",authLimiter);

async function q(text,params=[]){return pool.query(text,params)}
function sign(user){return jwt.sign({id:user.id,email:user.email,name:user.name,role:user.role},JWT_SECRET,{expiresIn:"7d"})}
function setCookie(res,token){res.cookie("dm_token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",maxAge:7*24*60*60*1000})}
function auth(req,res,next){
  const token=req.cookies.dm_token;
  if(!token)return res.status(401).json({error:"Giriş gerekli"});
  try{req.user=jwt.verify(token,JWT_SECRET);next()}catch{res.clearCookie("dm_token");res.status(401).json({error:"Oturum geçersiz"})}
}
function admin(req,res,next){if(req.user?.role!=="admin")return res.status(403).json({error:"Admin yetkisi gerekli"});next()}
const clean=s=>String(s??"").trim();
const emailOk=s=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

async function initDb(){
 await q(`CREATE TABLE IF NOT EXISTS users(
   id BIGSERIAL PRIMARY KEY,
   name VARCHAR(120) NOT NULL,
   email VARCHAR(200) UNIQUE NOT NULL,
   password_hash TEXT NOT NULL,
   role VARCHAR(20) NOT NULL DEFAULT 'user',
   is_active BOOLEAN NOT NULL DEFAULT TRUE,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await q(`CREATE TABLE IF NOT EXISTS machines(
   id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   name VARCHAR(160) NOT NULL,model VARCHAR(160) DEFAULT '',hours NUMERIC(12,1) DEFAULT 0,
   criticality VARCHAR(30) DEFAULT 'Normal',serial_no VARCHAR(120) DEFAULT '',note TEXT DEFAULT '',
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await q(`CREATE TABLE IF NOT EXISTS maintenance(
   id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   machine_id BIGINT REFERENCES machines(id) ON DELETE CASCADE,task VARCHAR(220) NOT NULL,
   due_date DATE NOT NULL,priority VARCHAR(30) DEFAULT 'Normal',status VARCHAR(20) DEFAULT 'open',
   note TEXT DEFAULT '',completed_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await q(`CREATE TABLE IF NOT EXISTS faults(
   id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   machine_id BIGINT REFERENCES machines(id) ON DELETE SET NULL,system VARCHAR(40),symptom VARCHAR(180) NOT NULL,
   measurements JSONB DEFAULT '{}'::jsonb,note TEXT DEFAULT '',diagnosis TEXT DEFAULT '',
   status VARCHAR(20) DEFAULT 'open',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await q(`CREATE TABLE IF NOT EXISTS favorites(
   id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   article_key VARCHAR(180) NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   UNIQUE(user_id,article_key)
 )`);
 await q(`CREATE TABLE IF NOT EXISTS calc_history(
   id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   tool VARCHAR(120) NOT NULL,input_data JSONB DEFAULT '{}'::jsonb,result TEXT NOT NULL,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 const adminEmail=clean(process.env.ADMIN_EMAIL).toLowerCase();
 const adminPassword=clean(process.env.ADMIN_PASSWORD);
 if(adminEmail && adminPassword){
   const found=await q("SELECT id FROM users WHERE email=$1",[adminEmail]);
   if(!found.rows.length){
     const hash=await bcrypt.hash(adminPassword,12);
     await q("INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,'admin')",[process.env.ADMIN_NAME||"Site Yöneticisi",adminEmail,hash]);
     console.log("Admin hesabı oluşturuldu:",adminEmail);
   } else {
     await q("UPDATE users SET role='admin' WHERE email=$1",[adminEmail]);
   }
 }
}
initDb().catch(e=>{console.error("DB init hatası:",e);process.exit(1)});

app.post("/api/auth/register",async(req,res)=>{
 try{
  const name=clean(req.body.name),email=clean(req.body.email).toLowerCase(),password=String(req.body.password||"");
  if(name.length<2)return res.status(400).json({error:"Ad soyad gerekli"});
  if(!emailOk(email))return res.status(400).json({error:"Geçerli e-posta gir"});
  if(password.length<8)return res.status(400).json({error:"Şifre en az 8 karakter olmalı"});
  const hash=await bcrypt.hash(password,12);
  const r=await q("INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email,role,is_active,created_at",[name,email,hash]);
  const u=r.rows[0];setCookie(res,sign(u));res.json({user:u});
 }catch(e){
  if(e.code==="23505")return res.status(409).json({error:"Bu e-posta zaten kayıtlı"});
  console.error(e);res.status(500).json({error:"Kayıt oluşturulamadı"});
 }
});
app.post("/api/auth/login",async(req,res)=>{
 try{
  const email=clean(req.body.email).toLowerCase(),password=String(req.body.password||"");
  const r=await q("SELECT * FROM users WHERE email=$1",[email]);const u=r.rows[0];
  if(!u||!(await bcrypt.compare(password,u.password_hash)))return res.status(401).json({error:"E-posta veya şifre hatalı"});
  if(!u.is_active)return res.status(403).json({error:"Hesabınız devre dışı"});
  setCookie(res,sign(u));res.json({user:{id:u.id,name:u.name,email:u.email,role:u.role,is_active:u.is_active}});
 }catch(e){console.error(e);res.status(500).json({error:"Giriş yapılamadı"})}
});
app.post("/api/auth/logout",(req,res)=>{res.clearCookie("dm_token");res.json({ok:true})});
app.get("/api/auth/me",auth,async(req,res)=>{
 const r=await q("SELECT id,name,email,role,is_active,created_at FROM users WHERE id=$1",[req.user.id]);
 if(!r.rows[0]?.is_active)return res.status(403).json({error:"Hesap devre dışı"});
 res.json({user:r.rows[0]});
});

app.get("/api/machines",auth,async(req,res)=>res.json((await q("SELECT * FROM machines WHERE user_id=$1 ORDER BY id DESC",[req.user.id])).rows));
app.post("/api/machines",auth,async(req,res)=>{
 const b=req.body;if(!clean(b.name))return res.status(400).json({error:"Makine adı gerekli"});
 const r=await q(`INSERT INTO machines(user_id,name,model,hours,criticality,serial_no,note)
 VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
 [req.user.id,clean(b.name),clean(b.model),Number(b.hours)||0,clean(b.criticality)||"Normal",clean(b.serial_no),clean(b.note)]);
 res.json(r.rows[0]);
});
app.put("/api/machines/:id",auth,async(req,res)=>{
 const b=req.body;const r=await q(`UPDATE machines SET name=$1,model=$2,hours=$3,criticality=$4,serial_no=$5,note=$6 WHERE id=$7 AND user_id=$8 RETURNING *`,
 [clean(b.name),clean(b.model),Number(b.hours)||0,clean(b.criticality)||"Normal",clean(b.serial_no),clean(b.note),req.params.id,req.user.id]);
 if(!r.rows[0])return res.status(404).json({error:"Makine bulunamadı"});res.json(r.rows[0]);
});
app.delete("/api/machines/:id",auth,async(req,res)=>{await q("DELETE FROM machines WHERE id=$1 AND user_id=$2",[req.params.id,req.user.id]);res.json({ok:true})});

app.get("/api/maintenance",auth,async(req,res)=>res.json((await q(`SELECT m.*,x.name machine_name FROM maintenance m LEFT JOIN machines x ON x.id=m.machine_id WHERE m.user_id=$1 ORDER BY m.due_date ASC,m.id DESC`,[req.user.id])).rows));
app.post("/api/maintenance",auth,async(req,res)=>{
 const b=req.body;if(!b.machine_id||!clean(b.task)||!b.due_date)return res.status(400).json({error:"Makine, görev ve tarih gerekli"});
 const own=await q("SELECT id FROM machines WHERE id=$1 AND user_id=$2",[b.machine_id,req.user.id]);if(!own.rows.length)return res.status(403).json({error:"Makine size ait değil"});
 const r=await q(`INSERT INTO maintenance(user_id,machine_id,task,due_date,priority,note) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
 [req.user.id,b.machine_id,clean(b.task),b.due_date,clean(b.priority)||"Normal",clean(b.note)]);res.json(r.rows[0]);
});
app.patch("/api/maintenance/:id/status",auth,async(req,res)=>{
 const status=req.body.status==="done"?"done":"open";const r=await q(`UPDATE maintenance SET status=$1,completed_at=CASE WHEN $1='done' THEN NOW() ELSE NULL END WHERE id=$2 AND user_id=$3 RETURNING *`,[status,req.params.id,req.user.id]);
 if(!r.rows[0])return res.status(404).json({error:"Kayıt bulunamadı"});res.json(r.rows[0]);
});
app.delete("/api/maintenance/:id",auth,async(req,res)=>{await q("DELETE FROM maintenance WHERE id=$1 AND user_id=$2",[req.params.id,req.user.id]);res.json({ok:true})});

app.get("/api/faults",auth,async(req,res)=>res.json((await q(`SELECT f.*,x.name machine_name FROM faults f LEFT JOIN machines x ON x.id=f.machine_id WHERE f.user_id=$1 ORDER BY f.id DESC LIMIT 100`,[req.user.id])).rows));
app.post("/api/faults",auth,async(req,res)=>{
 const b=req.body;const r=await q(`INSERT INTO faults(user_id,machine_id,system,symptom,measurements,note,diagnosis) VALUES($1,$2,$3,$4,$5::jsonb,$6,$7) RETURNING *`,
 [req.user.id,b.machine_id||null,clean(b.system),clean(b.symptom),JSON.stringify(b.measurements||{}),clean(b.note),clean(b.diagnosis)]);res.json(r.rows[0]);
});
app.patch("/api/faults/:id/status",auth,async(req,res)=>{const status=req.body.status==="closed"?"closed":"open";const r=await q("UPDATE faults SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *",[status,req.params.id,req.user.id]);res.json(r.rows[0]||{})});

app.get("/api/favorites",auth,async(req,res)=>res.json((await q("SELECT article_key FROM favorites WHERE user_id=$1 ORDER BY id DESC",[req.user.id])).rows.map(x=>x.article_key)));
app.post("/api/favorites/toggle",auth,async(req,res)=>{
 const key=clean(req.body.article_key);if(!key)return res.status(400).json({error:"Makale anahtarı gerekli"});
 const f=await q("SELECT id FROM favorites WHERE user_id=$1 AND article_key=$2",[req.user.id,key]);
 if(f.rows.length){await q("DELETE FROM favorites WHERE id=$1",[f.rows[0].id]);return res.json({favorite:false})}
 await q("INSERT INTO favorites(user_id,article_key) VALUES($1,$2)",[req.user.id,key]);res.json({favorite:true})
});
app.get("/api/calc-history",auth,async(req,res)=>res.json((await q("SELECT * FROM calc_history WHERE user_id=$1 ORDER BY id DESC LIMIT 30",[req.user.id])).rows));
app.post("/api/calc-history",auth,async(req,res)=>{
 const b=req.body;await q("INSERT INTO calc_history(user_id,tool,input_data,result) VALUES($1,$2,$3::jsonb,$4)",[req.user.id,clean(b.tool),JSON.stringify(b.input_data||{}),clean(b.result)]);res.json({ok:true})
});

app.get("/api/dashboard",auth,async(req,res)=>{
 const [m,ma,f]=await Promise.all([
  q("SELECT COUNT(*)::int count FROM machines WHERE user_id=$1",[req.user.id]),
  q("SELECT COUNT(*)::int count FROM maintenance WHERE user_id=$1 AND status='open'",[req.user.id]),
  q("SELECT COUNT(*)::int count FROM faults WHERE user_id=$1 AND status='open'",[req.user.id])
 ]);res.json({machines:m.rows[0].count,maintenance:ma.rows[0].count,faults:f.rows[0].count})
});

app.get("/api/admin/summary",auth,admin,async(req,res)=>{
 const r=await q(`SELECT
 (SELECT COUNT(*) FROM users)::int users,
 (SELECT COUNT(*) FROM machines)::int machines,
 (SELECT COUNT(*) FROM maintenance)::int maintenance,
 (SELECT COUNT(*) FROM faults)::int faults`);
 res.json(r.rows[0]);
});
app.get("/api/admin/users",auth,admin,async(req,res)=>{
 const r=await q(`SELECT u.id,u.name,u.email,u.role,u.is_active,u.created_at,
 (SELECT COUNT(*) FROM machines m WHERE m.user_id=u.id)::int machines,
 (SELECT COUNT(*) FROM maintenance ma WHERE ma.user_id=u.id)::int maintenance,
 (SELECT COUNT(*) FROM faults f WHERE f.user_id=u.id)::int faults
 FROM users u ORDER BY u.id DESC LIMIT 500`);
 res.json(r.rows);
});
app.patch("/api/admin/users/:id/active",auth,admin,async(req,res)=>{
 if(Number(req.params.id)===Number(req.user.id))return res.status(400).json({error:"Kendi admin hesabınızı devre dışı bırakamazsınız"});
 const active=!!req.body.is_active;const r=await q("UPDATE users SET is_active=$1 WHERE id=$2 RETURNING id,name,email,role,is_active",[active,req.params.id]);res.json(r.rows[0]||{});
});
app.patch("/api/admin/users/:id/role",auth,admin,async(req,res)=>{
 const role=req.body.role==="admin"?"admin":"user";const r=await q("UPDATE users SET role=$1 WHERE id=$2 RETURNING id,name,email,role,is_active",[role,req.params.id]);res.json(r.rows[0]||{});
});

app.get("/api/health",(req,res)=>res.json({ok:true,version:"12.0.0"}));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({error:"Sunucu hatası"})});
app.listen(PORT,()=>console.log(`Dijital Makinacı V12 http://localhost:${PORT}`));
