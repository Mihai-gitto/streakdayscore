const CACHE_NAME = 'streakdayscore-v2';
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
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES_TO_CACHE))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request))); });
