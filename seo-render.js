'use strict';

const {REVISION_DATE,calculatorSeo,seoArticles}=require('./seo-content');

const DEFAULT_BASE='https://dijitalmakinaci.pro';
const articleBySlug=new Map(seoArticles.map(article=>[article.slug,article]));
const systemLabels={motor:'Motor',bearing:'Rulman',hydraulic:'Hidrolik',pneumatic:'Pnömatik',cnc:'CNC / Servo',electrical:'Elektrik',gearbox:'Redüktör / Aktarma'};
const calculatorCategories={'iso-286-tolerans':'Tolerans','kilavuz-on-delik':'Kılavuz','cnc-kesme':'CNC','rulman-kod':'Rulman',hidrolik:'Hidrolik'};
const publicInfoPages={
  gizlilik:{title:'Gizlilik Politikası',description:'Dijital Makinacı hesabı, firma verileri, teknik kayıtlar, dosyalar ve tarayıcı depolaması hakkında gizlilik açıklaması.',lead:'Hangi verilerin hangi amaçlarla işlendiğini ve hesap sahibi olarak kullanabileceğiniz yolları açıklar.',sections:[
    ['Toplanan bilgiler',['Hesap oluştururken ad, e-posta adresi ve güvenli biçimde işlenen parola bilgileri alınır. Firma üyeliği, rol, oturum ve güvenlik olayları hesapla ilişkilendirilir.','Makine, bakım, arıza, iş emri, stok, teknik ölçüm, not ve yüklenen dosyalar yalnızca kullanıcı tarafından uygulamaya girildiğinde işlenir.']],
    ['Kullanım amaçları',['Veriler; hesabı çalıştırmak, firma kapsamını uygulamak, bakım operasyonlarını kaydetmek, güvenliği sağlamak, destek taleplerini yanıtlamak ve hizmetin teknik sürekliliğini korumak için kullanılır.','Public sayfalarda üçüncü taraf reklam izleyicisi veya analytics sağlayıcısı çalıştırılmaz.']],
    ['Veri ayrımı ve hizmet sağlayıcılar',['Operasyon kayıtları aktif firma üyeliği kapsamında sorgulanır. Yetki denetimleri rol ve firma bağlamında uygulanır.','Barındırma, e-posta, PostgreSQL veritabanı ve dosya depolama için yapılandırılmış altyapı sağlayıcıları yalnızca hizmetin çalışması için gerekli kapsamda veri işleyebilir.']],
    ['Saklama, güvenlik ve silme',['Oturumlar süreli ve güvenli çerezlerle yönetilir. Güvenlik kayıtları kötüye kullanımın önlenmesi için sınırlı süre tutulabilir.','Hesap veya firma verisi silme talebi için uygulama içi destek kanalını ya da İletişim sayfasındaki yapılandırılmış kanalı kullanabilirsiniz. Yasal veya güvenlik gereksinimleri sınırlı kayıtların daha uzun tutulmasını gerektirebilir.']]
  ]},
  'kullanim-kosullari':{title:'Kullanım Koşulları',description:'Dijital Makinacı hesabı, teknik araçlar ve CMMS çalışma alanının temel kullanım koşulları.',lead:'Platformu kullanırken hesap, veri, teknik doğrulama ve kabul edilebilir kullanım sorumluluklarını özetler.',sections:[
    ['Hesap sorumluluğu',['Hesap bilgilerinizi doğru tutmak, parolanızı ve MFA kurtarma kodlarınızı korumak, hesabınız üzerinden yapılan işlemleri izlemek sizin sorumluluğunuzdadır.']],
    ['Firma ve içerik yetkisi',['Yalnızca eklemeye, işlemeye ve ekip üyeleriyle paylaşmaya yetkili olduğunuz firma ve teknik verileri yüklemelisiniz.']],
    ['Teknik bilgi ve hesaplamalar',['Teknik kütüphane ve hesaplama araçları genel ön değerlendirme sağlar. Kritik imalat, bakım ve iş güvenliği kararlarında sonucu güncel standart, üretici talimatı, risk değerlendirmesi ve yetkili uzman görüşüyle doğrulamak kullanıcının sorumluluğundadır.']],
    ['Kabul edilebilir kullanım',['Hizmeti hukuka aykırı içerik, yetkisiz erişim, zararlı dosya, otomatik saldırı, servis engelleme veya başka kullanıcıların verilerine ulaşma amacıyla kullanamazsınız.']],
    ['Hizmet değişiklikleri',['Ürün özellikleri, limitler ve public içerikler güvenlik veya ürün geliştirme gereksinimleriyle güncellenebilir. Planlı bakım veya dış altyapı sorunları geçici kesintiye neden olabilir.']]
  ]},
  cerezler:{title:'Çerez Politikası',description:'Dijital Makinacı oturum çerezi, yerel depolama ve PWA önbelleğinin gerçek kullanımına ilişkin açıklama.',lead:'Sitede kullanılan zorunlu oturum ve tarayıcı depolama mekanizmalarını açıklar.',sections:[
    ['Zorunlu oturum çerezi',['Giriş yapıldığında sunucu, kimlik doğrulaması için dm_token adlı HTTP-only oturum çerezi kullanır. Production ortamında Secure ve SameSite=Lax özellikleri uygulanır; varsayılan oturum süresi yedi gündür.']],
    ['Yerel tarayıcı depolaması',['Bekleyen firma davetini kayıt veya giriş sonrasında sürdürebilmek için davet anahtarı localStorage içinde geçici olarak saklanabilir. PWA ve offline saha özellikleri tarayıcı önbelleği ile desteklenen yerel depolama mekanizmalarını kullanabilir.']],
    ['Analytics ve reklam izleyicileri',['Mevcut public site kodunda üçüncü taraf analytics, reklam pikseli veya davranışsal takip sağlayıcısı etkin değildir. İleride eklenirse bu metin ve gerekiyorsa tercih mekanizması güncellenmelidir.']],
    ['Kontrol seçenekleri',['Tarayıcı ayarlarından çerez ve site verilerini silebilirsiniz. Zorunlu oturum çerezini engellemek girişli CMMS alanının çalışmasını engeller; public teknik sayfalar giriş yapmadan kullanılabilir.']]
  ]},
  iletisim:{title:'İletişim',description:'Dijital Makinacı ürün, hesap ve teknik destek iletişim kanalları.',lead:'Hesap ve ürün desteği için doğrulanmış uygulama içi kanalı kullanın. Yapılandırılmış destek e-postası varsa bu sayfada otomatik gösterilir.',sections:[]}
};
const PUBLIC_INFO_SLUGS=Object.keys(publicInfoPages);

function escapeHtml(value){
  return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function safeJson(value){
  return JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
}

function normalizeBase(value){
  try{
    const url=new URL(String(value||DEFAULT_BASE));
    if(!['http:','https:'].includes(url.protocol))return DEFAULT_BASE;
    return url.origin;
  }catch{return DEFAULT_BASE}
}

function safeDate(value){
  const date=new Date(value||REVISION_DATE);
  return Number.isFinite(date.getTime())?date.toISOString().slice(0,10):REVISION_DATE;
}

function schemaBreadcrumb(base,items){
  return {'@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:`${base}${item.path}`}))};
}

function renderHeader(){
  return `<header class="siteHeader"><div class="siteHeaderInner"><a class="siteBrand" href="/" aria-label="Dijital Makinacı ana sayfa"><img src="/icon-192.png" width="36" height="36" alt=""><span>DİJİTAL MAKİNACI</span></a><nav class="siteDesktopNav" aria-label="Ana menü"><a href="/hesaplamalar">Hesaplamalar</a><a href="/teknik">Teknik Kütüphane</a><a href="/#cmms">CMMS</a><a href="/#nasil-calisir">Nasıl Çalışır</a></nav><div class="siteHeaderActions"><a class="siteLogin" data-track="login_click" href="/app">Giriş</a><a class="siteHeaderCta" data-track="header_signup_click" href="/app?auth=register">Ücretsiz kullan</a><button class="siteMenuButton" type="button" aria-label="Menüyü aç" aria-controls="publicMobileMenu" aria-expanded="false"><span></span><span></span><span></span></button></div></div><div class="siteMobileMenu" id="publicMobileMenu" hidden><nav aria-label="Mobil menü"><a href="/hesaplamalar">Hesaplamalar</a><a href="/teknik">Teknik Kütüphane</a><a href="/#cmms">CMMS</a><a href="/#nasil-calisir">Nasıl Çalışır</a><a href="/#sss">SSS</a><a href="/iletisim">İletişim</a></nav><a class="sitePrimary" data-track="mobile_signup_click" href="/app?auth=register">Ücretsiz hesap oluştur</a></div></header>`;
}

function renderFooter(){
  return `<footer class="siteFooter"><div class="footerGrid"><div class="footerBrand"><a class="siteBrand" href="/"><img src="/icon-192.png" width="36" height="36" alt=""><span>DİJİTAL MAKİNACI</span></a><p>Makine bakım ve dijital atölye platformu.</p></div><div><b>ÜRÜN</b><a href="/#cmms">CMMS</a><a href="/hesaplamalar">Hesaplamalar</a><a href="/teknik">Teknik Kütüphane</a></div><div><b>DESTEK</b><a href="/#sss">SSS</a><a href="/iletisim">İletişim</a><a href="/app?section=account">Uygulama içi yardım</a></div><div><b>YASAL</b><a href="/gizlilik">Gizlilik Politikası</a><a href="/kullanim-kosullari">Kullanım Koşulları</a><a href="/cerezler">Çerez Politikası</a></div><div><b>HESAP</b><a data-track="login_click" href="/app">Giriş</a><a data-track="footer_signup_click" href="/app?auth=register">Kayıt Ol</a></div></div><div class="footerBottom"><span>© 2026 Dijital Makinacı</span><span>Bakım ekipleri için tasarlandı.</span></div></footer>`;
}

function renderLayout({baseUrl,path,title,description,body,schema,nonce,bodyClass=''}){
  const base=normalizeBase(baseUrl),canonical=`${base}${path}`,fullTitle=title.includes('Dijital Makinacı')||title.length>41?title:`${title} • Dijital Makinacı`;
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#071015">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="alternate" hreflang="tr" href="${escapeHtml(canonical)}">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Dijital Makinacı">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(`${base}/icon-512.png`)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <title>${escapeHtml(fullTitle)}</title>
  <link rel="icon" href="/icon-192.png">
  <link rel="stylesheet" href="/site.css?v=${require('./package.json').version}">
  <script type="application/ld+json" id="pageSchema" nonce="${escapeHtml(nonce)}">${safeJson({'@context':'https://schema.org','@graph':schema})}</script>
</head>
<body class="${escapeHtml(bodyClass)}" data-ssr-seo="true">
  ${renderHeader()}
  ${body}
  ${renderFooter()}
  <script src="/site.js?v=${require('./package.json').version}" defer></script>
</body>
</html>`;
}

function renderSections(sections=[]){
  return sections.map(section=>`<section class="seoSection"><h2>${escapeHtml(section.heading)}</h2>${(section.paragraphs||[]).map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}${section.bullets?.length?`<ul class="seoList">${section.bullets.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`:''}</section>`).join('');
}

function renderArticleCards(articles,headingLevel=2){
  const tag=`h${headingLevel}`;
  return articles.map(article=>`<article data-article-category="${escapeHtml(articleCategoryKey(article.category))}" data-article-search="${escapeHtml([article.title,article.category,article.description||article.summary].join(' '))}"><small>${escapeHtml(article.category)}</small><${tag}>${escapeHtml(article.title)}</${tag}><p>${escapeHtml(article.description||article.summary)}</p><a data-track="technical_article_open" href="/teknik/${encodeURIComponent(article.slug)}">Detayı aç →</a></article>`).join('');
}

function renderCalculatorCards(calculators=Object.values(calculatorSeo)){
  return calculators.map(tool=>`<a data-track="calculator_open" href="/hesaplamalar/${encodeURIComponent(tool.slug)}"><small>${escapeHtml(calculatorCategories[tool.slug]||'Teknik araç')}</small><b>${escapeHtml(tool.name)}</b><span>${escapeHtml(tool.intro)}</span><strong>Aracı aç →</strong></a>`).join('');
}

function articleCategoryKey(value){
  const text=String(value||'').toLocaleLowerCase('tr-TR');
  if(text.includes('cnc')||text.includes('talaş'))return 'cnc';
  if(text.includes('hidrolik'))return 'hidrolik';
  if(text.includes('elektrik')||text.includes('motor'))return 'elektrik';
  if(text.includes('rulman')||text.includes('yağlama'))return 'rulman';
  if(text.includes('ölç')||text.includes('tolerans'))return 'olcum';
  if(text.includes('bakım')||text.includes('stok')||text.includes('pompa')||text.includes('redüktör'))return 'bakim';
  return 'mekanik';
}

function renderCalculatorPage(config,{baseUrl,nonce}){
  const base=normalizeBase(baseUrl),path=`/hesaplamalar/${encodeURIComponent(config.slug)}`,related=(config.relatedArticles||[]).map(slug=>articleBySlug.get(slug)).filter(Boolean);
  const faq=(config.faq||[]).map(item=>`<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('');
  const body=`<main class="calcShell">
    <nav class="breadcrumb" aria-label="İçerik yolu"><a href="/">Ana sayfa</a><span>›</span><a href="/hesaplamalar">Hesaplamalar</a><span>›</span><span>${escapeHtml(config.name)}</span></nav>
    <span class="siteBadge">ÜCRETSİZ TEKNİK ARAÇ</span>
    <h1 id="calcTitle">${escapeHtml(config.name)}</h1>
    <p class="siteLead" id="calcIntro">${escapeHtml(config.intro)}</p>
    <p class="articleMeta"><b>Referans:</b> ${escapeHtml(config.standard)} • Son kontrol: ${escapeHtml(REVISION_DATE)}</p>
    <section class="calcCard" aria-label="${escapeHtml(config.name)}"><div class="calcGrid" id="calcFields"></div><button id="calculateBtn" type="button">Hesapla →</button><div class="calcResult" id="calcResult" aria-live="polite">Değerleri girip hesapla düğmesine basın.</div><div class="shareRow"><button id="shareResult" type="button">Sonucu paylaş</button><a class="siteGhost" id="whatsappShare" href="https://wa.me/?text=${encodeURIComponent(config.name+' '+base+path)}" target="_blank" rel="noopener">WhatsApp</a></div></section>
    <article class="seoContent">${renderSections(config.sections)}
      ${faq?`<section class="seoSection"><h2>Sık sorulan sorular</h2><div class="faqList">${faq}</div></section>`:''}
      ${related.length?`<section class="seoSection"><h2>İlgili teknik rehberler</h2><div class="articleGrid relatedGrid">${renderArticleCards(related,3)}</div></section>`:''}
      <aside class="seoNotice"><b>Güvenlik notu:</b> Sonuçlar ön değerlendirme içindir. Güncel standart, üretici talimatı, risk değerlendirmesi ve yetkili mühendislik kararı önceliklidir.</aside>
    </article>
  </main>`;
  const schema=[
    {'@type':'WebApplication','@id':`${base}${path}#app`,name:config.name,url:`${base}${path}`,description:config.description,applicationCategory:'EngineeringApplication',operatingSystem:'Web',inLanguage:'tr',isAccessibleForFree:true,dateModified:REVISION_DATE,publisher:{'@type':'Organization',name:'Dijital Makinacı',url:base}},
    schemaBreadcrumb(base,[{name:'Ana sayfa',path:'/'},{name:'Hesaplamalar',path:'/hesaplamalar'},{name:config.name,path}]),
    ...(config.faq?.length?[{'@type':'FAQPage','@id':`${base}${path}#faq`,mainEntity:config.faq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))}]:[])
  ];
  return renderLayout({baseUrl:base,path,title:config.title,description:config.description,body,schema,nonce,bodyClass:'calculatorPage'});
}

function normalizeArticle(article){
  if(article.sections)return article;
  return {
    slug:article.slug,title:article.title,category:article.category||'Teknik Kütüphane',description:article.summary||`${article.title} teknik rehberi.`,standard:article.standard||'',source:article.source||'Dijital Makinacı',revisionDate:safeDate(article.revision_date||article.updated_at),relatedTools:Array.isArray(article.related_tools)?article.related_tools:[],relatedSystems:Array.isArray(article.related_systems)?article.related_systems:[],relatedArticles:[],sections:String(article.body||'').split(/\n{2,}/).filter(Boolean).map((paragraph,index)=>({heading:index===0?'Teknik açıklama':null,paragraphs:[paragraph]}))
  };
}

function renderArticlePage(input,{baseUrl,nonce}){
  const article=normalizeArticle(input),base=normalizeBase(baseUrl),path=`/teknik/${encodeURIComponent(article.slug)}`;
  const relatedArticles=(article.relatedArticles||[]).map(slug=>articleBySlug.get(slug)).filter(Boolean);
  const toolLinks=(article.relatedTools||[]).map(slug=>calculatorSeo[slug]).filter(Boolean);
  const systems=(article.relatedSystems||[]).map(key=>systemLabels[key]||key);
  const articleSections=article.sections.map((section,index)=>({heading:section.heading||`Uygulama notu ${index+1}`,paragraphs:section.paragraphs,bullets:section.bullets}));
  const body=`<main class="articleShell">
    <nav class="breadcrumb" aria-label="İçerik yolu"><a href="/">Ana sayfa</a><span>›</span><a href="/teknik">Teknik kütüphane</a><span>›</span><span>${escapeHtml(article.title)}</span></nav>
    <span class="siteBadge" id="articleCategory">${escapeHtml(article.category)}</span>
    <h1 id="articleTitle">${escapeHtml(article.title)}</h1>
    <p class="siteLead">${escapeHtml(article.description)}</p>
    <p class="articleMeta" id="articleMeta">${[article.standard,article.source,`Revizyon: ${article.revisionDate}`].filter(Boolean).map(escapeHtml).join(' • ')}</p>
    <article class="articleBody seoContent" id="articleBody">${renderSections(articleSections)}
      ${toolLinks.length?`<section class="seoSection"><h2>İlgili hesaplama araçları</h2><div class="toolGrid relatedTools">${renderCalculatorCards(toolLinks)}</div></section>`:''}
      ${systems.length?`<section class="seoSection"><h2>İlgili sistemler</h2><p>${systems.map(escapeHtml).join(' • ')}</p><a class="siteGhost" href="/app?section=diagnosis">Arıza Teşhis Merkezi’ni aç →</a></section>`:''}
      ${relatedArticles.length?`<section class="seoSection"><h2>İlgili teknik rehberler</h2><div class="articleGrid relatedGrid">${renderArticleCards(relatedArticles,3)}</div></section>`:''}
      <aside class="seoSource"><b>Kaynak yaklaşımı:</b> ${escapeHtml(article.source)}<br><b>Standart / referans:</b> ${escapeHtml(article.standard||'Üretici talimatı ve işletme prosedürü')}<br><b>Son içerik kontrolü:</b> ${escapeHtml(article.revisionDate)}</aside>
    </article>
  </main>`;
  const schema=[
    {'@type':'TechArticle','@id':`${base}${path}#article`,headline:article.title,name:article.title,description:article.description,url:`${base}${path}`,inLanguage:'tr',datePublished:article.revisionDate,dateModified:article.revisionDate,articleSection:article.category,author:{'@type':'Organization',name:'Dijital Makinacı',url:base},publisher:{'@type':'Organization',name:'Dijital Makinacı',url:base},mainEntityOfPage:{'@type':'WebPage','@id':`${base}${path}`}},
    schemaBreadcrumb(base,[{name:'Ana sayfa',path:'/'},{name:'Teknik kütüphane',path:'/teknik'},{name:article.title,path}])
  ];
  return renderLayout({baseUrl:base,path,title:article.title,description:article.description,body,schema,nonce,bodyClass:'articlePage'});
}

function renderLibraryPage(articles,{baseUrl,nonce}){
  const base=normalizeBase(baseUrl),path='/teknik',description='Makine bakımı, hidrolik, CNC, rulman, elektrik motoru, kestirimci bakım ve yedek parça yönetimi için kaynaklı teknik rehberler.';
  const filters=[['all','Tümü'],['cnc','CNC'],['mekanik','Mekanik'],['hidrolik','Hidrolik'],['elektrik','Elektrik'],['bakim','Bakım'],['rulman','Rulman'],['olcum','Ölçüm']];
  const body=`<main class="libraryShell"><nav class="breadcrumb" aria-label="İçerik yolu"><a href="/">Ana sayfa</a><span>›</span><span>Teknik Kütüphane</span></nav><span class="siteBadge">ATÖLYE REFERANS MASASI</span><h1>Teknik Kütüphane</h1><p class="siteLead">CNC, mekanik, elektrik, hidrolik, bakım ve ölçüm konularında pratik teknik rehberler.</p><section class="libraryControls" aria-label="Teknik içerik arama ve filtreleme"><label class="librarySearch" for="librarySearch"><span aria-hidden="true">⌕</span><input id="librarySearch" type="search" placeholder="Teknik konu ara..." autocomplete="off"></label><div class="filterChips" aria-label="Kategori filtreleri">${filters.map(([key,label],index)=>`<button type="button" data-library-filter="${key}" aria-pressed="${index===0?'true':'false'}" class="${index===0?'active':''}">${label}</button>`).join('')}</div><p class="libraryCount" id="libraryCount" aria-live="polite">${articles.length} rehber gösteriliyor</p></section><div class="articleGrid libraryGrid" data-library-grid>${renderArticleCards(articles,2)}</div><div class="libraryEmpty" id="libraryEmpty" hidden>Aramanızla eşleşen teknik rehber bulunamadı.</div></main>`;
  const schema=[{'@type':'CollectionPage',name:'Dijital Makinacı Teknik Kütüphane',description,url:`${base}${path}`,inLanguage:'tr',mainEntity:{'@type':'ItemList',numberOfItems:articles.length,itemListElement:articles.map((article,index)=>({'@type':'ListItem',position:index+1,name:article.title,url:`${base}/teknik/${encodeURIComponent(article.slug)}`}))}},schemaBreadcrumb(base,[{name:'Ana sayfa',path:'/'},{name:'Teknik kütüphane',path}])];
  return renderLayout({baseUrl:base,path,title:'Teknik Kütüphane | Makine Bakım Rehberleri',description,body,schema,nonce,bodyClass:'libraryPage'});
}

function renderCalculatorIndexPage({baseUrl,nonce}){
  const base=normalizeBase(baseUrl),path='/hesaplamalar',tools=Object.values(calculatorSeo),description='ISO 286 tolerans, kılavuz ön delik, CNC devir-ilerleme, rulman kodu ve hidrolik kuvvet hesaplama araçlarını ücretsiz kullanın.';
  const body=`<main class="libraryShell"><nav class="breadcrumb" aria-label="İçerik yolu"><a href="/">Ana sayfa</a><span>›</span><span>Hesaplama araçları</span></nav><span class="siteBadge">ÜCRETSİZ TEKNİK ARAÇLAR</span><h1>Atölye hesaplamalarını güvenle başlatın</h1><p class="siteLead">İmalat ve bakımda sık kullanılan hesapları hızlıca yapın; açıklama, referans ve güvenlik notlarıyla sonucu doğru yorumlayın.</p><div class="toolCategoryIntro" aria-label="Araç kategorileri"><span>CNC</span><span>Tolerans</span><span>Kılavuz</span><span>Rulman</span><span>Hidrolik</span></div><div class="toolGrid libraryGrid">${renderCalculatorCards(tools)}</div></main>`;
  const schema=[{'@type':'CollectionPage',name:'Dijital Makinacı Hesaplama Araçları',description,url:`${base}${path}`,inLanguage:'tr',mainEntity:{'@type':'ItemList',numberOfItems:tools.length,itemListElement:tools.map((tool,index)=>({'@type':'ListItem',position:index+1,name:tool.name,url:`${base}/hesaplamalar/${encodeURIComponent(tool.slug)}`}))}},schemaBreadcrumb(base,[{name:'Ana sayfa',path:'/'},{name:'Hesaplama araçları',path}])];
  return renderLayout({baseUrl:base,path,title:'Teknik Hesaplama Araçları | CNC, ISO 286, Hidrolik',description,body,schema,nonce,bodyClass:'libraryPage'});
}

function renderPublicInfoPage(slug,{baseUrl,nonce}){
  const page=publicInfoPages[slug];
  if(!page)return null;
  const base=normalizeBase(baseUrl),path=`/${slug}`;
  const sections=page.sections.map(([heading,paragraphs])=>`<section class="infoSection"><h2>${escapeHtml(heading)}</h2>${paragraphs.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('');
  const contact=slug==='iletisim'
    ?'<div class="contactCards"><article><h2>Uygulama içi destek</h2><p>Hesabınızla ilgili destek kaydı açın; konu ve açıklama firma bağlamında yetkili ekibe iletilir.</p><a class="sitePrimary" href="/app?section=account">Hesaba gir ve destek al</a></article><article><h2>E-posta kanalı</h2><p id="publicSupportText">Yapılandırılmış destek adresi kontrol ediliyor. Sahte veya doğrulanmamış bir adres gösterilmez.</p><a class="siteGhost" id="publicSupportEmail" hidden>E-posta gönder</a></article></div>'
    :`<div class="infoContent">${sections}</div>`;
  const body=`<main class="infoShell"><nav class="breadcrumb" aria-label="İçerik yolu"><a href="/">Ana sayfa</a><span>›</span><span>${escapeHtml(page.title)}</span></nav><div class="infoHero"><span class="siteBadge">DİJİTAL MAKİNACI</span><h1>${escapeHtml(page.title)}</h1><p class="siteLead">${escapeHtml(page.lead)}</p></div>${contact}</main>`;
  const schema=[{'@type':'WebPage',name:page.title,description:page.description,url:`${base}${path}`,inLanguage:'tr',dateModified:REVISION_DATE,publisher:{'@type':'Organization',name:'Dijital Makinacı',url:base}},schemaBreadcrumb(base,[{name:'Ana sayfa',path:'/'},{name:page.title,path}])];
  return renderLayout({baseUrl:base,path,title:page.title,description:page.description,body,schema,nonce,bodyClass:'infoPage'});
}

module.exports={escapeHtml,normalizeBase,normalizeArticle,renderCalculatorPage,renderArticlePage,renderLibraryPage,renderCalculatorIndexPage,renderPublicInfoPage,PUBLIC_INFO_SLUGS};
