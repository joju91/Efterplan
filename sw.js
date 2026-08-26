/* Efterplan — Service Worker */
const CACHE = 'efterplan-v17';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.svg',
  './og.png',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  './robots.txt',
  './sitemap.xml',
  './checklista-dodsbo.html',
  './bouppteckning-guide.html',
  './vad-gora-nar-nagon-dor.html',
  './vad-kostar-en-begravning.html',
  './arvskifte-guide.html',
  './efterlevandepension.html',
  './testamente-guide.html',
  './dodsbo-bostadsratt.html',
  // T223: self-hostade fonter (ersätter fonts.googleapis.com/fonts.gstatic.com)
  './fonts/fraunces-normal-latin.woff2',
  './fonts/fraunces-italic-latin.woff2',
  './fonts/ibm-plex-sans-normal-latin.woff2',
  './fonts/ibm-plex-sans-italic-400-latin.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: serve from cache, fall back to network
// T223: fonter är self-hostade (samma origin) sedan Google Fonts togs bort,
// så de täcks redan av den generiska cache-first-hanteringen nedan.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
