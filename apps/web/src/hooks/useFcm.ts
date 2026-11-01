// Because VitePWA manages service worker compilation and output paths, pass the active ServiceWorkerRegistration to getToken()
// 4. This is for registering the service worker and requesting the FCM token
import { getToken, onMessage } from "firebase/messaging";
import { getMessagingInstance } from "../api/firebase";

export async function registerAndGetFcmToken() {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
        console.warn("Push messaging is not supported in this browser.");
        return null;
    }

    // Request for user permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        console.warn("Notification permission denied");
        return null;
    }

    // 2. Wait for the service worker registered by VitePWA to become active
    const registration = await navigator.serviceWorker.ready;

    // 3. Obtain Firebase Messaging instance
    const messaging = await getMessagingInstance()
    if (!messaging) return null;

    // 4. Request the device FCM token
    const token = await getToken(messaging, {
        vapidKey: '',
        serviceWorkerRegistration: registration
    })
    return token;
}