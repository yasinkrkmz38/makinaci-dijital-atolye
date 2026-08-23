'use strict';

const base=(process.env.SMOKE_BASE_URL||'https://dijitalmakinaci.pro').replace(/\/$/,'');
const expectedVersion=require('../package.json').version;

async function request(path,expected=200,options={}){
  const response=await fetch(base+path,{redirect:'manual',...options});
  if(response.status!==expected)throw Error(`${path}: ${response.status}, beklenen ${expected}`);
  return response;
}

(async()=>{
  const health=await (await request('/api/health')).json();
  if(!health.ok||health.version!==expectedVersion)throw Error(`Health sürümü hatalı: ${JSON.stringify(health)}`);
  const html=await (await request('/')).text();
  if(!html.includes(`name="app-version" content="${expectedVersion}"`)&&!html.includes(`content="${expectedVersion}" name="app-version"`))throw Error('Production HTML app-version etiketi hatalı');
  const js=await request('/v1621-app.js');
  if(!String(js.headers.get('content-type')).includes('javascript')||(await js.text()).trimStart().startsWith('<'))throw Error('Production JS yanıtı geçersiz');
  for(const path of ['/v1621-style.css','/appstore-v17.css']){
    const css=await request(path);
    if(!String(css.headers.get('content-type')).includes('css')||(await css.text()).trimStart().startsWith('<'))throw Error(`${path}: CSS yanıtı geçersiz`);
  }
  const worker=await (await request('/service-worker.js')).text();
  if(!worker.includes(`APP_VERSION='${expectedVersion}'`)||worker.includes('patchLoginFlow'))throw Error('Production service worker içeriği geçersiz');
  for(const path of ['/manifest.webmanifest','/forgot-password.html','/reset-password.html','/admin'])await request(path);
  await request('/api/auth/me',401);
  await request('/api/auth/login',401,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  await request('/api/auth/register',400,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  const reset=await (await request('/api/auth/reset-password/validate?token=invalid-smoke-token')).json();
  if(reset.valid!==false)throw Error('Geçersiz reset tokenı reddedilmedi');
  const missing=await request('/api/codex-smoke-not-found',404);
  if(!String(missing.headers.get('content-type')).includes('application/json'))throw Error('Bilinmeyen API route JSON dönmedi');
  console.log(`Smoke test başarılı: ${base}`);
})().catch(error=>{console.error(error);process.exit(1)});
