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
  for(const path of ['/','/v1621-app.js','/v1621-style.css','/appstore-v17.css','/manifest.webmanifest','/service-worker.js','/admin'])await request(path);
  await request('/api/auth/me',401);
  await request('/api/auth/login',401,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  await request('/api/auth/register',400,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  console.log(`Smoke test başarılı: ${base}`);
})().catch(error=>{console.error(error);process.exit(1)});
