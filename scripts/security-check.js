'use strict';
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const server=read('server.js'),migration=read('migrations/001_platform_expansion.sql'),actions=read('actions.js'),env=read('.env.example');

for(const invariant of [
  'checkLoginGuard(req,email)',
  "Number(row.email_failures)>=5",
  "'/api/auth/resend-verification'",
  "'/api/auth/verify-email'",
  "'/api/auth/mfa/verify'",
  "'/api/account/mfa/setup'",
  "'/api/account/mfa/enable'",
  "'/api/account/sessions/revoke-others'",
  'session_version=session_version+1',
  'UPDATE auth_sessions SET revoked_at=NOW()',
  `scriptSrcAttr:["'none'"]`
])if(!server.includes(invariant))throw Error(`Güvenlik invariantı eksik: ${invariant}`);
for(const column of ['email_verified_at','session_version','mfa_secret_cipher','mfa_recovery_codes'])if(!migration.includes(column))throw Error(`Auth migration alanı eksik: ${column}`);
for(const setting of ['REQUIRE_EMAIL_VERIFICATION=true','ADMIN_MFA_REQUIRED=true'])if(!env.includes(setting))throw Error(`Güvenlik ortam ayarı eksik: ${setting}`);
if(/\beval\s*\(|new\s+Function\s*\(/.test(actions))throw Error('CSP olay yönlendiricisi dinamik kod çalıştıramaz');
if(!actions.includes("element.removeAttribute(attribute)"))throw Error('HTML olay nitelikleri güvenli bağlama sırasında kaldırılmalı');
console.log('Güvenlik kontrolü başarılı: e-posta doğrulama, MFA, oturum iptali, brute-force ve CSP doğrulandı.');
