import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from "./actions";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(true);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.error(
        "Service workers are not supported in this browser. Push notifications will not work."
      );
      setIsSupported(false);
    } else if (!("PushManager" in window)) {
      console.error(
        "Push notifications are not supported in this browser. Push notifications will not work."
      );
      setIsSupported(false);
    }
  }, []);

  async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("Notification permission denied.");
      setIsSupported(false);
      throw new Error("Notification permission denied.");
    }
    // else {
    //   new Notification("Permission granted!");
    // }
  }

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    // registration.showNotification("Service Worker registered!");
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log("🚀 ~ subscribeToPush ~ registration:", registration);
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      console.log("🚀 ~ subscribeToPush ~ sub:", sub);
      setSubscription(sub);
      const serializedSub = JSON.parse(JSON.stringify(sub));
      console.log("🚀 ~ subscribeToPush ~ serializedSub:", serializedSub);
      await subscribeUser(serializedSub);
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
    }
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  return (
    <div>
      <Button
        onClick={() => {
          requestNotificationPermission();
          registerServiceWorker();
        }}
      >
        Enable Push Notifications
      </Button>
      {!isSupported && (
        <p>Push notifications are not supported in this browser.</p>
      )}
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <Button onClick={unsubscribeFromPush}>Unsubscribe</Button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendTestNotification}>Send Test</Button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <Button onClick={subscribeToPush}>Subscribe</Button>
        </>
      )}
    </div>
  );
}
export default PushNotificationManager;
