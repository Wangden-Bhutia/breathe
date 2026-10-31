const CACHE = "breathe-v14";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png", "./icons/favicon.svg", "./icons/favicon-32.png","./audio/two-more.mp3","./audio/breathe-in-ready.mp3","./audio/breathe-in-hold.mp3","./audio/release.mp3","./audio/round-two.mp3","./audio/round-three.mp3","./audio/last-round.mp3","./audio/sigh.mp3","./audio/nose.mp3","./audio/last-one.mp3","./audio/let-it-go.mp3","./audio/hold.mp3","./audio/breathe-in-now.mp3","./audio/squeeze.mp3","./audio/release-relax.mp3","./audio/intention-1.mp3","./audio/intention-2.mp3","./audio/intention-3.mp3"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate") {
    // Network first, but if the network hasn't answered in 3 s, serve the cached page (the network copy still refreshes the cache when it arrives).
    const net = fetch(e.request).then(res => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); } return res; });
    e.waitUntil(net.catch(() => {}));
    e.respondWith(new Promise(resolve => {
      let done = false;
      const fallback = () => caches.match("./index.html").then(hit => hit || net);
      const timer = setTimeout(() => { if (!done) { done = true; resolve(fallback()); } }, 3000);
      net.then(res => { if (!done) { done = true; clearTimeout(timer); resolve(res); } }, () => { if (!done) { done = true; clearTimeout(timer); resolve(fallback()); } });
    }));
    return;
  }
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    if (res && res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => e.request.mode === "navigate" ? caches.match("./index.html") : undefined)));
});
