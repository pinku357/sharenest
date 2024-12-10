const CACHE_NAME = "my-cache-v1";
const urlsToCache = ["/homepage.html", "/assets/icons/logo-192x192.png", "/assets/icons/logo-512x512.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching resources");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
