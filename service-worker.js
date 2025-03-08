// कैश का नाम और संस्करण
const CACHE_NAME = 'jobxsuccess-v1';

// कैश करने के लिए संसाधनों की सूची
const urlsToCache = [
  '/',                  // मुख्य पृष्ठ (index.html)
  '/index.html',        // HTML फ़ाइल
  '/style.css',         // CSS फ़ाइल
  '/script.js',         // JavaScript फ़ाइल
  '/icons/icon-192x192.png', // आइकन
  '/icons/icon-512x512.png', // आइकन
  '/offline.html'       // ऑफ़लाइन पेज
];

// इंस्टॉल इवेंट: संसाधनों को कैश करें
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// एक्टिवेट इवेंट: पुराने कैश को हटाएं
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
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

// फ़ेच इवेंट: कैश से संसाधन प्रदान करें
self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('Found in cache:', event.request.url);
          return response; // कैश से प्रतिक्रिया दें
        }
        console.log('Not found in cache, fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // नए संसाधन को कैश में जोड़ें
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
