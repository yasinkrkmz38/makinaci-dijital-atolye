'use strict';

const {REVISION_DATE,calculatorSeo,seoArticles}=require('./seo-content');

const DEFAULT_BASE='https://dijitalmakinaci.pro';
const articleBySlug=new Map(seoArticles.map(article=>[article.slug,article]));
const systemLabels={motor:'Motor',bearing:'Rulman',hydraulic:'Hidrolik',pneumatic:'Pnömatik',cnc:'CNC / Servo',electrical:'Elektrik',gearbox:'Redüktör / Aktarma'};

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
  return `<header class="siteHeader"><a class="siteBrand" href="/">⚙ <b>DİJİTAL MAKİNACI</b></a><nav aria-label="Ana menü"><a href="/hesaplamalar">Hesaplamalar</a><a href="/teknik">Teknik kütüphane</a><a href="/#cmms">CMMS</a><a class="siteLogin" href="/app">Uygulamaya gir →</a></nav></header>`;
}

function renderFooter(){
  return `<footer><b>⚙ DİJİTAL MAKİNACI</b><span>© 2026 • Makine bakım ve teknik bilgi platformu</span><a href="/app">Giriş / Kayıt</a></footer>`;
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
  return articles.map(article=>`<article><small>${escapeHtml(article.category)}</small><${tag}>${escapeHtml(article.title)}</${tag}><p>${escapeHtml(article.description||article.summary)}</p><a href="/teknik/${encodeURIComponent(article.slug)}">Makaleyi oku →</a></article>`).join('');
}

function renderCalculatorCards(calculators=Object.values(calculatorSeo)){
  return calculators.map(tool=>`<a href="/hesaplamalar/${encodeURIComponent(tool.slug)}"><b>${escapeHtml(tool.name)}</b><span>${escapeHtml(tool.intro)}</span></a>`).join('');
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
  const body=`<main class="libraryShell"><nav class="breadcrumb" aria-label="İçerik yolu"><a href="/">Ana sayfa</a><span>›</span><span>Teknik kütüphane</span></nav><span class="siteBadge">TEKNİK KÜTÜPHANE</span><h1>Makine bakım ve atölye teknik rehberleri</h1><p class="siteLead">Sahada uygulanabilir kontrol sıraları, kabul ölçütleri, hesaplama bağlantıları ve revizyon bilgileriyle hazırlanan teknik içerikler.</p><div class="articleGrid libraryGrid">${renderArticleCards(articles,2)}</div></main>`;
  const schema=[{'@type':'CollectionPage',name:'Dijital Makinacı Teknik Kütüphane',description,url:`${base}${path}`,inLanguage:'tr',mainEntity:{'@type':'ItemList',numberOfItems:articles.length,itemListElement:articles.map((article,index)=>({'@type':'ListItem',position:index+1,name:article.title,url:`${base}/teknik/${encodeURIComponent(article.slug)}`}))}},schemaBreadcrumb(base,[{name:'Ana sayfa',path:'/'},{name:'Teknik kütüphane',path}])];
  return renderLayout({baseUrl:base,path,title:'Teknik Kütüphane | Makine Bakım Rehberleri',description,body,schema,nonce,bodyClass:'libraryPage'});
}

function renderCalculatorIndexPage({baseUrl,nonce}){
  const base=normalizeBase(baseUrl),path='/hesaplamalar',tools=Object.values(calculatorSeo),description='ISO 286 tolerans, kılavuz ön delik, CNC devir-ilerleme, rulman kodu ve hidrolik kuvvet hesaplama araçlarını ücretsiz kullanın.';
  const body=`<main class="libraryShell"><nav class="breadcrumb" aria-label="İçerik yolu"><a href="/">Ana sayfa</a><span>›</span><span>Hesaplama araçları</span></nav><span class="siteBadge">ÜCRETSİZ TEKNİK ARAÇLAR</span><h1>Makine ve atölye hesaplama araçları</h1><p class="siteLead">İmalat ve bakımda sık kullanılan hesapları hızlıca yapın; her aracın altındaki açıklama ve referanslarla sonucu doğru yorumlayın.</p><div class="toolGrid libraryGrid">${renderCalculatorCards(tools)}</div></main>`;
  const schema=[{'@type':'CollectionPage',name:'Dijital Makinacı Hesaplama Araçları',description,url:`${base}${path}`,inLanguage:'tr',mainEntity:{'@type':'ItemList',numberOfItems:tools.length,itemListElement:tools.map((tool,index)=>({'@type':'ListItem',position:index+1,name:tool.name,url:`${base}/hesaplamalar/${encodeURIComponent(tool.slug)}`}))}},schemaBreadcrumb(base,[{name:'Ana sayfa',path:'/'},{name:'Hesaplama araçları',path}])];
  return renderLayout({baseUrl:base,path,title:'Teknik Hesaplama Araçları | CNC, ISO 286, Hidrolik',description,body,schema,nonce,bodyClass:'libraryPage'});
}

module.exports={escapeHtml,normalizeBase,normalizeArticle,renderCalculatorPage,renderArticlePage,renderLibraryPage,renderCalculatorIndexPage};
