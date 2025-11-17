// PWA Install Prompt Handler
let deferredPrompt;

export function initPWAInstall() {
  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("beforeinstallprompt event fired");
    e.preventDefault();
    deferredPrompt = e;
    showInstallPromotion();
  });

  window.addEventListener("appinstalled", () => {
    console.log("PWA was installed");
    hideInstallPromotion();
    deferredPrompt = null;
  });
}

function showInstallPromotion() {
  const existingBanner = document.querySelector("#pwa-install-banner");
  if (existingBanner) return;

  const banner = document.createElement("div");
  banner.id = "pwa-install-banner";
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #007bff;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10001;
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 90%;
      animation: slideUp 0.3s ease-out;
    ">
      <div>
        <strong>Install My Story App</strong>
        <p style="margin: 0; font-size: 0.9rem;">Install aplikasi untuk pengalaman yang lebih baik!</p>
      </div>
      <button id="pwa-install-button" style="
        background: white;
        color: #007bff;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        white-space: nowrap;
      ">Install</button>
      <button id="pwa-dismiss-button" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
      ">Nanti</button>
    </div>
  `;

  document.body.appendChild(banner);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
    @keyframes slideDown {
      from {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
      to {
        transform: translateX(-50%) translateY(100px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document
    .querySelector("#pwa-install-button")
    .addEventListener("click", async () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      deferredPrompt = null;
      hideInstallPromotion();
    });

  document
    .querySelector("#pwa-dismiss-button")
    .addEventListener("click", () => {
      hideInstallPromotion();
    });
}

function hideInstallPromotion() {
  const banner = document.querySelector("#pwa-install-banner");
  if (banner) {
    banner.style.animation = "slideDown 0.3s ease-out";
    setTimeout(() => banner.remove(), 300);
  }
}
