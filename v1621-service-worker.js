const VERSION='dm-v17.2-integrity-p3';
const MOBILE_CSS='/appstore-v17.css?v=17.2.0';
const INTEGRITY_JS='/v172-integrity.js?v=17.2.0';

const SHELL=[
  '/',
  '/v1621-app.js?v=16.2.1',
  '/v1621-style.css?v=16.2.1',
  '/manifest.webmanifest?v=16.2.1',
  MOBILE_CSS,
  INTEGRITY_JS,
  '/forgot-password.html',
  '/reset-password.html',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(VERSION);
    for(const url of SHELL){
      try{
        const response=await fetch(url,{cache:'reload'});
        if(response.ok)await cache.put(url,response.clone());
      }catch{}
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(
      keys
        .filter(key=>key.startsWith('dm-') && key!==VERSION)
        .map(key=>caches.delete(key))
    );
    await self.clients.claim();
  })());
});

async function mergedStyle(request){
  const [baseResult,mobileResult]=await Promise.allSettled([
    fetch(request,{cache:'no-store'}),
    fetch(MOBILE_CSS,{cache:'no-store'})
  ]);

  if(baseResult.status!=='fulfilled' || !baseResult.value.ok){
    return fetch(request);
  }

  const base=baseResult.value;
  let mobile='';

  if(mobileResult.status==='fulfilled' && mobileResult.value.ok){
    mobile=await mobileResult.value.text();
  }

  if(!mobile)return base;

  const css=await base.text();
  const headers=new Headers(base.headers);
  headers.set('Content-Type','text/css; charset=utf-8');
  headers.set('Cache-Control','no-store, no-cache, must-revalidate, max-age=0');
  headers.delete('Content-Length');

  return new Response(`${css}\n\n/* DIJITAL MAKINACI MOBILE PRO V17.2 */\n${mobile}`,{
    status:base.status,
    statusText:base.statusText,
    headers
  });
}

async function mergedApp(request){
  const [baseResult,fixResult]=await Promise.allSettled([
    fetch(request,{cache:'no-store'}),
    fetch(INTEGRITY_JS,{cache:'no-store'})
  ]);

  if(baseResult.status!=='fulfilled' || !baseResult.value.ok){
    return fetch(request);
  }

  const base=baseResult.value;
  let fixes='';

  if(fixResult.status==='fulfilled' && fixResult.value.ok){
    fixes=await fixResult.value.text();
  }

  if(!fixes)return base;

  const js=await base.text();
  const headers=new Headers(base.headers);
  headers.set('Content-Type','application/javascript; charset=utf-8');
  headers.set('Cache-Control','no-store, no-cache, must-revalidate, max-age=0');
  headers.delete('Content-Length');

  return new Response(`${js}\n\n/* DIJITAL MAKINACI V17.2 P3 */\n${fixes}`,{
    status:base.status,
    statusText:base.statusText,
    headers
  });
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);

  if(url.origin!==self.location.origin)return;

  // API'ler hiçbir koşulda SW cache/transform katmanına girmez.
  if(url.pathname.startsWith('/api/'))return;
  if(request.method!=='GET')return;

  if(url.pathname==='/v1621-style.css'){
    event.respondWith(mergedStyle(request).catch(()=>fetch(request)));
    return;
  }

  if(url.pathname==='/v1621-app.js'){
    event.respondWith(mergedApp(request).catch(()=>fetch(request)));
    return;
  }

  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request,{cache:'no-store'});
        if(response.ok){
          const cache=await caches.open(VERSION);
          cache.put('/',response.clone()).catch(()=>{});
        }
        return response;
      }catch{
        return (await caches.match('/')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      if(response.ok){
        const cache=await caches.open(VERSION);
        cache.put(request,response.clone()).catch(()=>{});
      }
      return response;
    }catch{
      return (await caches.match(request)) || Response.error();
    }
  })());
});
