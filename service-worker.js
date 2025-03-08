const CACHE_NAME = 'jobxsuccess-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/jobs.html',
  '/study.html',
  '/offline.html' // ऑफ़लाइन पेज जोड़ें
];

// इंस्टॉल इवेंट
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// एक्टिवेट इवेंट
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// फ़ेच इवेंट
self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('Found in cache:', event.request.url);
          return response;
        }
        console.log('Not found in cache, fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // कैश में नई प्रतिक्रिया जोड़ें
            return caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, response.clone());
                return response;
              });
          })
          .catch(() => {
            // नेटवर्क विफल होने पर ऑफ़लाइन पेज दिखाएं
            return caches.match('/offline.html');
          });
      })
  );
});
