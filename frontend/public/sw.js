const CACHE_NAME = 'mysuru-dasara-2026-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
];

// API endpoints to cache for offline use
const CACHE_FIRST_URLS = [
  '/api/announcements/',
  '/api/events/',
  '/api/venues/',
  '/api/tourism/landmarks/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Silently fail if some assets can't be cached
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin && !url.hostname.includes('localhost')) {
    return;
  }

  // Network first for API calls with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && CACHE_FIRST_URLS.some(u => url.pathname.startsWith(u))) {
            const cloned = response.clone();
            caches.open(API_CACHE).then((cache) => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return new Response(
              JSON.stringify({ error: 'Offline', message: 'You are currently offline. Some features may not be available.' }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // Cache first for static assets
  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const cloned = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, cloned));
          return response;
        });
      })
    );
    return;
  }

  // Network first for HTML pages (SPA)
  event.respondWith(
    fetch(request)
      .then((response) => {
        const cloned = response.clone();
        caches.open(STATIC_CACHE).then((cache) => cache.put(request, cloned));
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/') || caches.match('/offline.html');
        });
      })
  );
});
