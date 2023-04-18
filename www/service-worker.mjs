// TODO:
// - use claim: https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim

const CACHE_NAME = "blitz-sw-cache";
const APP_ROUTE_REGEXP = /^\/app\/([^/]*)(.*)/;
const ASSET_REGEXP = /\.(js|webp|svg|png|jpg|jpeg|json)$/;
const LOCAL_REGEXP = /https?:\/\/(localhost|127\.0\.0\.1)/;
const ENTRY_POINTS = [];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      ENTRY_POINTS.push(self.registration.scope);

      const {
        target: {
          serviceWorker: { scriptURL },
        },
      } = event;
      if (LOCAL_REGEXP.test(scriptURL)) return;
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ENTRY_POINTS);
    })()
  );
});

self.addEventListener("activate", (event) => {
  const cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          return !cacheAllowlist.includes(cacheName)
            ? caches.delete(cacheName)
            : null;
        })
      );
    })()
  );
});

const isWhitelisted = (eventURL) => {
  if (LOCAL_REGEXP.test(eventURL)) return false;
  if (APP_ROUTE_REGEXP.test(eventURL)) return true;
  if (ASSET_REGEXP.test(eventURL)) return true;
  return false;
};

self.addEventListener("fetch", (event) => {
  // Bypass service worker entirely for local requests.
  if (LOCAL_REGEXP.test(event.request.url)) return;

  event.respondWith(
    (async () => {
      // Check cache first.
      const cachedResponse = await caches.match(event.request);

      // Stale while revalidate.
      const networkPromise = fetch(event.request)
        .then((initialResponse) => {
          if (isWhitelisted(event.request.url) && initialResponse.ok) {
            const responseToCache = initialResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return initialResponse;
        })
        .catch((error) => {
          // On network failure, just forward the error.
          return error;
        });

      return cachedResponse ?? networkPromise;
    })()
  );
});
