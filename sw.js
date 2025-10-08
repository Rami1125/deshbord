const CACHE_NAME = "glass-logistics-cache-v7"; // Changed version to force update
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'https://i.postimg.cc/pdrgskSr/sa.jpg', // New logo
  'https://i.postimg.cc/tCNbgXK3/Screenshot-20250623-200744-Tik-Tok.jpg', // Ali avatar
  'https://i.postimg.cc/d3S0NJJZ/Screenshot-20250623-200646-Facebook.jpg', // Hakmat avatar
  'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Opened cache");
        self.skipWaiting();
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", event => {
  if (event.request.url.startsWith('https://script.google.com/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
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
    }).then(() => self.clients.claim())
  );
});

