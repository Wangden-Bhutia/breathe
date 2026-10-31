const CACHE = "breathe-v13";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png", "./icons/favicon.svg", "./icons/favicon-32.png","./audio/two-more.mp3","./audio/breathe-in-ready.mp3","./audio/breathe-in-hold.mp3","./audio/release.mp3","./audio/round-two.mp3","./audio/round-three.mp3","./audio/last-round.mp3","./audio/sigh.mp3","./audio/nose.mp3","./audio/last-one.mp3","./audio/let-it-go.mp3","./audio/hold.mp3","./audio/breathe-in-now.mp3","./audio/squeeze.mp3","./audio/release-relax.mp3","./audio/intention-1.mp3","./audio/intention-2.mp3","./audio/intention-3.mp3"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); return res; }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    if (res && res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => e.request.mode === "navigate" ? caches.match("./index.html") : undefined)));
});
