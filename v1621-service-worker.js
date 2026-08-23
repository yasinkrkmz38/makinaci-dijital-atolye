const VERSION='dm-v17.1-appstore-mobile';
const MOBILE_CSS='/appstore-v17.css?v=17.1.0';
const SHELL=[
  '/',
  '/v1621-app.js?v=16.2.1',
  '/manifest.webmanifest?v=16.2.1',
  MOBILE_CSS,
  '/forgot-password.html',
  '/reset-password.html',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(VERSION).then(async cache=>{
      for(const url of SHELL){
        try{
          const r=await fetch(url,{cache:'reload'});
          if(r.ok)await cache.put(url,r.clone());
        }catch{}
      }
    }).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)));
    await self.clients.claim();
    const windows=await self.clients.matchAll({type:'window'});
    await Promise.all(windows.map(client=>client.navigate(client.url).catch(()=>null)));
  })());
});

async function mergedStyle(req){
  const base=await fetch(req,{cache:'no-store'});
  if(!base.ok)return base;
  let mobile='';
  try{
    const extra=await fetch(MOBILE_CSS,{cache:'no-store'});
    if(extra.ok)mobile=await extra.text();
  }catch{}
  if(!mobile)return base;
  const css=await base.text();
  const headers=new Headers(base.headers);
  headers.set('Content-Type','text/css; charset=utf-8');
  headers.set('Cache-Control','no-store, no-cache, must-revalidate, max-age=0');
  headers.delete('Content-Length');
  return new Response(`${css}\n\n/* APP STORE MOBILE V17.1 */\n${mobile}`,{
    status:base.status,
    statusText:base.statusText,
    headers
  });
}

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/'))return;

  if(url.pathname==='/v1621-style.css'){
    event.respondWith(mergedStyle(req).catch(()=>fetch(req)));
    return;
  }

  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match('/')));
    return;
  }

  event.respondWith(
    fetch(req).then(r=>{
      const copy=r.clone();
      if(r.ok)caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});
      return r;
    }).catch(()=>caches.match(req))
  );
});
