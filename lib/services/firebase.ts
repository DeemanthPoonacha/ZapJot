import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Analytics,
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from "firebase/analytics";
import {
  getMessaging,
  isSupported as isMessagingSupported,
  Messaging,
} from "firebase/messaging";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { AI_SYSTEM_PROMPT } from "../constants";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Messaging with support check
let messaging: Messaging | null = null;
isMessagingSupported().then((supported) => {
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
let analytics: Analytics | null = null;
isAnalyticsSupported().then((supported) => {
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

if (typeof window !== "undefined") {
  try {
    // Add this after initializing `app`
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        process.env.NEXT_PUBLIC_RECAPTCHA_V3_KEY || ""
      ),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error("Error initializing Firebase App Check:", error);
  }
}
// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with enhanced configuration
const model = getGenerativeModel(ai, {
  model: "gemini-2.0-flash",
  systemInstruction: AI_SYSTEM_PROMPT,
  generationConfig: {
    responseMimeType: "application/json", // Default to JSON responses
    temperature: 0.7, // Adjust creativity level
    topK: 40,
    topP: 0.95,
    // maxOutputTokens: 2048, // Limit response length
  },
});

export { db, app, auth, messaging, analytics, ai, model };
