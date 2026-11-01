# Firebase Cloud Messaging (FCM) Integration Guide

This document covers how to integrate Firebase Cloud Messaging into a React + Vite app using `vite-plugin-pwa` with the `injectManifest` strategy.

---

## Table of Contents

1. [Project Setup & Configuration Checklist](#1-project-setup--configuration-checklist)
2. [What is `workbox-precaching`?](#2-what-is-workbox-precaching)
3. [Service Worker (`sw.ts`) — Line-by-Line Breakdown](#3-service-worker-swts--line-by-line-breakdown)
4. [Client-Side Firebase Configuration](#4-client-side-firebase-configuration)
5. [Registering the Service Worker & Getting FCM Token](#5-registering-the-service-worker--getting-fcm-token)
6. [Listening to Foreground Messages](#6-listening-to-foreground-messages)
7. [Alternative: No Precaching (Push-Only Setup)](#7-alternative-no-precaching-push-only-setup)

---

## 1. Project Setup & Configuration Checklist

The `vite.config.ts` is configured with `vite-plugin-pwa` using the `injectManifest` strategy. Before proceeding, ensure these are resolved:

### File Name Mismatch
`vite.config.ts` specifies `filename: 'sw.ts'` but the current file in `src/` is named `sw.js`. Rename it to `sw.ts`.

```typescript
// vite.config.ts
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts', // <-- src/sw.ts must exist and match
  registerType: 'autoUpdate',
  injectManifest: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
  },
  devOptions: {
    enabled: false, // Set to true + type: 'module' to test in dev
  }
})
```

### Testing in Development
`devOptions.enabled` is currently `false`. Options:
- **For dev testing**: Set `devOptions: { enabled: true, type: 'module' }` temporarily.
- **Recommended for push testing**: Build and serve the production output:

```bash
npm run build && npm run preview
```

### Install Required Packages
```bash
# From inside apps/web
npm install workbox-precaching
npm install firebase
```

---

## 2. What is `workbox-precaching`?

**Workbox** is a collection of open-source libraries from Google designed to make service worker development easier — covering caching strategies, routing, offline support, and more.

### What is "Precaching"?

In a normal web app, resources are cached **at runtime** (i.e., as the user navigates and requests files). **Precaching** is different — it happens during the **install phase** of the service worker, _before_ the user visits any page.

Here is how it works end-to-end:

1. **At build time (`vite build`)**: Vite scans all your output files and generates a manifest — a list of all assets (JS bundles, CSS, HTML, SVGs) along with unique content hashes (revisions).
2. **On first load**: The service worker installs and downloads + caches every item in that manifest list in the background.
3. **Offline / bad network**: If the user goes offline or has poor connectivity, `workbox-precaching` intercepts fetch requests for those assets and serves them directly from the local cache.
4. **On new deploy**: Workbox compares old and new revision hashes. Only changed files are re-downloaded; stale files are removed automatically.

### Why is it Required with `injectManifest`?

There are two strategies in `vite-plugin-pwa`:

| Strategy | Who writes the SW? | Notes |
|---|---|---|
| `generateSW` (default) | VitePWA generates it for you | Easy, but hard to add custom logic like FCM |
| `injectManifest` (your setup) | **You** write the SW | Full control; VitePWA only injects the manifest |

With `injectManifest`, VitePWA looks for the special placeholder variable `self.__WB_MANIFEST` in your `sw.ts` file and replaces it at build time with the actual manifest array:

```json
[
  { "url": "/index.html", "revision": "e2c3489a" },
  { "url": "/assets/main-abc123.js", "revision": null },
  { "url": "/assets/index-def456.css", "revision": null }
]
```

`workbox-precaching` provides the `precacheAndRoute()` function that consumes this array and wires up caching + request routing — this is why the import is required.

---

## 3. Service Worker (`sw.ts`) — Line-by-Line Breakdown

```typescript
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;
```

**What it does**: A Service Worker runs in a completely separate background thread — its own JS runtime called `ServiceWorkerGlobalScope`. It has **no access** to the DOM, `window`, or `document`.

These two lines tell TypeScript to apply web worker type definitions so that methods like `self.registration`, `self.skipWaiting()`, and `self.__WB_MANIFEST` are recognized without type errors.

---

```typescript
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST || []);
```

**What `self.__WB_MANIFEST` is**: A build-time placeholder. When you run `vite build`, VitePWA scans your build output and physically replaces `self.__WB_MANIFEST` with the actual asset manifest array.

**What `precacheAndRoute()` does**:
- During the `install` event of the service worker, it downloads all the listed assets and stores them in the browser's **Cache Storage**.
- It registers a `fetch` listener that serves those cached assets for future requests — enabling offline support.

The `|| []` fallback is there so the service worker does not crash during local development when the manifest hasn't been injected yet.

---

```typescript
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
```

**Why `firebase/messaging/sw` instead of `firebase/messaging`?**

Notice the `/sw` suffix in the import path. The standard `firebase/messaging` module relies on browser-only APIs (like `window.navigator`). The `/sw` variant is specifically tailored for the Service Worker environment and does not use any browser window APIs.

---

```typescript
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
```

**Why re-initialize Firebase inside the service worker?**

Service workers do **not share memory** with your React application. Even if you already call `initializeApp()` in `main.tsx` or `App.tsx`, the service worker runs in its own completely isolated process. It needs its own Firebase instance to connect to Google's FCM servers and decode incoming push payloads.

> **Tip**: You can use `import.meta.env.VITE_*` variables here too. Vite resolves them at compile time, so they work inside the service worker source file.

---

```typescript
onBackgroundMessage(messaging, (payload) => {
  console.log("[sw.ts] Received background message", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions: NotificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.icon || "/favicon.svg",
    data: payload.data, // Custom key-value data (e.g., { route: "/dashboard" })
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

**When does this execute?**

`onBackgroundMessage` fires **only when your app tab is closed or in the background**.

The flow is:
1. Your backend (or Firebase Console) sends a push notification to a device FCM token.
2. Google's FCM servers deliver a raw push event to the user's browser.
3. The browser wakes up the registered service worker.
4. Firebase intercepts the push event internally and calls your `onBackgroundMessage` callback with the parsed payload.

**`self.registration.showNotification()`**: This is the native browser API that tells the operating system (Windows, macOS, Android) to display a native notification card/toast.

**`payload.data`**: Any custom key-value pairs your backend sends alongside the notification. Useful for storing redirect URLs, entity IDs, etc., so you can navigate the user to the right page when they click the notification.

---

## 4. Client-Side Firebase Configuration

Create `apps/web/src/lib/firebase.ts` (or `src/api/firebase.ts`):

```typescript
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

// Safely returns a messaging instance only in supported browsers
export const getMessagingInstance = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};
```

**Why `isSupported()`?**: Firebase Messaging requires both `ServiceWorker` and `PushManager` APIs. Not all browsers (e.g., Firefox on iOS, some Chromium variants) support both. `isSupported()` prevents runtime crashes by returning a boolean promise.

Add these to your `.env` file (create if it doesn't exist at `apps/web/.env`):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_VAPID_KEY=...
```

> **Where to find the VAPID key**: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate key pair.

---

## 5. Registering the Service Worker & Getting FCM Token

Create `apps/web/src/hooks/useFcm.ts`:

```typescript
import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "../lib/firebase";

export async function registerAndGetFcmToken(): Promise<string | null> {
  // Guard: check browser support
  if (!("serviceWorker" in navigator) || !("Notification" in window)) {
    console.warn("Push messaging is not supported in this browser.");
    return null;
  }

  // Step 1: Ask the user for notification permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Notification permission denied.");
    return null;
  }

  // Step 2: Wait for VitePWA's service worker to become active
  // navigator.serviceWorker.ready resolves once a SW is controlling this page
  const registration = await navigator.serviceWorker.ready;

  // Step 3: Get the Firebase Messaging instance
  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  // Step 4: Request the FCM device token
  // The VAPID key is used to authenticate your server with FCM
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration, // Pass VitePWA's SW, not a new one
  });

  console.log("FCM Token:", token);
  return token;
}
```

**Why pass `serviceWorkerRegistration` manually?**

FCM's `getToken()` would normally register its own service worker (`firebase-messaging-sw.js`) if you don't pass one. Since VitePWA is already managing a service worker (your compiled `sw.ts`), you pass the existing registration to FCM so both Workbox and Firebase run inside the **same single service worker**.

---

## 6. Listening to Foreground Messages

When the app tab is **open and focused**, `onBackgroundMessage` does not fire. You handle foreground messages with `onMessage` in your React app:

```typescript
// In App.tsx or a top-level layout component
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { getMessagingInstance } from "./lib/firebase";
import { registerAndGetFcmToken } from "./hooks/useFcm";

export function useNotificationSetup() {
  useEffect(() => {
    // Register SW + get token on mount, then send token to your backend
    registerAndGetFcmToken().then((fcmToken) => {
      if (fcmToken) {
        // TODO: POST fcmToken to your backend API to store it for this user
        console.log("FCM Token ready:", fcmToken);
      }
    });

    // Subscribe to foreground push messages
    let unsubscribe: (() => void) | undefined;

    getMessagingInstance().then((messaging) => {
      if (messaging) {
        unsubscribe = onMessage(messaging, (payload) => {
          console.log("Foreground message:", payload);
          // TODO: Show a UI toast (e.g., Ant Design notification)
          // notification.open({ message: payload.notification?.title, ... });
        });
      }
    });

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
}
```

---

## 7. Alternative: No Precaching (Push-Only Setup)

If you **only need push notifications** and do not want PWA offline asset caching, you don't need `vite-plugin-pwa` or `workbox-precaching` at all.

Instead, place a plain JavaScript file directly in the `public/` folder:

```
apps/web/public/firebase-messaging-sw.js
```

```javascript
// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    { body: payload.notification.body, icon: "/favicon.svg" }
  );
});
```

**Trade-off**: This approach uses the older Firebase compat API via CDN scripts, cannot be TypeScript, and bypasses your Vite build pipeline. You also need to manually register it:

```typescript
navigator.serviceWorker.register("/firebase-messaging-sw.js");
```

**The `vite-plugin-pwa` approach** (your current config) is the recommended path — it lets you use TypeScript, modern ESM imports, and bundle Firebase inside the service worker through the Vite pipeline.
