// オフラインキャッシュ（インストールボタンは撤去済み）
const CACHE='todo-pwa-cache-v3';
const ASSETS=['./','./index.html','./main.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  e.respondWith(
    caches.match(req).then(c=>c||fetch(req).then(r=>{
      const copy=r.clone(); caches.open(CACHE).then(ca=>ca.put(req,copy)); return r;
    }).catch(()=>caches.match('./index.html'))));
});