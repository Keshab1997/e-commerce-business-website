const CACHE_NAME = 'ecommerce-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/styles/variables.css',
  '/assets/default-logo.png',
  '/assets/loading-spinner.gif',
  '/assets/placeholder-product.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});