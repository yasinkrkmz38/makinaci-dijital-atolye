'use strict';

const base=(process.env.SMOKE_BASE_URL||'https://dijitalmakinaci.pro').replace(/\/$/,'');
const expectedVersion=require('../package.json').version;
const expectedCommit=String(process.env.SMOKE_EXPECTED_COMMIT||'').trim();

async function request(path,expected=200,options={}){
  const response=await fetch(base+path,{redirect:'manual',...options});
  if(response.status!==expected)throw Error(`${path}: ${response.status}, beklenen ${expected}`);
  return response;
}

(async()=>{
  const health=await (await request('/api/health')).json();
  if(!health.ok||health.version!==expectedVersion)throw Error(`Health sürümü hatalı: ${JSON.stringify(health)}`);
  if(health.checks?.database!=='ok')throw Error(`Health veritabanı kontrolü başarısız: ${JSON.stringify(health.checks)}`);
  if(expectedCommit&&health.commit!==expectedCommit)throw Error(`Health commit'i hatalı: ${health.commit||'yok'}, beklenen ${expectedCommit}`);
  const publicHtml=await (await request('/')).text();
  if(!publicHtml.includes('Dijital Makinacı')||!publicHtml.includes('/app'))throw Error('Public site yanıtı geçersiz');
  if((publicHtml.match(/href="\/teknik\//g)||[]).length<6)throw Error('Ana sayfada taranabilir teknik makale bağlantıları eksik');
  const calculatorResponse=await request('/hesaplamalar/iso-286-tolerans'),calculatorHtml=await calculatorResponse.text();
  if(!calculatorHtml.includes('<title>ISO 286 Tolerans Hesaplama')||!calculatorHtml.includes(`rel="canonical" href="${base}/hesaplamalar/iso-286-tolerans"`)||!calculatorHtml.includes('"@type":"WebApplication"')||!calculatorHtml.includes('"@type":"FAQPage"'))throw Error('Hesaplama sayfası SSR SEO içeriği geçersiz');
  const calculatorCsp=String(calculatorResponse.headers.get('content-security-policy')||'');
  if(!calculatorCsp.includes("script-src 'self' 'nonce-")||calculatorCsp.includes("script-src 'self' 'unsafe-inline'"))throw Error('SEO sayfası nonce tabanlı CSP kullanmıyor');
  const articleHtml=await (await request('/teknik/elektrik-motoru-periyodik-bakim')).text();
  if(!articleHtml.includes('Elektrik Motoru Periyodik Bakım')||!articleHtml.includes(`rel="canonical" href="${base}/teknik/elektrik-motoru-periyodik-bakim"`)||!articleHtml.includes('"@type":"TechArticle"'))throw Error('Teknik makale SSR SEO içeriği geçersiz');
  const libraryHtml=await (await request('/teknik')).text();
  if((libraryHtml.match(/href="\/teknik\//g)||[]).length<15||!libraryHtml.includes('"@type":"CollectionPage"'))throw Error('Teknik kütüphane dizini eksik');
  const calculatorsHtml=await (await request('/hesaplamalar')).text();
  if((calculatorsHtml.match(/href="\/hesaplamalar\//g)||[]).length<5)throw Error('Hesaplama araçları dizini eksik');
  const publicArticles=await (await request('/api/public/articles?limit=50')).json();
  if(!Array.isArray(publicArticles)||publicArticles.length<15)throw Error('Public teknik makale API içeriği eksik');
  const appHtml=await (await request('/app')).text();
  if(!appHtml.includes(`name="app-version" content="${expectedVersion}"`)&&!appHtml.includes(`content="${expectedVersion}" name="app-version"`))throw Error('Production app-version etiketi hatalı');
  const js=await request('/app.js');
  if(!String(js.headers.get('content-type')).includes('javascript')||(await js.text()).trimStart().startsWith('<'))throw Error('Production JS yanıtı geçersiz');
  for(const assetPath of ['/style.css','/mobile.css','/site.css']){
    const css=await request(assetPath);
    if(!String(css.headers.get('content-type')).includes('css')||(await css.text()).trimStart().startsWith('<'))throw Error(`${assetPath}: CSS yanıtı geçersiz`);
  }
  const worker=await (await request('/service-worker.js')).text();
  if(!worker.includes(`APP_VERSION='${expectedVersion}'`)||worker.includes('patchLoginFlow'))throw Error('Production service worker içeriği geçersiz');
  for(const assetPath of ['/manifest.webmanifest','/forgot-password.html','/reset-password.html','/verify-email.html','/admin'])await request(assetPath);
  const robots=await (await request('/robots.txt')).text();
  if(!robots.includes(`Sitemap: ${base}/sitemap.xml`)||!robots.includes('Disallow: /app'))throw Error('robots.txt geçersiz');
  const sitemap=await (await request('/sitemap.xml')).text();
  if((sitemap.match(/<url>/g)||[]).length<26||!sitemap.includes(`${base}/teknik/`)||!sitemap.includes(`${base}/hesaplamalar/`))throw Error('Sitemap public SEO URL listesini içermiyor');
  await request('/api/auth/me',401);
  await request('/api/auth/login',401,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  await request('/api/auth/register',400,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  const reset=await (await request('/api/auth/reset-password/validate?token=invalid-smoke-token')).json();
  if(reset.valid!==false)throw Error('Geçersiz reset tokenı reddedilmedi');
  const missingApi=await request('/api/codex-smoke-not-found',404);
  if(!String(missingApi.headers.get('content-type')).includes('application/json'))throw Error('Bilinmeyen API route JSON dönmedi');
  const missingPage=await request('/codex-smoke-not-found',404);
  if(!String(missingPage.headers.get('content-type')).includes('html'))throw Error('Bilinmeyen public route HTML 404 dönmedi');
  console.log(`Smoke test başarılı: ${base}`);
})().catch(error=>{console.error(error);process.exit(1)});
