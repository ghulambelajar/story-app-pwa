import Swal from "sweetalert2";
import {
  subscribe,
  unsubscribe,
  getSubscriptionStatus,
} from "./notification-helper";

export function showFormattedDate(date, locale = "en-US", options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function setupPushNotificationButton() {
  const pushToggleButton = document.querySelector("#push-toggle-button");
  if (!pushToggleButton) return;

  let isSubscribed = false;
  try {
    isSubscribed = await getSubscriptionStatus();
  } catch (error) {
    console.warn(
      "Gagal mengecek status subscription (mungkin mode dev):",
      error.message
    );
    pushToggleButton.style.display = "none";
    return;
  }
  const updateButtonUI = (subscribed) => {
    pushToggleButton.innerHTML = `
      <i class="fa-solid ${
        subscribed ? "fa-bell-slash" : "fa-bell"
      }" aria-hidden="true"></i>
      <span>${subscribed ? "Hentikan Notifikasi" : "Notifikasi"}</span>
    `;
  };

  updateButtonUI(isSubscribed);

  pushToggleButton.addEventListener("click", async (event) => {
    event.preventDefault();
    pushToggleButton.style.pointerEvents = "none";

    try {
      if (await getSubscriptionStatus()) {
        await unsubscribe();
        Swal.fire(
          "Berhasil!",
          "Kamu telah berhenti berlangganan notifikasi.",
          "success"
        );
        updateButtonUI(false);
      } else {
        await subscribe();
        Swal.fire(
          "Berhasil!",
          "Kamu telah berlangganan notifikasi!",
          "success"
        );
        updateButtonUI(true);
      }
    } catch (error) {
      Swal.fire("Gagal", error.message, "error");
    }

    pushToggleButton.style.pointerEvents = "auto";
  });
}

export function updateNavLinks(isLoggedIn) {
  const navList = document.querySelector("#nav-list");
  const brandNameLink = document.querySelector(".brand-name");

  if (isLoggedIn) {
    brandNameLink.href = "#/home";
    navList.innerHTML = `
      <li><a href="#/home"><i class="fa-solid fa-house" aria-hidden="true"></i> Beranda</a></li>
      <li><a href="#/bookmark"><i class="fa-solid fa-bookmark" aria-hidden="true"></i> Tersimpan</a></li>
      <li><a href="#/about"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> About</a></li>
      <li>
        <a href="#!" id="push-toggle-button"> <i class="fa-solid fa-bell" aria-hidden="true"></i>
          <span>Notifikasi</span>
        </a>
      </li>
      <li><a href="#" id="logout-button"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Logout</a></li>
      <li><a href="#/add"><i class="fa-solid fa-plus" aria-hidden="true"></i> Tambah Cerita</a></li>
    `;

    setupPushNotificationButton();

    const logoutButton = document.querySelector("#logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("userName");

        updateNavLinks(false);

        Swal.fire({
          title: "Logout Berhasil!",
          icon: "success",
          toast: true,
          position: "top-end",
          customClass: { container: "my-swal-toast" },
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        window.location.hash = "#/";
      });
    }
  } else {
    brandNameLink.href = "#/";
    navList.innerHTML = `
      <li><a href="#/"><i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i> Login</a></li>
      <li><a href="#/register"><i class="fa-solid fa-user-plus" aria-hidden="true"></i> Register</a></li>
      <li><a href="#/about"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> About</a></li>
    `;
  }
}
