const CACHE='kg-farms-v50';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.json','./favicon.ico','./favicon-32.png','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-512-maskable.png','./icons/logo.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  // Never intercept the Apps Script API - always hit the network for live data.
  if(u.hostname.endsWith('script.google.com'))return;
  if(u.origin===location.origin){
    // App shell: network-first. Always serve the latest deployed files when
    // online, so updates show up immediately instead of being stuck behind
    // a stale cache. Cache is refreshed on every successful fetch and used
    // only as an offline fallback.
    e.respondWith(
      fetch(e.request).then(res=>{
        if(res && res.ok) caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
        return res;
      }).catch(()=>caches.match(e.request))
    );
    return;
  }
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
