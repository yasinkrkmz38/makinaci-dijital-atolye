'use strict';

const http=require('http');
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const port=Number(process.env.PREVIEW_PORT)||4173;
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png'};
const routeFile=urlPath=>{
  if(urlPath==='/'||urlPath==='/index.html')return 'index.html';
  if(urlPath==='/app'||urlPath.startsWith('/app/'))return 'app.html';
  if(urlPath.startsWith('/hesaplamalar/'))return 'calculator.html';
  if(urlPath.startsWith('/teknik/'))return 'article.html';
  if(urlPath==='/admin'||urlPath.startsWith('/admin/'))return 'admin.html';
  return decodeURIComponent(urlPath.replace(/^\//,''));
};
const server=http.createServer((req,res)=>{const pathname=new URL(req.url,'http://localhost').pathname;if(pathname==='/api/auth/me'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({user:{id:1,name:'Önizleme Yöneticisi',email:'preview@localhost',role:'admin',platform_admin:true}}))}if(pathname==='/api/admin/overview'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({summary:{users:12,new_users_7d:2,companies:3,new_companies_7d:1,machines:24,critical_faults:1,open_faults:4,overdue_maintenance:2,open_work_orders:7,failed_logins_24h:1,storage_bytes:5242880},userTrend:[],loginTrend:[],critical:[],recentAdmin:[]}))}if(pathname.startsWith('/api/')){res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'Statik önizlemede API devre dışı'}))}const file=routeFile(pathname),target=path.resolve(root,file);if(!target.startsWith(root)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(target).pipe(res)});
server.listen(port,'127.0.0.1',()=>console.log(`Önizleme: http://127.0.0.1:${port}`));
