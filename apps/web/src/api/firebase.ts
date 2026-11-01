import { initializeApp } from 'firebase/app'
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
}

export const app = initializeApp(firebaseConfig)

// Helper to safely get messaging (ensures browser supports PushManager & Sw)

export const getMessagingInstance = async () => {
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
}

// This is the client side firebase configuration

