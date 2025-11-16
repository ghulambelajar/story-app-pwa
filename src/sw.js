import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkOnly,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

const API_ORIGIN = "https://story-api.dicoding.dev";

precacheAndRoute(self.__WB_MANIFEST);
registerRoute(
  ({ url }) => url.origin === "https://tile.openstreetmap.org",
  new CacheFirst({
    cacheName: "openstreetmap-tiles",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
        maxEntries: 100,
      }),
    ],
  })
);

registerRoute(
  ({ url, request }) =>
    url.origin === API_ORIGIN &&
    url.pathname.startsWith("/v1/stories") &&
    request.method === "GET",
  new StaleWhileRevalidate({
    cacheName: "dicoding-story-api",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxAgeSeconds: 60 * 60, maxEntries: 50 }),
    ],
  })
);

registerRoute(
  ({ url }) =>
    url.origin === API_ORIGIN && url.pathname.startsWith("/images/stories/"),
  new StaleWhileRevalidate({
    cacheName: "dicoding-story-images",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
        maxEntries: 100,
      }),
    ],
  })
);

const bgSyncPlugin = new BackgroundSyncPlugin("add-story-queue", {
  maxRetentionTime: 24 * 60,
});

registerRoute(
  ({ url, request }) =>
    url.origin === API_ORIGIN &&
    url.pathname.startsWith("/v1/stories") &&
    request.method === "POST",

  new NetworkOnly({
    plugins: [bgSyncPlugin],
  })
);

// 4. PUSH NOTIFICATION (Kriteria 2)
self.addEventListener("push", (event) => {
  console.log("Push event diterima!", event.data.text());
  const notificationData = event.data.json();
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.options.body,
      icon: "images/icons/icon-192x192.png",
    })
  );
});
