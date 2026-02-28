// Cache version is automatically updated from package.json version
// This ensures cache is cleared when app version changes
// Force update: 2025-02-27
const CACHE_VERSION = 'v1.0.25';
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;

// CRITICAL: Precache essential assets for instant boot
const PRECACHE_URLS = [
  '/',
  '/css/main.css',
  '/css/responsive.css',

  // Cursors (always visible)
  '/icons/cursors/cursor.svg',
  '/icons/cursors/cursor-wait.svg',
  '/icons/cursors/cursor-move.svg',
  '/icons/cursors/cursor-resize-nw.svg',

  // Critical UI icons (used immediately on boot)
  '/icons/actions/view-refresh.png',
  '/icons/places/folder_open.png',
  '/icons/system/Debian.png',
  '/icons/actions/go-up.png',

  // Panel icons (visible immediately)
  '/icons/apps/filemanager.png',
  '/icons/apps/xemacs.png',
  '/icons/apps/konsole.png',
  '/icons/apps/konqueror.png',
  '/icons/apps/org.xfce.settings.manager.png',
  '/icons/system/applications-other.png',
  '/icons/apps/org.xfce.screenshooter.png',
  '/icons/apps/org.xfce.PanelProfiles.png',
  '/icons/apps/org.xfce.taskmanager.png',

  // Window controls (always visible on any window)
  '/icons/ui/shade-inactive.png',
  '/icons/ui/maximize-inactive.png',
  '/icons/ui/window-close.png',
];

self.addEventListener('install', (event) => {
  // CRITICAL: Skip waiting to activate immediately and force update
  // This ensures old cached icons are replaced with new paths
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Installing new cache:', STATIC_CACHE);
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new service worker:', CACHE_VERSION);

  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        console.log('[SW] Found caches:', keys);
        // Delete ALL old caches to force icon path updates
        return Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE)
            .map((key) => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('[SW] Taking control of all clients');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Skip caching in development (localhost)
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    event.respondWith(fetch(request));
    return;
  }

  // Navegación: estrategia network-first con fallback a caché
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Recursos estáticos propios: network-first para iconos (forzar actualización)
  if (url.origin === self.location.origin) {
    // CRITICAL: Icons use network-first to ensure new paths are fetched
    if (url.pathname.startsWith('/icons/')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // Fallback to cache only if network fails
            return caches.match(request).then((cached) => {
              if (cached) {
                console.log('[SW] Using cached icon (offline):', url.pathname);
                return cached;
              }
              // Return a placeholder or error response
              return new Response('Icon not found', { status: 404 });
            });
          })
      );
      return;
    }

    // CSS, backdrops, palettes: cache-first (less critical)
    if (
      url.pathname.startsWith('/css/') ||
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
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
