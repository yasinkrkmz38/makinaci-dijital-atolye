'use strict';
if('serviceWorker' in navigator){let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)return;refreshing=true;location.reload()});window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js?v=17.2.0',{scope:'/',updateViaCache:'none'}).then(registration=>registration.update()).catch(error=>console.warn('PWA:',error)))}
function connectionState(){document.documentElement.dataset.connection=navigator.onLine?'online':'offline';document.dispatchEvent(new CustomEvent('dm:connection',{detail:{online:navigator.onLine}}))}
window.addEventListener('online',connectionState);window.addEventListener('offline',connectionState);connectionState();
