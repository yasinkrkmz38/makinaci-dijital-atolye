const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..'),server=fs.readFileSync(path.join(root,'server.js'),'utf8'),migration=fs.readFileSync(path.join(root,'migrations','005_mobile_auth.sql'),'utf8'),mobileApi=fs.readFileSync(path.join(root,'mobile','src','services','api.ts'),'utf8');
test('mobil erişim anahtarı kısa ömürlü ve yenileme anahtarı tek kullanımlıdır',()=>{assert.match(server,/MOBILE_ACCESS_MINUTES\s*=\s*15/);assert.match(server,/UPDATE mobile_refresh_tokens SET rotated_at=NOW\(\)/);assert.match(server,/REFRESH_TOKEN_REUSED/)});
test('mobil bearer oturumu kullanıcı ve şifre sürümüne bağlıdır',()=>{assert.match(server,/kind:'mobile-access'/);assert.match(server,/userVersion:u\.session_version/);assert.match(server,/auth_sessions/)});
test('mobil anahtar ve push kayıtları kullanıcıya, oturuma ve firmaya bağlıdır',()=>{assert.match(migration,/session_id UUID NOT NULL REFERENCES auth_sessions/);assert.match(migration,/user_id BIGINT NOT NULL REFERENCES users/);assert.match(migration,/company_id BIGINT REFERENCES companies/);assert.match(server,/req\.user\.id,req\.company\.id,token/)});
test('çevrimdışı arıza, bakım ve iş emri tekrar gönderimde çoğalmaz',()=>{assert.match(migration,/idx_maintenance_client_request/);assert.match(migration,/idx_work_orders_client_request/);assert.match(migration,/idx_attachments_client_request/);assert.match(server,/X-Idempotency-Key/i);assert.match(server,/maintenance WHERE company_id=\$1 AND client_request_id=\$2/);assert.match(server,/work_orders WHERE company_id=\$1 AND client_request_id=\$2/)});
test('mobil arıza akışı firma kapsamlı teknisyen, medya ve geçmiş kaydı kullanır',()=>{assert.match(migration,/fault_events/);assert.match(migration,/assigned_user_id BIGINT REFERENCES users/);assert.match(server,/faults\/:id\/attachments/);assert.match(server,/f\.id=\$1 AND f\.company_id=\$2/);assert.match(server,/ownCompanyMember\(b\.assigned_user_id,req\.company\.id\)/)});
test('Android istek başlıkları yazdırılabilir ASCII ile sınırlandırılır',()=>{assert.match(mobileApi,/Dijital Makinaci/);assert.match(mobileApi,/\[\^\\x20-\\x7e\]/);assert.doesNotMatch(mobileApi,/Dijital Makinacı •/)});
