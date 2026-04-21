/**
 * Service Worker for PWA
 * Handles offline caching and push notifications
 */

const CACHE_NAME = "dicegame-v1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  const options = {
    body: data.body || "New game available!",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
    actions: [
      { action: "play", title: "Play Now" },
      { action: "dismiss", title: "Later" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "BIG/SMALL Dice Game",
      options,
    ),
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "play") {
    const urlToOpen = event.notification.data?.url || "/";
    event.waitUntil(clients.openWindow(urlToOpen));
  }
});

// Background sync event
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-game-data") {
    event.waitUntil(syncGameData());
  }
});

/**
 * Sync game data when back online
 */
async function syncGameData() {
  // Implementation for syncing offline game data
  console.log("[SW] Syncing game data...");
}
