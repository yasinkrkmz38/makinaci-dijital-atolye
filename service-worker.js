'use strict';

const APP_VERSION='17.5.0';
const CACHE_NAME=`dm-app-${APP_VERSION}`;
const APP_SHELL=[
  '/app',
  '/actions.js?v=17.5.0',
  '/offline.js?v=17.5.0',
  '/app.js?v=17.5.0',
  '/style.css?v=17.5.0',
  '/mobile.css?v=17.5.0',
  '/manifest.webmanifest?v=17.5.0',
  '/forgot-password.html',
  '/reset-password.html',
  '/verify-email.html',
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
        if(response.ok&&url.pathname.startsWith('/app'))(await caches.open(CACHE_NAME)).put('/app',response.clone()).catch(()=>{});
        return response;
      }catch{
        if(url.pathname==='/app'||url.pathname.startsWith('/app/'))return (await caches.match('/app'))||Response.error();
        return (await caches.match(request))||Response.error();
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cached=await caches.match(request);
    if(cached)return cached;
    try{
      const response=await fetch(request);
      if(response.ok)(await caches.open(CACHE_NAME)).put(request,response.clone()).catch(()=>{});
      return response;
    }catch{
      return Response.error();
    }
  })());
});

self.addEventListener('push',event=>{
  let data={title:'Dijital Makinacı',body:'Yeni bir bildiriminiz var.',url:'/app'};
  try{data={...data,...event.data.json()}}catch{}
  event.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'/icon-192.png',badge:'/icon-192.png',data:{url:data.url||'/app'}}));
});
self.addEventListener('notificationclick',event=>{event.notification.close();const target=new URL(event.notification.data?.url||'/app',self.location.origin).href;event.waitUntil((async()=>{const windows=await clients.matchAll({type:'window',includeUncontrolled:true}),existing=windows.find(client=>client.url.startsWith(self.location.origin));if(existing){await existing.focus();return existing.navigate(target)}return clients.openWindow(target)})())});
