'use strict';

const fs=require('fs');
const path=require('path');
const {execFileSync}=require('child_process');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
const jsFiles=['server.js','start.js','render-start.js','v1621-app.js','admin.js','v1621-service-worker.js'];
const requiredFiles=['v1621-index.html','v1621-style.css','appstore-v17.css','v1621-manifest.webmanifest','admin.html','admin.css','.env.example','PROJECT.md','CHANGELOG.md'];

for(const file of [...jsFiles,...requiredFiles]){
  if(!fs.existsSync(path.join(root,file)))throw Error(`Eksik production dosyası: ${file}`);
}
for(const file of jsFiles)execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'inherit'});

const server=read('server.js');
const start=read('start.js');
const html=read('v1621-index.html');
const client=read('v1621-app.js');
const worker=read('v1621-service-worker.js');

if(pkg.scripts.start!=='node start.js')throw Error('Production start command node start.js olmalı');
if(!start.includes("require('./server.js')"))throw Error('start.js doğrudan server.js başlatmalı');
if(!server.includes("const HOST='0.0.0.0'"))throw Error('Server 0.0.0.0 üzerinde dinlemeli');
if(!server.includes('app.listen(PORT,HOST'))throw Error('Server HOST ve PORT ile başlamalı');
if(!server.includes('process.env.RENDER_GIT_COMMIT'))throw Error('Health endpointi production commit bilgisini yayınlamalı');
if(!server.includes(`'${pkg.version}'`))throw Error('Server varsayılan sürümü package.json ile farklı');
if(lock.version!==pkg.version||lock.packages?.['']?.version!==pkg.version)throw Error('package-lock sürümü package.json ile farklı');
if(lock.packages?.['']?.dependencies?.['better-sqlite3'])throw Error('SQLite dependency production lockfile içinde bulunamaz');

const routes={
  "['/', '/index.html']":'v1621-index.html',
  "'/v1621-app.js'":'v1621-app.js',
  "'/v1621-style.css'":'v1621-style.css',
  "'/appstore-v17.css'":'appstore-v17.css',
  "'/manifest.webmanifest'":'v1621-manifest.webmanifest',
  "'/service-worker.js'":'v1621-service-worker.js'
};
for(const [route,file] of Object.entries(routes))if(!server.includes(route)||!server.includes(`'${file}'`))throw Error(`Production route doğrulanamadı: ${route} -> ${file}`);

for(const asset of ['v1621-app.js','v1621-style.css','appstore-v17.css','manifest.webmanifest','service-worker.js']){
  if(!html.includes(`/${asset}?v=${pkg.version}`))throw Error(`HTML asset sürümü uyumsuz: ${asset}`);
}
if(!worker.includes(`APP_VERSION='${pkg.version}'`))throw Error('Service worker sürümü uyumsuz');
if(/patchLoginFlow|mergedApp|mergedStyle|string replace|v172-integrity|login-hardfix|auth-controls-p6/i.test(worker))throw Error('Service worker uygulama kaynağını değiştiremez');
if(/respondWith[\s\S]{0,500}\/api\//.test(worker))throw Error('Service worker API yanıtlarını intercept edemez');
if(!worker.includes("url.pathname.startsWith('/api/')")||!worker.includes('return;'))throw Error('Service worker API bypass eksik');
if(server.indexOf("app.use('/api'")<0||server.indexOf("app.use('/api'")>server.indexOf("app.get('*'"))throw Error('API 404 JSON middleware catch-all route öncesinde olmalı');
if(/submitAuth[\s\S]{0,300}playLoginTransition/.test(client))throw Error('Login blocking transition kullanamaz');

for(const invariant of ['archived_at TIMESTAMPTZ','/api/machines/:id/restore','/api/maintenance/:id/restore','SELECT * FROM parts WHERE id=$1 AND company_id=$2 FOR UPDATE']){
  if(!server.includes(invariant))throw Error(`Kritik backend invariant eksik: ${invariant}`);
}
const partMetadataRoute=server.match(/app\.put\('\/api\/parts\/:id'[\s\S]*?\n/)?.[0]||'';
if(!partMetadataRoute||/(?:SET|,)\s*quantity\s*=/i.test(partMetadataRoute))throw Error('Stok metadata endpointi quantity değiştiremez');

console.log(`Dijital Makinacı V${pkg.version}: mimari ve sözdizimi kontrolleri başarılı.`);
