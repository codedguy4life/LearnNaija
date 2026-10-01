const CACHE="learnnaija-v1";
const ASSETS=["./","./index.html","./app.html","./ai-tutor.html","./styles/index.css","./styles/app.css","./styles/home-v2.css","./styles/ai-tutor.css","./js/index.js","./js/app.js","./js/home-v2.js","./js/ai-tutor.js","./manifest.webmanifest"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok&&new URL(event.request.url).origin===location.origin){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>cached)))});
