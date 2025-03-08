const CACHE_NAME = 'jobxsuccess-v2'; // 🔹 वर्ज़न अपडेट किया

const urlsToCache = [
  '/',  
  '/index.html',  
  '/jobs.html',    // 🔹 जोड़ा गया
  '/study.html',   // 🔹 जोड़ा गया
  '/style.css',  
  '/manifest.json', // 🔹 manifest.json जोड़ा
  '/icons/icon-192x192.png',  
  '/icons/icon-512x512.png',  
  '/offline.html'  // 🔹 नया ऑफ़लाइन पेज
];

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

self.addEventListener('fetch', (event) => {
  // 🔹 नेटवर्क-फर्स्ट स्ट्रैटेजी (डायनामिक कॉन्टेंट के लिए)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // नए डेटा को कैश करें
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        // कैश से डेटा दिखाएं अगर नेटवर्क नहीं है
        return caches.match(event.request)
          .then((response) => {
            if (response) return response;
            // अगर कुछ भी नहीं मिला तो ऑफ़लाइन पेज दिखाएं
            return caches.match('/offline.html');
          });
      })
  );
});
