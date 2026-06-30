const CACHE_NAME = 'meet-in-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/stylesheet.css',
  '/js/main.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      return caches.open(CACHE_NAME).then((cache) => {
        try {
          cache.put(request, res.clone());
        } catch (e) {
          // ignore opaque responses
        }
        return res;
      });
    }).catch(() => caches.match('/index.html')))
  );
});
