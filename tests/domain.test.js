'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {stockQuantityAfter,canCompanyRole,sessionStateValid,canUseUnverifiedSession,nextCalendarDate}=require('../domain');
const root=path.resolve(__dirname,'..');

test('stok yalnızca pozitif giriş/çıkış hareketiyle değişir',()=>{
  assert.equal(stockQuantityAfter(10,2.5,'out'),7.5);
  assert.equal(stockQuantityAfter(10,2.5,'in'),12.5);
  assert.equal(stockQuantityAfter(10,0,'count'),0);
  assert.equal(stockQuantityAfter(10,8.5,'count'),8.5);
  for(const bad of [0,-1,Infinity,NaN])assert.throws(()=>stockQuantityAfter(10,bad,'out'),RangeError);
  assert.throws(()=>stockQuantityAfter(2,3,'out'),/Stok yetersiz/);
});

test('firma rolleri en az yetki prensibini uygular',()=>{
  assert.equal(canCompanyRole('owner','manageRoles'),true);
  assert.equal(canCompanyRole('manager','manageRoles'),false);
  assert.equal(canCompanyRole('technician','work'),true);
  assert.equal(canCompanyRole('maintenance_manager','editAssets'),true);
  assert.equal(canCompanyRole('warehouse_manager','work'),true);
  assert.equal(canCompanyRole('operator','work'),false);
  assert.equal(canCompanyRole('viewer','operate'),false);
});

test('şifre sürümü değişen, iptal edilmiş veya süresi dolmuş oturum reddedilir',()=>{
  const valid={tokenVersion:4,userVersion:4,revokedAt:null,expiresAt:new Date(Date.now()+60000)};
  assert.equal(sessionStateValid(valid),true);
  assert.equal(sessionStateValid({...valid,userVersion:5}),false);
  assert.equal(sessionStateValid({...valid,revokedAt:new Date()}),false);
  assert.equal(sessionStateValid({...valid,expiresAt:new Date(Date.now()-1)}),false);
});

test('zorunlu doğrulama politikası açıldığında oturum yalnızca güvenlik yüzeyini kullanır',()=>{
  assert.equal(canUseUnverifiedSession('/api/auth/me','GET'),true);
  assert.equal(canUseUnverifiedSession('/api/account/security','GET'),true);
  assert.equal(canUseUnverifiedSession('/api/account/resend-verification','POST'),true);
  assert.equal(canUseUnverifiedSession('/api/dashboard','GET'),false);
  assert.equal(canUseUnverifiedSession('/api/account/password','POST'),false);
  assert.equal(canUseUnverifiedSession('/api/account/resend-verification','GET'),false);
});

test('e-posta doğrulaması varsayılan olarak isteğe bağlıdır',()=>{
  const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
  const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
  assert.match(server,/REQUIRE_EMAIL_VERIFICATION\|\|'false'/);
  assert.match(server,/INSERT INTO users\(name,email,password_hash,email_verified_at\) VALUES\(\$1,\$2,\$3,NULL\)/);
  assert.match(server,/verification_required:false,email_sent:false/);
  assert.match(app,/email_verification_required===true&&me\.email_verified===false/);
});

test('takvim bazlı bakım ay sonunu güvenli taşır',()=>{
  assert.equal(nextCalendarDate('2026-01-31',1),'2026-02-28');
  assert.equal(nextCalendarDate('2024-01-31',1),'2024-02-29');
  assert.equal(nextCalendarDate('2026-08-23',3),'2026-11-23');
  assert.throws(()=>nextCalendarDate('2026-08-23',0),RangeError);
});

test('firma izolasyonu ve bakım tekilliği SQL sözleşmesinde zorunludur',()=>{
  const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
  const migration=fs.readFileSync(path.join(root,'migrations/002_operations.sql'),'utf8');
  assert.match(server,/ownMachine\(b\.machine_id,req\.company\.id\)/);
  assert.match(server,/SELECT \* FROM parts WHERE id=\$1 AND company_id=\$2 FOR UPDATE/);
  assert.match(server,/WHERE w\.id=\$1 AND w\.company_id=\$2/);
  assert.match(migration,/CREATE UNIQUE INDEX idx_maintenance_template_open/);
});

test('profesyonel CMMS genişletmeleri firma kapsamında ve veri koruyucudur',()=>{
  const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
  const migration=fs.readFileSync(path.join(root,'migrations/004_professional_cmms.sql'),'utf8');
  assert.match(server,/machine_meter_readings WHERE company_id=\$1 AND machine_id=\$2/);
  assert.match(server,/shift_handovers s[\s\S]*s\.company_id=\$1/);
  assert.match(server,/machine_parts\(company_id,machine_id,part_id/);
  assert.match(server,/SELECT \* FROM machines WHERE id=\$1 AND company_id=\$2 AND archived_at IS NULL FOR UPDATE/);
  assert.match(migration,/work_order_no='WO-'/);
  assert.match(migration,/hourly_downtime_cost NUMERIC/);
  assert.doesNotMatch(migration,/\b(?:DROP TABLE|TRUNCATE|DELETE FROM)\b/i);
});
