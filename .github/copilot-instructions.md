## Quick context

- This is a small Vite-based PWA single-page app (hash router) located under `src/`.
- Entry point: `src/scripts/index.js` — it bootstraps the `App` from `src/scripts/pages/app.js` and expects DOM roots like `#main-content`, `#drawer-button`, `#navigation-drawer`.
- Public assets and PWA manifest live in `src/public` (Vite `publicDir` is set to `src/public` in `vite.config.js`).

## Build / Dev / Preview

- Use npm scripts from `package.json`:
  - `npm run dev` — start Vite dev server (fast local dev).
  - `npm run build` — produce production bundle (Vite).
  - `npm run preview` — serve the built output.

Note: the service worker is built with `vite-plugin-pwa` using injectManifest (see `vite.config.js`) so `src/sw.js` is the canonical SW source.

## Key architecture and data flows

- API base URL is in `src/scripts/config.js` (constant `CONFIG.BASE_URL` = `https://story-api.dicoding.dev/v1`). All network calls are via helper functions in `src/scripts/data/api.js`.
- Authentication: token is stored in localStorage under the key `token` (and `userName` for display). Many API helpers will throw if `token` is missing — tests/dev flows should set this as needed.
- Pages live under `src/scripts/pages/*` and are routed by the hash-based router in `src/scripts/routes/*`. When you add a page, follow existing patterns: export a class with `render()`/`afterRender()` as used by `pages/app.js`.

## Service Worker and offline behavior

- `src/sw.js` is the Workbox-based service worker (injectManifest). It:
  - precaches the build manifest (`self.__WB_MANIFEST`).
  - caches tiles from OpenStreetMap.
  - Stale-while-revalidate for GET stories and story images.
  - Uses Background Sync for POST `/stories` (queue name: `add-story-queue`).
  - Implements push notification handling and `notificationclick` navigation.

When modifying caching strategies, edit `src/sw.js` and keep `injectManifest` in `vite.config.js` intact.

## Conventions & patterns to follow

- ESM modules everywhere (`"type": "module"` in `package.json`). Use import/export.
- UI code under `src/scripts/*` manipulates DOM directly and uses small helper modules (e.g., `src/scripts/utils/*`). Reuse `updateNavLinks` (in `src/scripts/utils/index.js`) for nav state.
- Network helpers in `src/scripts/data/api.js` always parse response JSON and throw on `responseJson.error` — callers should use try/catch and show user-facing messages (see usage of `Swal` in `utils`).
- Third-party libs imported directly from JS (FontAwesome, SweetAlert2, Leaflet). Keep them in `dependencies` in `package.json`.

## Integration points / sensitive files

- `src/sw.js` — service worker, must be kept compatible with Workbox injectManifest.
- `vite.config.js` — controls publicDir and PWA plugin.
- `src/public/manifest.webmanifest` and `src/public/images/*` — PWA assets referenced by the SW and manifest.
- `src/scripts/config.js` and `src/scripts/data/api.js` — if you need to change the backend, update `CONFIG.BASE_URL` and the endpoints.
- `src/scripts/utils/notification-helper.js` — VAPID key and push subscribe/unsubscribe logic live here.

## Quick examples for agents

- To fetch stories use `getAllStories()` from `src/scripts/data/api.js` (it expects `localStorage.token` to be set).
- To change caching for story images, edit the corresponding `registerRoute` block in `src/sw.js`.

## Common pitfalls

- Service worker behavior differs between `dev` and `build + preview` — test push/background-sync and precaching after `npm run build` + `npm run preview`.
- Many functions throw if `token` is missing; create a mock token in `localStorage` when running UI-driven tests or add guarded checks.

---
If anything above is unclear or you want more examples (e.g., how pages register with the router or a runnable minimal test harness), tell me which area to expand and I'll update this file.
