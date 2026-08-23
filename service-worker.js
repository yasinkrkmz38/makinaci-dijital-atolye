const VERSION='dm-v17.0.0-mobile-pro';
const SHELL=[
  '/',
  '/style.css?v=16.2.0',
  '/v1621-style.css?v=16.2.0',
  '/mobile-pro.css?v=17.0.0',
  '/app.js?v=16.2.0',
  '/manifest.webmanifest?v=16.2.0',
  '/forgot-password.html',
  '/reset-password.html',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(VERSION)
      .then(async cache=>{
        for(const url of SHELL){
          try{
            const r=await fetch(url,{cache:'reload'});
            if(r.ok)await cache.put(url,r.clone());
          }catch{}
        }
      })
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/'))return;

  if(req.mode==='navigate'){
    event.respondWith(fetch(req).catch(()=>caches.match('/')));
    return;
  }

  event.respondWith(
    fetch(req)
      .then(r=>{
        const copy=r.clone();
        if(r.ok)caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});
        return r;
      })
      .catch(()=>caches.match(req))
  );
});
