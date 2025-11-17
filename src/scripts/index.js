import "../styles/styles.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import App from "./pages/app";
import { updateNavLinks } from "./utils";
import { initPWAInstall } from "./utils/pwa-install";

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = !!localStorage.getItem("token");

  updateNavLinks(isLoggedIn);

  // Initialize PWA install prompt
  initPWAInstall();

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });

  // Register service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          type: "module",
        });
        console.log(
          "Service Worker registered successfully:",
          registration.scope
        );
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    });
  }
});
