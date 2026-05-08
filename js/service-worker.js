/* ================================================================
   StreakDayscore · Service Worker
   Caches the app so it works offline on your iPhone
   ================================================================ */

const CACHE_NAME = 'streakdayscore-v1';

const FILES_TO_CACHE = [
  '/streakdayscore/',
  '/streakdayscore/index.html',
  '/streakdayscore/css/style.css',
  '/streakdayscore/js/app.js',
  '/streakdayscore/js/sw-register.js',
  '/streakdayscore/manifest.json',
  '/streakdayscore/icons/icon-192.png',
  '/streakdayscore/icons/icon-512.png',
];

/* Install — cache all files */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

/* Activate — clean up old caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Fetch — serve from cache, fall back to network */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
