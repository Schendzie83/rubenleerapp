// Bewaart de app op het apparaat, zodat hij ook zonder internet werkt.
// Nieuwe versies worden op de achtergrond opgehaald en zijn er bij de volgende keer openen.
const V = 'boerderij-1795431162';
const SHELL = ['./', 'index.html', 'three.min.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'fonts/andika-latin-400-normal.woff2', 'fonts/andika-latin-700-normal.woff2', 'fonts/baloo-2-latin-600-normal.woff2', 'fonts/baloo-2-latin-800-normal.woff2'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
