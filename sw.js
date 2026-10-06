const CACHE='kg-farms-min-v66';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.json','./favicon.ico','./favicon-32.png','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-512-maskable.png','./icons/logo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  // Never touch the Apps Script API - always live data.
  if(u.hostname.endsWith('script.google.com'))return;
  if(u.origin!==location.origin)return;
  // App files: show the saved copy INSTANTLY, refresh it quietly in the background.
  // (A new version of the app appears the next time it is opened.)
  e.respondWith(caches.open(CACHE).then(cache=>cache.match(e.request).then(hit=>{
    const net=fetch(e.request).then(res=>{if(res&&res.ok)cache.put(e.request,res.clone());return res}).catch(()=>hit);
    return hit||net;
  })));
});
