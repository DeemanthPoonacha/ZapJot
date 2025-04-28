import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/services/firebase";

const FCM_VAPID_KEY = process.env.NEXT_PUBLIC_FCM_VAPID_KEY!;

export const getFcmToken = async (): Promise<string | null> => {
  try {
    // Register custom service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("🚀 ~ getFcmToken ~ registration:", registration);

    const messagingInstance = await messaging();
    if (!messagingInstance) {
      console.error("Firebase messaging is not supported.");
      return null;
    }

    // Pass the service worker to getToken
    const token = await getToken(messagingInstance!, {
      vapidKey: FCM_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token;
  } catch (err) {
    console.error("FCM token error", err);
    return null;
  }
};
