
const CACHE_NAME = 'tokokuh-v1';
const ASSETS = [
  './',
  './index.html',
  './app.html',
  './manifest.webmanifest',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(
    caches.match(req).then(res => res || fetch(req).then(r => {
      const copy = r.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, copy));
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
