import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { AI_SYSTEM_PROMPT } from "../constants";
import { Messaging } from "firebase/messaging";
import { Analytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// AI
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance
const model = getGenerativeModel(ai, {
  model: "gemini-2.0-flash",
  systemInstruction: AI_SYSTEM_PROMPT,
  generationConfig: {
    responseMimeType: "application/json", // Default to JSON responses
    temperature: 0.7, // Adjust creativity level
    topK: 40,
    topP: 0.95,
  },
});

// Lazy-initialize browser-only features
let messaging: Messaging | null = null;
let analytics: Analytics | null = null;

if (window && typeof window !== "undefined") {
  // Only import these in the browser
  import("firebase/messaging").then(({ getMessaging, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
        console.log("Firebase Messaging initialized.");
      }
    });
  });

  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized.");
      }
    });
  });

  import("firebase/app-check").then(
    ({ initializeAppCheck, ReCaptchaV3Provider }) => {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_RECAPTCHA_V3_KEY || ""
        ),
        isTokenAutoRefreshEnabled: true,
      });
    }
  );
}

export { db, app, auth, messaging, analytics, ai, model };
