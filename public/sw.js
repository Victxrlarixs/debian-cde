const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/core.css',
  '/css/components.css',
  '/css/app.css',
  '/css/responsive.css',
  '/icons/cursor.svg',
  '/icons/cursor-wait.svg',
  '/icons/cursor-move.svg',
  '/icons/cursor-resize-nw.svg',
  '/icons/fsf.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Navegación: estrategia network-first con fallback a caché
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/'))
        )
    );
    return;
  }

  // Recursos estáticos propios: cache-first
  if (url.origin === self.location.origin) {
    if (
      url.pathname.startsWith('/css/') ||
      url.pathname.startsWith('/icons/') ||
      url.pathname.startsWith('/backdrops/') ||
      url.pathname.startsWith('/palettes/')
    ) {
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) {
            return cached;
          }

          return fetch(request).then((response) => {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone));
            return response;
          });
        })
      );
      return;
    }
  }

  // Resto: network-first con fallback opcional a caché
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

