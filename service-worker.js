const CACHE_NAME = "jobxsuccess-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/offline.html",
    "/style.css",
    "/script.js",
    "/firebase-config.js",
    "/study.js",
    "/config.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// 🔹 Install Event - कैश स्टोरेज में फाइलें सेव करें
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// 🔹 Fetch Event - ऑफलाइन होने पर कैश से फाइलें लोड करें
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                // Cache the fetched response for future use
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(() => {
            // If both fetch and cache fail, show the offline page
            return caches.match("/offline.html");
        })
    );
});

// 🔹 Activate Event - पुराने कैश को हटाएं
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
