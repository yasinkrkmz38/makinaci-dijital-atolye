'use strict';

const APP_VERSION='17.2.0';
const CACHE_NAME=`dm-app-${APP_VERSION}`;
const APP_SHELL=[
  '/',
  '/v1621-app.js?v=17.2.0',
  '/v1621-style.css?v=17.2.0',
  '/appstore-v17.css?v=17.2.0',
  '/manifest.webmanifest?v=17.2.0',
  '/forgot-password.html',
  '/reset-password.html',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async url=>{
      try{
        const response=await fetch(url,{cache:'reload'});
        if(response.ok)await cache.put(url,response);
      }catch{}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('dm-')&&key!==CACHE_NAME).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin||request.method!=='GET'||url.pathname.startsWith('/api/'))return;

  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request,{cache:'no-store'});
        if(response.ok)(await caches.open(CACHE_NAME)).put('/',response.clone()).catch(()=>{});
        return response;
      }catch{
        return (await caches.match('/'))||Response.error();
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    try{
      const response=await fetch(request,{cache:'no-store'});
      if(response.ok)(await caches.open(CACHE_NAME)).put(request,response.clone()).catch(()=>{});
      return response;
    }catch{
      return (await caches.match(request))||Response.error();
    }
  })());
});
