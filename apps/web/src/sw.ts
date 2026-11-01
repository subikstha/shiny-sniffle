declare const self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from "workbox-precaching"
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Workbox precache injection point (Required by VitePWA injectManifest)
precacheAndRoute(self.__WB_MANIFEST || [])

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle notifications received when tab is closed or in background
onBackgroundMessage(messaging, (payload) => {
    console.log("[firebase-messaging-sw.js] Received background message", payload);

    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions: NotificationOptions = {
        body: payload.notification?.body,
        icon: payload.notification?.icon || "/favicon.svg",
        data: payload.data,
    };

    self.registration.showNotification(notificationTitle, notificationOptions)

})