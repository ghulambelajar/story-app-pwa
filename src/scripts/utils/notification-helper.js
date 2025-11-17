import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../data/api";

const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Izin notifikasi tidak diberikan.");
  }
}

async function subscribe() {
  await requestNotificationPermission();

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    console.log("User sudah subscribe:", subscription);
    return;
  }

  subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // Format subscription data tanpa expirationTime
  const subscriptionData = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: btoa(
        String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")))
      ),
      auth: btoa(
        String.fromCharCode(...new Uint8Array(subscription.getKey("auth")))
      ),
    },
  };

  await subscribePushNotification(subscriptionData);
  console.log("Berhasil subscribe dan mengirim ke server.");
}

async function unsubscribe() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    console.log("User belum subscribe.");
    return;
  }

  await unsubscribePushNotification(subscription.endpoint);

  await subscription.unsubscribe();
  console.log("Berhasil unsubscribe.");
}

async function getSubscriptionStatus() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (error) {
    console.warn("Error checking subscription:", error);
    return false;
  }
}

export {
  subscribe,
  unsubscribe,
  getSubscriptionStatus,
  requestNotificationPermission,
};
