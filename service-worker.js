const CACHE_NAME = 'jobxsuccess-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/jobs.html',
  '/study.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // अगर फाइल कैश में है, तो वही दिखाएं
        if (response) {
          return response;
        }
        // नहीं तो नेटवर्क से फाइल लोड करें
        return fetch(event.request);
      })
  );
});
