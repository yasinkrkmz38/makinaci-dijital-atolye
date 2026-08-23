'use strict';
(function(){
  const DB_NAME='dijital-makinaci-offline',STORE='requests';
  const allowed=[
    {method:'POST',pattern:/^\/api\/faults$/},
    {method:'POST',pattern:/^\/api\/machines\/\d+\/measurements$/},
    {method:'POST',pattern:/^\/api\/work-orders\/\d+\/comments$/},
    {method:'PATCH',pattern:/^\/api\/checklists\/items\/\d+$/}
  ];
  function openDb(){return new Promise((resolve,reject)=>{const request=indexedDB.open(DB_NAME,1);request.onupgradeneeded=()=>request.result.createObjectStore(STORE,{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
  async function transaction(mode,callback){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);let result;try{result=callback(store)}catch(error){reject(error);return}tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error)})}
  function queueAllowed(url,method){const pathname=new URL(url,location.origin).pathname;return allowed.some(rule=>rule.method===method&&rule.pattern.test(pathname))}
  async function enqueue(url,options){const headers={};new Headers(options.headers||{}).forEach((value,key)=>headers[key]=value);const id=headers['x-idempotency-key']||crypto.randomUUID();headers['x-idempotency-key']=id;await transaction('readwrite',store=>store.put({id,url:new URL(url,location.origin).pathname+new URL(url,location.origin).search,method:options.method||'GET',headers,body:options.body||null,created_at:new Date().toISOString()}));document.dispatchEvent(new CustomEvent('dm:offline-queued'));return new Response(JSON.stringify({offline_queued:true,queue_id:id,message:'Kayıt çevrimdışı kuyruğa alındı; bağlantı gelince gönderilecek.'}),{status:202,headers:{'Content-Type':'application/json'}})}
  async function all(){return transaction('readonly',store=>new Promise((resolve,reject)=>{const request=store.getAll();request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)}))}
  async function remove(id){return transaction('readwrite',store=>store.delete(id))}
  async function flush(){if(!navigator.onLine)return;const rows=await all();for(const row of rows){try{const response=await fetch(row.url,{method:row.method,headers:row.headers,body:row.body});if(response.ok||response.status===409){await remove(row.id);continue}if([401,403].includes(response.status))break}catch{break}}document.dispatchEvent(new CustomEvent('dm:offline-flushed'))}
  window.dmOfflineFetch=async function(url,options={}){const method=String(options.method||'GET').toUpperCase(),canQueue=queueAllowed(url,method),requestOptions={...options,method};if(canQueue){const headers=new Headers(options.headers||{});if(!headers.has('X-Idempotency-Key'))headers.set('X-Idempotency-Key',crypto.randomUUID());requestOptions.headers=headers}try{return await fetch(url,requestOptions)}catch(error){if(!navigator.onLine&&canQueue)return enqueue(url,requestOptions);throw error}};
  window.dmOffline={flush,count:async()=>(await all()).length};
  window.addEventListener('online',flush);setTimeout(flush,1500);
})();
