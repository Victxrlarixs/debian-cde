# Progressive Web App (PWA) Implementation

This document details the PWA implementation of the CDE Time Capsule, including offline capabilities, installation process, and caching strategies.

## Overview

The CDE Time Capsule is a fully functional Progressive Web App that can be installed on desktop and mobile devices, providing an app-like experience with offline support.

## Web App Manifest

The manifest file (`/public/manifest.webmanifest`) defines the app's metadata and appearance.

### Manifest Configuration

```json
{
  "name": "Debian CDE Desktop",
  "short_name": "Debian CDE",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "description": "Retro Debian CDE Desktop UI inspired by Unix and Linux.",
  "lang": "es-MX",
  "icons": [
    {
      "src": "/icons/Debian.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/Debian.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Manifest Properties

**name**: Full application name displayed during installation

**short_name**: Abbreviated name shown on home screen (12 character limit recommended)

**start_url**: URL loaded when app is launched from home screen

**scope**: Navigation scope - URLs outside this scope open in browser

**display**: Presentation mode
- `standalone`: Looks like a native app (no browser UI)
- `fullscreen`: Uses entire screen
- `minimal-ui`: Minimal browser controls
- `browser`: Standard browser tab

**background_color**: Splash screen background color during app launch

**theme_color**: Browser UI color (address bar, status bar)

**description**: App description for app stores and search engines

**lang**: Primary language of the app

**icons**: Array of icon objects for various contexts
- Home screen icons
- Splash screen
- Task switcher
- App stores

### Icon Requirements

**Sizes:**
- 192x192: Minimum required size
- 512x512: High-resolution displays
- 144x144: Windows tiles (optional)
- 96x96: Android launcher (optional)

**Format:**
- PNG recommended (best compatibility)
- SVG supported in modern browsers
- ICO for legacy support

**Purpose:**
- `any`: Default icon
- `maskable`: Safe zone for adaptive icons (Android)
- `monochrome`: Single-color variant

## Service Worker

The Service Worker (`/public/sw.js`) enables offline functionality and caching.

### Service Worker Lifecycle

```
Install → Activate → Fetch
```

**Install**: Cache static assets
**Activate**: Clean up old caches
**Fetch**: Intercept network requests

### Cache Strategy

The Service Worker uses a hybrid caching strategy optimized for the CDE desktop experience.

#### Cache Version

```javascript
const CACHE_VERSION = 'v3';
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
```

Version bumping invalidates old caches, forcing fresh downloads.

#### Precached Assets

Critical assets are cached during Service Worker installation:

```javascript
const PRECACHE_URLS = [
  '/',
  '/css/main.css',
  '/css/responsive.css',
  '/icons/cursor.svg',
  '/icons/cursor-wait.svg',
  '/icons/cursor-move.svg',
  '/icons/cursor-resize-nw.svg',
  '/icons/view-refresh.png',
  '/icons/folder_open.png',
];
```

These assets are available immediately on subsequent visits, even offline.

### Install Event

```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => 
      cache.addAll(PRECACHE_URLS)
    )
  );
});
```

**Process:**
1. Open cache storage
2. Add all precache URLs
3. Wait for completion before activating

**Failure Handling:**
If any precache URL fails to load, the entire installation fails and the Service Worker won't activate.

### Activate Event

```javascript
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
```

**Process:**
1. Get all cache names
2. Filter out current cache
3. Delete old caches
4. Claim clients immediately

This ensures users always have the latest version after an update.

### Fetch Event

The fetch handler implements different strategies based on request type.

#### Navigation Requests (HTML Pages)

**Strategy**: Network-first with cache fallback

```javascript
if (request.mode === 'navigate') {
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(STATIC_CACHE).then((cache) => 
          cache.put(request, responseClone)
        );
        return response;
      })
      .catch(() => 
        caches.match(request).then((cached) => 
          cached || caches.match('/')
        )
      )
  );
}
```

**Rationale:**
- Always try network first for fresh content
- Cache successful responses for offline use
- Fall back to cached version if offline
- Fall back to root page if specific page not cached

#### Static Assets (CSS, Icons, Backdrops, Palettes)

**Strategy**: Cache-first with network fallback

```javascript
if (url.pathname.startsWith('/css/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/backdrops/') ||
    url.pathname.startsWith('/palettes/')) {
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      
      return fetch(request).then((response) => {
        const responseClone = response.clone();
        caches.open(STATIC_CACHE).then((cache) => 
          cache.put(request, responseClone)
        );
        return response;
      });
    })
  );
}
```

**Rationale:**
- Static assets rarely change
- Instant loading from cache
- Network request only on cache miss
- Cache successful fetches for future use

#### Other Requests

**Strategy**: Network-first with optional cache fallback

```javascript
event.respondWith(
  fetch(request).catch(() => caches.match(request))
);
```

**Rationale:**
- External resources should be fresh
- Graceful degradation if offline

### Cache Size Management

**Current Implementation:**
No automatic cache size limit. Browsers enforce their own limits (typically 50MB-500MB).

**Recommended Enhancement:**

```javascript
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxItems);
  }
}
```

## Installation Process

### Desktop Installation

#### Chrome/Edge

1. Visit https://debian.com.mx
2. Click install icon in address bar (⊕)
3. Click "Install" in prompt
4. App appears in Start Menu/Applications

**Alternative:**
- Menu → More Tools → Create Shortcut
- Check "Open as window"

#### Firefox

1. Visit https://debian.com.mx
2. Click install icon in address bar
3. Click "Install" in prompt
4. App appears in Applications

**Note:** Firefox PWA support varies by platform.

#### Safari (macOS)

1. Visit https://debian.com.mx
2. File → Add to Dock
3. App appears in Dock

**Limitations:**
- No Service Worker support in Safari < 11.1
- Limited offline functionality

### Mobile Installation

#### Android (Chrome)

1. Visit https://debian.com.mx
2. Tap "Add to Home screen" banner
3. Or: Menu → Add to Home screen
4. App appears on home screen

**Criteria for Install Prompt:**
- HTTPS connection
- Valid manifest.webmanifest
- Service Worker registered
- User engagement (visit twice over 5 minutes)

#### iOS (Safari)

1. Visit https://debian.com.mx
2. Tap Share button
3. Tap "Add to Home Screen"
4. App appears on home screen

**Limitations:**
- No Service Worker support
- No offline functionality
- No background sync
- Limited storage quota

## Offline Functionality

### What Works Offline

**Fully Functional:**
- Desktop UI and window management
- File Manager (VFS operations)
- XEmacs text editor
- Terminal Lab
- Style Manager
- Process Monitor
- Calendar
- Time Manager

**Cached Assets:**
- All CSS stylesheets
- System icons
- Cursor graphics
- Color palettes (76 themes)
- Backdrops (168 patterns)

### What Requires Network

**External Resources:**
- Netscape Navigator external links
- Net Search functionality
- External documentation links
- GitHub repository links

**Dynamic Content:**
- Service Worker updates
- Manifest updates
- New backdrop/palette downloads

### Offline Detection

The app can detect offline status:

```javascript
window.addEventListener('online', () => {
  console.log('Network connection restored');
});

window.addEventListener('offline', () => {
  console.log('Network connection lost');
});

// Check current status
if (navigator.onLine) {
  console.log('Online');
} else {
  console.log('Offline');
}
```

**Recommended Enhancement:**

Display offline indicator in TopBar:

```javascript
function updateOnlineStatus() {
  const indicator = document.getElementById('online-status');
  if (navigator.onLine) {
    indicator.textContent = '';
  } else {
    indicator.textContent = 'Offline Mode';
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
```

## Update Strategy

### Service Worker Updates

**Automatic Check:**
Browser checks for Service Worker updates every 24 hours or on navigation.

**Update Process:**

1. Browser detects new Service Worker
2. New worker installs in background
3. New worker waits for old worker to finish
4. User closes all tabs
5. New worker activates on next visit

**Force Update:**

```javascript
// In Service Worker
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// In app
navigator.serviceWorker.ready.then((registration) => {
  registration.update();
});
```

### Update Notification

**Recommended Implementation:**

```javascript
let refreshing = false;

navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});

navigator.serviceWorker.ready.then((registration) => {
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New version available
        showUpdateNotification();
      }
    });
  });
});

function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div class="update-banner">
      New version available!
      <button onclick="updateApp()">Update</button>
    </div>
  `;
  document.body.appendChild(notification);
}

function updateApp() {
  navigator.serviceWorker.ready.then((registration) => {
    registration.waiting.postMessage('skipWaiting');
  });
}
```

## Storage Quota

### Storage Types

**Cache Storage**: Service Worker caches (typically 50MB-500MB)

**LocalStorage**: Settings and session data (5-10MB)

**IndexedDB**: Not currently used (50MB-unlimited)

### Quota Management

**Check Available Space:**

```javascript
if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate().then((estimate) => {
    console.log(`Using ${estimate.usage} of ${estimate.quota} bytes`);
    console.log(`${(estimate.usage / estimate.quota * 100).toFixed(2)}% used`);
  });
}
```

**Request Persistent Storage:**

```javascript
if ('storage' in navigator && 'persist' in navigator.storage) {
  navigator.storage.persist().then((persistent) => {
    if (persistent) {
      console.log('Storage will not be cleared except by explicit user action');
    } else {
      console.log('Storage may be cleared by the browser under storage pressure');
    }
  });
}
```

## Performance Optimization

### Precache Strategy

**Critical Path Assets:**
- HTML shell
- Core CSS
- Essential icons
- Cursor graphics

**Lazy-Loaded Assets:**
- Backdrops (loaded on demand)
- Palettes (loaded on demand)
- Large images
- Documentation

### Cache Partitioning

**Recommended Enhancement:**

Separate caches by asset type:

```javascript
const CACHES = {
  static: 'static-v1',
  images: 'images-v1',
  backdrops: 'backdrops-v1',
  palettes: 'palettes-v1',
};
```

Benefits:
- Granular cache invalidation
- Easier debugging
- Better organization

### Compression

**Brotli Compression:**

Server should serve pre-compressed assets:

```
Content-Encoding: br
```

**Gzip Fallback:**

```
Content-Encoding: gzip
```

**Compression Ratios:**
- HTML: 70-80% reduction
- CSS: 70-85% reduction
- JavaScript: 60-70% reduction
- JSON: 80-90% reduction

## Security Considerations

### HTTPS Requirement

Service Workers require HTTPS (except localhost for development).

**Why:**
- Prevent man-in-the-middle attacks
- Ensure cache integrity
- Protect user data

### Content Security Policy

**Recommended CSP Header:**

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self' data:;
```

### Cache Poisoning Prevention

**Validate Responses:**

```javascript
fetch(request).then((response) => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  // Only cache successful responses
  return response;
});
```

## Testing

### Service Worker Testing

**Chrome DevTools:**

1. Open DevTools (F12)
2. Application tab
3. Service Workers section
4. Check registration status
5. Test offline mode
6. Inspect cache storage

**Lighthouse Audit:**

```bash
npm install -g lighthouse
lighthouse https://debian.com.mx --view
```

Checks:
- PWA installability
- Offline functionality
- Performance
- Accessibility
- Best practices

### Manual Testing

**Installation:**
- [ ] Install prompt appears
- [ ] App installs successfully
- [ ] App launches from home screen
- [ ] App runs in standalone mode

**Offline:**
- [ ] Enable airplane mode
- [ ] App loads from cache
- [ ] Core functionality works
- [ ] Appropriate offline messaging

**Updates:**
- [ ] New version detected
- [ ] Update notification shown
- [ ] Update applies correctly
- [ ] No data loss

## Debugging

### Service Worker Debugging

**Console Logging:**

```javascript
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
});

self.addEventListener('fetch', (event) => {
  console.log('[SW] Fetch:', event.request.url);
});
```

**Unregister Service Worker:**

```javascript
navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((registration) => {
    registration.unregister();
  });
});
```

**Clear Caches:**

```javascript
caches.keys().then((names) => {
  names.forEach((name) => {
    caches.delete(name);
  });
});
```

### Common Issues

**Service Worker Not Updating:**
- Hard refresh (Ctrl+Shift+R)
- Unregister and re-register
- Check cache version number

**Assets Not Caching:**
- Verify HTTPS connection
- Check network tab for errors
- Inspect cache storage in DevTools

**Install Prompt Not Showing:**
- Verify manifest is valid
- Check Service Worker registration
- Ensure HTTPS connection
- Visit site multiple times

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Service Workers | 40+ | 44+ | 11.1+ | 17+ |
| Web App Manifest | 39+ | 53+ | 11.3+ | 17+ |
| Add to Home Screen | 31+ | 53+ | 11.3+ | 17+ |
| Background Sync | 49+ | ❌ | ❌ | 79+ |
| Push Notifications | 42+ | 44+ | 16+ | 17+ |

## Future Enhancements

**Planned Features:**
- Background sync for VFS changes
- Push notifications for system events