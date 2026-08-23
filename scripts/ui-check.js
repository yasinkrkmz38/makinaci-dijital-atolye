'use strict';

const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('app.html');
const app=read('app.js');
const pwa=read('pwa.js');
const css=read('style.css')+read('mobile.css');

const pages=['dashboard','machines','maintenance','calendar','workorders','diagnosis','analytics','parts','tools','library','team','account'];
for(const page of pages){
  if(!html.includes(`id="${page}"`))throw Error(`Eksik UI sayfası: ${page}`);
  if(!html.includes(`data-page="${page}"`)&&!html.includes(`data-mobile-page="${page}"`)&&!app.includes(`go('${page}')`))throw Error(`Navigasyon bağlantısı eksik: ${page}`);
}
for(const id of ['authGate','loginTab','registerTab','authEmail','authPassword','app','mobileNav','mobileMore','machineGrid','maintenanceList','toolCards']){
  if(!html.includes(`id="${id}"`))throw Error(`Eksik kritik UI elemanı: ${id}`);
}
if(/id="(?:bootSplash|loginTransition)"/.test(html))throw Error('Blocking login/boot overlay HTML içinde bulunamaz');
if(!app.includes("await api('/api/auth/'+mode")||!app.includes('result.mfa_required')||!app.includes('await enterApp()'))throw Error('Login başarı akışı e-posta/MFA kontrolünden sonra enterApp çağırmalı');
if(!app.includes('bindAuthControls()'))throw Error('Giriş kontrolleri programatik olarak bağlanmalı');
for(const width of ['900px','620px'])if(!css.includes(`max-width:${width}`)&&!css.includes(`max-width: ${width}`))throw Error(`Responsive breakpoint eksik: ${width}`);
if(!css.includes('safe-area-inset-bottom'))throw Error('Mobil safe-area desteği eksik');
if(!css.includes('.mobileNav'))throw Error('Mobil alt navigasyon stili eksik');
if(!pwa.includes("addEventListener('controllerchange'")||!pwa.includes('location.reload()'))throw Error('Service worker sürüm geçişi otomatik yenileme koruması eksik');

console.log(`UI kontrolü başarılı: ${pages.length} modül, login, PWA ve responsive navigasyon doğrulandı.`);
