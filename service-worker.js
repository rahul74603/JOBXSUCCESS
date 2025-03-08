// service-worker.js

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
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

// 🔹 Activate Event - पुराने कैश को हटाएं
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cache) => cache !== CACHE_NAME)
                    .map((cache) => caches.delete(cache))
            );
        })
    );
});
