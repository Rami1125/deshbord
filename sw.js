const CACHE_NAME = "glass-logistics-cache-v5"; // Changed version to force update
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'https://i.postimg.cc/pdrgskSr/sa.jpg', // Added new logo to cache
  'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache during install:', error);
        });
      })
  );
});

self.addEventListener("fetch", event => {
  // Network first strategy for API calls to make sure data is fresh
  if (event.request.url.startsWith('https://script.google.com/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({error: "Offline"}), { headers: { 'Content-Type': 'application/json' } });
      })
    );
    return;
  }

  // Cache first for other assets
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

