'use strict';

const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const html=read('app.html');
const app=read('app.js');
const pwa=read('pwa.js');
const admin=read('admin.js');
const actions=read('actions.js');
const site=read('site.js');
const siteCss=read('site.css');
const css=read('style.css')+read('mobile.css');

const pages=['dashboard','machines','maintenance','calendar','workorders','diagnosis','analytics','parts','tools','library','team','account'];
for(const page of pages){
  if(!html.includes(`id="${page}"`))throw Error(`Eksik UI sayfası: ${page}`);
  if(!html.includes(`data-page="${page}"`)&&!html.includes(`data-mobile-page="${page}"`)&&!app.includes(`go('${page}')`))throw Error(`Navigasyon bağlantısı eksik: ${page}`);
}
for(const id of ['authGate','authTitle','authSubmit','loginTab','registerTab','authEmail','authPassword','app','mobileNav','mobileMore','machineGrid','maintenanceList','toolCards']){
  if(!html.includes(`id="${id}"`))throw Error(`Eksik kritik UI elemanı: ${id}`);
}
if(/id="(?:bootSplash|loginTransition)"/.test(html))throw Error('Blocking login/boot overlay HTML içinde bulunamaz');
if(!app.includes("await api('/api/auth/'+mode")||!app.includes('result.mfa_required')||!app.includes('await enterApp()'))throw Error('Login başarı akışı e-posta/MFA kontrolünden sonra enterApp çağırmalı');
if(!app.includes("me.email_verification_required===true&&me.email_verified===false"))throw Error('E-posta doğrulama kısıtı yalnızca zorunlu politika açıkken uygulanmalı');
if(!app.includes("'Doğrulanmadı · İsteğe bağlı'"))throw Error('Hesap güvenliği isteğe bağlı e-posta doğrulama durumunu göstermeli');
if(!app.includes('bindAuthControls()'))throw Error('Giriş kontrolleri programatik olarak bağlanmalı');
for(const width of ['900px','620px'])if(!css.includes(`max-width:${width}`)&&!css.includes(`max-width: ${width}`))throw Error(`Responsive breakpoint eksik: ${width}`);
if(!css.includes('safe-area-inset-bottom'))throw Error('Mobil safe-area desteği eksik');
if(!css.includes('.mobileNav'))throw Error('Mobil alt navigasyon stili eksik');
if(!css.includes('.mobileMoreGrid')||!app.includes('data-mobile-page="account"')||!app.includes('data-mobile-icon="machine"'))throw Error('Mobil hızlı menü ve beşli alt navigasyon eksik');
for(const component of ['mobileQuickTools','mobileMaintenanceSummary','mobileFlowSteps','mobileSkeletonList','setupMobileForm'])if(!app.includes(component))throw Error(`Mobil UI bileşeni eksik: ${component}`);
for(const component of ['accountActions','accountButtonPrimary','accountInfoBanner','sessionTitleRow','sessionMeta','sessionActions'])if(!app.includes(component))throw Error(`Hesabım mobil bileşeni eksik: ${component}`);
if(!css.includes('overflow-x:hidden')||!css.includes('min-height:44px'))throw Error('Mobil taşma ve dokunmatik hedef koruması eksik');
if(!css.includes('--account-section-gap:16px')||!css.includes('--account-control-height:50px')||!css.includes('padding-bottom:calc(78px + env(safe-area-inset-bottom) + 24px)'))throw Error('Hesabım mobil spacing ve alt navigasyon koruması eksik');
if(!siteCss.includes('grid-template-columns:repeat(2,minmax(0,1fr))')||!siteCss.includes('Mobile public experience'))throw Error('Public mobil ana sayfa ve araç grid katmanı eksik');
if(!css.includes('DESKTOP PRO UI')||(!css.includes('min-width:901px')&&!css.includes('min-width: 901px')))throw Error('Mobil tasarım dilini kullanan masaüstü UI katmanı eksik');
if(!css.includes('backdrop-filter:blur(22px)')||!css.includes('--dp-radius:20px'))throw Error('Masaüstü cam yüzey ve kart tasarım değişkenleri eksik');
if(!css.includes('DESKTOP LIGHT INDUSTRIAL EXPERIENCE')||!css.includes('--dp-green:#2d6cdf'))throw Error('Açık yüzeyli masaüstü ürün tasarım katmanı eksik');
if(!siteCss.includes('Desktop public experience'))throw Error('Public masaüstü tasarım katmanı eksik');
if(!read('admin.css').includes('Desktop Admin Center'))throw Error('Admin Center masaüstü tasarım katmanı eksik');
if(!pwa.includes("addEventListener('controllerchange'")||!pwa.includes('location.reload()'))throw Error('Service worker sürüm geçişi otomatik yenileme koruması eksik');
if(admin.includes("location.href='/';return")||!admin.includes("'Platform yetkisi gerekli'")||!admin.includes("'MFA kurulumu gerekli'")||!admin.includes("'Çıkış yap ve yeniden gir'")||!admin.includes('adminRelogin'))throw Error('Admin Center yetki/MFA kapısı açıklayıcı olmalı ve MFA doğrulamalı yeniden giriş sunmalı');
if(!actions.includes('function associateLabels(')||!actions.includes('label.htmlFor=control.id'))throw Error('Dinamik uygulama for/id etiket ilişkisi kurmalı');
if(!actions.includes('enhancePasswordInputs')||!actions.includes("aria-label','Şifreyi göster"))throw Error('Şifre göster/gizle erişilebilir kontrolü eksik');
if(!site.includes('resetInvalidCalculatorShare')||!site.includes("output.classList.contains('error')"))throw Error('Geçersiz hesap sonucu eski paylaşım metnini korumamalı');

console.log(`UI kontrolü başarılı: ${pages.length} modül, login, PWA ve responsive navigasyon doğrulandı.`);
