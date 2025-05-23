import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Analytics,
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from "firebase/analytics"; // Import getAnalytics and rename isSupported for clarity
import {
  getMessaging,
  isSupported as isMessagingSupported,
  Messaging,
} from "firebase/messaging"; // Import getMessaging and rename isSupported
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps.length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Messaging with support check
let messaging: Messaging | null = null; // Initialize as null
isMessagingSupported().then((supported) => {
  // Use the renamed function
  if (supported) {
    try {
      messaging = getMessaging(app);
      console.log("Firebase messaging initialized.");
    } catch (e) {
      console.error("Error initializing Firebase messaging:", e);
    }
  } else {
    console.warn("Firebase messaging is not supported in this environment.");
  }
});

// Initialize Analytics with support check
let analytics: Analytics | null = null; // Initialize as null
isAnalyticsSupported().then((supported) => {
  // Use the renamed function
  if (supported) {
    try {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized.");
    } catch (e) {
      console.error("Error initializing Firebase Analytics:", e);
    }
  } else {
    console.warn("Firebase Analytics is not supported in this environment.");
  }
});

// Add this after initializing `app`
if (typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      process.env.NEXT_PUBLIC_RECAPTCHA_V3_KEY || ""
    ),
    isTokenAutoRefreshEnabled: true,
  });
}

// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
const model = getGenerativeModel(ai, { model: "gemini-2.0-flash" });

export { db, app, auth, messaging, analytics, ai, model }; // Export the analytics instance!
