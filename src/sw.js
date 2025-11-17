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

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache OpenStreetMap tiles
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

// Cache API GET requests
registerRoute(
  ({ url, request }) =>
    url.origin === API_ORIGIN &&
    url.pathname.startsWith("/v1/stories") &&
    request.method === "GET",
  new StaleWhileRevalidate({
    cacheName: "dicoding-story-api",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60,
        maxEntries: 50,
      }),
    ],
  })
);

// Cache story images
registerRoute(
  ({ url }) =>
    url.origin === API_ORIGIN && url.pathname.startsWith("/images/stories/"),
  new CacheFirst({
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

// Background Sync for POST requests
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
  }),
  "POST"
);

// Push Notification Handler
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push data: "${event.data?.text()}"`);

  let notificationData = {
    title: "Story berhasil dibuat",
    options: {
      body: "Anda telah membuat story baru",
      icon: "/images/icons/icon-192x192.png",
      badge: "/images/icons/icon-96x96.png",
      tag: "story-notification",
      requireInteraction: false,
      actions: [
        {
          action: "open",
          title: "Lihat Story",
          icon: "/images/icons/icon-72x72.png",
        },
        {
          action: "close",
          title: "Tutup",
          icon: "/images/icons/icon-72x72.png",
        },
      ],
    },
  };

  // Parse data dari push event
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData.title = data.title || notificationData.title;
      notificationData.options.body =
        data.options?.body || notificationData.options.body;

      if (data.storyId) {
        notificationData.options.data = { storyId: data.storyId };
      }
    } catch (e) {
      console.log("Failed to parse push data:", e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData.options
    )
  );
});

// Notification Click Handler
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification clicked.");

  event.notification.close();

  if (event.action === "close") {
    return;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            if (event.notification.data?.storyId) {
              client.navigate(`/#/stories/${event.notification.data.storyId}`);
            }
            return client.focus();
          }
        }

        if (clients.openWindow) {
          const urlToOpen = event.notification.data?.storyId
            ? `/#/stories/${event.notification.data.storyId}`
            : "/#/home";
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Install event
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker...");
  event.waitUntil(clients.claim());
});
