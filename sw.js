const CACHE_NAME = 'work-schedule-v1.2';
const urlsToCache = [
  '/',
  '/index2.html',
  '/manifest.json',
  // ניתן להוסיף כאן קבצים נוספים שיש לשמור ב-cache
];

// התקנת Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// טיפול בבקשות
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // החזרת משאב ממטמון אם קיים, אחרת טעינה מהרשת
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          function(response) {
            // בדיקה שהתשובה תקינה
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // שמירת התשובה במטמון
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// עדכון Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
