import "../styles/styles.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import App from "./pages/app";
import { updateNavLinks } from "./utils";

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = !!localStorage.getItem("token");

  updateNavLinks(isLoggedIn);

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
