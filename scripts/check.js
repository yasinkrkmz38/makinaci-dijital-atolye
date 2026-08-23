'use strict';

const fs=require('fs');
const path=require('path');
const {execFileSync}=require('child_process');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
const jsFiles=['server.js','start.js','render-start.js','app.js','admin.js','service-worker.js','site.js','auth-pages.js','pwa.js','db/migrate.js'];
const requiredFiles=['index.html','app.html','style.css','mobile.css','site.css','manifest.webmanifest','admin.html','admin.css','.env.example','PROJECT.md','CHANGELOG.md','migrations/001_platform_expansion.sql'];

for(const file of [...jsFiles,...requiredFiles]){
  if(!fs.existsSync(path.join(root,file)))throw Error(`Eksik production dosyası: ${file}`);
}
for(const file of jsFiles)execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'inherit'});

const server=read('server.js');
const start=read('start.js');
const html=read('app.html');
const publicHtml=read('index.html');
const worker=read('service-worker.js');
const migration=read('migrations/001_platform_expansion.sql');

if(pkg.scripts.start!=='node start.js')throw Error('Production start command node start.js olmalı');
if(!start.includes("require('./server.js')"))throw Error('start.js doğrudan server.js başlatmalı');
if(!server.includes("const HOST='0.0.0.0'"))throw Error('Server 0.0.0.0 üzerinde dinlemeli');
if(!server.includes('app.listen(PORT,HOST'))throw Error('Server HOST ve PORT ile başlamalı');
if(!server.includes('process.env.RENDER_GIT_COMMIT'))throw Error('Health endpointi production commit bilgisini yayınlamalı');
if(!server.includes(`'${pkg.version}'`))throw Error('Server varsayılan sürümü package.json ile farklı');
if(lock.version!==pkg.version||lock.packages?.['']?.version!==pkg.version)throw Error('package-lock sürümü package.json ile farklı');
if(lock.packages?.['']?.dependencies?.['better-sqlite3'])throw Error('SQLite dependency production lockfile içinde bulunamaz');

for(const invariant of [
  "rootUiFile(res,'index.html','html')",
  "rootUiFile(res,'app.html','html')",
  "rootUiFile(res,'app.js','application/javascript')",
  "rootUiFile(res,'style.css','text/css')",
  "rootUiFile(res,'mobile.css','text/css')",
  "rootUiFile(res,'manifest.webmanifest','application/manifest+json')",
  "rootUiFile(res,'service-worker.js','application/javascript')",
  "rootUiFile(res,'not-found.html','html')"
])if(!server.includes(invariant))throw Error(`Production route doğrulanamadı: ${invariant}`);

for(const asset of ['app.js','style.css','mobile.css']){
  if(!html.includes(`/${asset}?v=${pkg.version}`))throw Error(`HTML asset sürümü uyumsuz: ${asset}`);
}
for(const asset of ['site.css','site.js'])if(!publicHtml.includes(`/${asset}?v=${pkg.version}`))throw Error(`Public site asset sürümü uyumsuz: ${asset}`);
if(!worker.includes(`APP_VERSION='${pkg.version}'`))throw Error('Service worker sürümü uyumsuz');
if(/patchLoginFlow|mergedApp|mergedStyle|string replace|v172-integrity|login-hardfix|auth-controls-p6/i.test(worker))throw Error('Service worker uygulama kaynağını değiştiremez');
if(!worker.includes("url.pathname.startsWith('/api/')")||!worker.includes('return;'))throw Error('Service worker API bypass eksik');
if(server.indexOf("app.use('/api'")<0||server.indexOf("app.use('/api'")>server.indexOf("app.get('*'"))throw Error('API 404 JSON middleware catch-all route öncesinde olmalı');
if(!server.includes('contentSecurityPolicy:{directives:'))throw Error('Content Security Policy etkin değil');
if(!server.includes('runMigrations(pool'))throw Error('Migration çalıştırıcısı startup akışında değil');
for(const table of ['auth_sessions','email_verification_tokens','company_invitations','maintenance_templates','checklist_items','part_usages','work_order_events','user_notifications']){
  if(!migration.includes(table))throw Error(`Platform migration tablosu eksik: ${table}`);
}
for(const invariant of ['archived_at TIMESTAMPTZ','/api/machines/:id/restore','/api/maintenance/:id/restore','SELECT * FROM parts WHERE id=$1 AND company_id=$2 FOR UPDATE']){
  if(!server.includes(invariant))throw Error(`Kritik backend invariant eksik: ${invariant}`);
}
const partMetadataRoute=server.match(/app\.put\('\/api\/parts\/:id'[\s\S]*?\n/)?.[0]||'';
if(!partMetadataRoute||/(?:SET|,)\s*quantity\s*=/i.test(partMetadataRoute))throw Error('Stok metadata endpointi quantity değiştiremez');
for(const legacy of ['v1621-index.html','v1621-app.js','v1621-style.css','v1621-service-worker.js','v1621-manifest.webmanifest','appstore-v17.css']){
  if(fs.existsSync(path.join(root,legacy)))throw Error(`Eski frontend kopyası kaldırılmamış: ${legacy}`);
}
for(const dbFile of fs.readdirSync(root).filter(file=>/\.(?:db|sqlite)(?:-(?:wal|shm))?$/i.test(file)))throw Error(`Veritabanı dosyası repoda bulunamaz: ${dbFile}`);

console.log(`Dijital Makinacı V${pkg.version}: mimari, migration ve sözdizimi kontrolleri başarılı.`);
