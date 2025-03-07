const CACHE_NAME = "jobxsuccess-cache-v1";
const urlsToCache = [
  self.location.origin + "/JOBXSUCCESS/",
  self.location.origin + "/JOBXSUCCESS/index.html",
  self.location.origin + "/JOBXSUCCESS/manifest.json",
  self.location.origin + "/JOBXSUCCESS/icons/icon-192x192.png",
  self.location.origin + "/JOBXSUCCESS/icons/icon-512x512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Cache addAll failed: ", error);
      });
    })
  );
});

// Fetch Requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        console.error("Fetch failed for ", event.request.url);
      });
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
