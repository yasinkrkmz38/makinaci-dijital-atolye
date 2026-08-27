'use strict';

const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const server=read('server.js');
const app=read('app.js');
const admin=read('admin.js');
const offline=read('offline.js');
const storage=read('storage.js');
const worker=read('service-worker.js');
const migration1=read('migrations/001_platform_expansion.sql');
const migration2=read('migrations/002_operations.sql');
const migration4=read('migrations/004_professional_cmms.sql');
const diagnosis=read('migrations/003_diagnosis_content.sql');

const requireAll=(source,values,label)=>{for(const value of values)if(!source.includes(value))throw Error(`${label}: ${value}`)};

requireAll(server,[
  "app.get('/api/lists/:resource'","app.get('/api/search'","company_id=$1",
  "app.get('/api/diagnosis/trees/:system'","runOperationalJobs","setInterval(runOperationalJobs",
  "app.post('/api/company/invitations'","app.post('/api/invitations/accept'",
  "app.post('/api/part-usages/:parentType/:id'","SELECT * FROM parts WHERE id=$1 AND company_id=$2 FOR UPDATE",
  "app.post('/api/work-orders/:id/timer/start'","app.post('/api/work-orders/:id/timer/stop'",
  "app.post('/api/reports/:parentType/:id/signatures'","app.post('/api/push/subscribe'",
  "app.get('/api/health'","storage.health()","mailConfigured()","push=VAPID_PUBLIC_KEY&&VAPID_PRIVATE_KEY"
],'Operasyon backend değişmezi eksik');

requireAll(migration1,['maintenance_templates','checklist_items','part_usages','work_order_events','work_time_entries','company_invitations','push_subscriptions','diagnosis_trees'],'Ana migration eksik');
requireAll(migration2,['CREATE UNIQUE INDEX idx_maintenance_template_open','report_signatures','client_request_id','logo_attachment_id'],'Operasyon migration eksik');
requireAll(migration4,['machine_meter_readings','shift_handovers','machine_parts','work_order_no','hourly_downtime_cost','idx_work_orders_assignment_status'],'Profesyonel CMMS migration eksik');
for(const system of ['motor','bearing','hydraulic','pneumatic','cnc','electrical','gearbox'])if(!diagnosis.includes(`('${system}','root'`))throw Error(`Teşhis ağacı eksik: ${system}`);

if(/\b(?:prompt|confirm)\s*\(/.test(app+admin))throw Error('Native prompt/confirm kullanımı kaldı');
requireAll(app,['confirmAction(','promptAction(','loadMoreList(','answerDiagnosis(','saveDiagnosis()','setWorkMine(','signatureModal(','openQrScanner('],'Operasyon UI akışı eksik');
requireAll(offline,['\\/api\\/faults','\\/measurements','\\/comments','\\/api\\/checklists','X-Idempotency-Key'],'Offline güvenli kuyruk eksik');
const partMetadataRoute=server.split(/\r?\n/).find(line=>line.startsWith("app.put('/api/parts/:id'"))||'';
if(!partMetadataRoute||/(?:SET|,)\s*quantity\s*=/i.test(partMetadataRoute))throw Error('Stok kartı metadata güncellemesi miktarı değiştiremez');
requireAll(storage,['PutObjectCommand','GetObjectCommand','DeleteObjectCommand','HeadBucketCommand','STORAGE_BUCKET'],'Object storage eksik');
if(!worker.includes("if(url.pathname==='/app'||url.pathname.startsWith('/app/'))"))throw Error('Service worker public sayfaları /app fallback ile bozmamalı');
if(!server.includes("const APP_VERSION=require('./package.json').version"))throw Error('Sürümün runtime kaynağı package.json olmalı');

console.log('Operasyon, bakım, stok, teşhis, offline, bildirim ve storage değişmezleri başarılı.');
