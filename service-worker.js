const CACHE_NAME = "jobxsuccess-cache-v1";
const urlsToCache = [
  "/JOBXSUCCESS/",
  "/JOBXSUCCESS/index.html",
  "/JOBXSUCCESS/manifest.json",
  "/JOBXSUCCESS/icons/icon-192x192.png",
  "/JOBXSUCCESS/icons/icon-512x512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Cache addAll failed:", error);
      });
    })
  );
});

// Fetch Requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        console.error("Fetch failed for", event.request.url);
        return new Response("Offline: Unable to fetch the resource.", {
          status: 503,
          statusText: "Service Unavailable"
        });
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
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
