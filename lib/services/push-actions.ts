"use server";

import webpush, { SendResult } from "web-push";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

webpush.setVapidDetails(
  "mailto:dev.deemanth@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function subscribeUser(userId: string, sub: PushSubscription) {
  try {
    // Store subscription with user ID in Firestore
    await addDoc(collection(db, "pushSubscriptions"), {
      userId,
      subscription: sub,
      createdAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error subscribing user:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}

export async function unsubscribeUser(userId: string) {
  try {
    // Find and delete the subscription
    const q = query(
      collection(db, "pushSubscriptions"),
      where("userId", "==", userId)
      // where("subscription.endpoint", "==", endpoint)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    return { success: true };
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    return { success: false, error: "Failed to unsubscribe" };
  }
}

export async function sendNotificationToUser(userId: string, message: string) {
  try {
    // Get all subscriptions for this user
    const q = query(
      collection(db, "pushSubscriptions"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "No subscriptions found for user" };
    }

    const promises: Promise<void | SendResult>[] = [];

    // Send notification to all user's devices
    querySnapshot.forEach((doc) => {
      const { subscription } = doc.data();

      promises.push(
        webpush
          .sendNotification(
            subscription,
            JSON.stringify({
              title: "This is a Test Notification",
              body: message,
              icon: "/icon-192x192.png",
              url: "/test",
            })
          )
          .catch(async (error) => {
            console.error("Error sending notification:", error);

            // If subscription is invalid, remove it
            if (error.statusCode === 410) {
              await deleteDoc(doc.ref);
            }
          })
      );
    });

    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error("Error sending push notifications:", error);
    return { success: false, error: "Failed to send notifications" };
  }
}

// Send to all users (for broadcasts)
export async function sendNotificationToAll(message: string) {
  try {
    const querySnapshot = await getDocs(collection(db, "pushSubscriptions"));

    if (querySnapshot.empty) {
      return { success: false, error: "No subscriptions found" };
    }

    const promises: Promise<void | SendResult>[] = [];

    querySnapshot.forEach((doc) => {
      const { subscription } = doc.data();

      promises.push(
        webpush
          .sendNotification(
            subscription,
            JSON.stringify({
              title: "Broadcast Notification",
              body: message,
              icon: "/icon-192x192.png",
            })
          )
          .catch(async (error) => {
            if (error.statusCode === 410) {
              await deleteDoc(doc.ref);
            }
          })
      );
    });

    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error("Error sending broadcast:", error);
    return { success: false, error: "Failed to send broadcast" };
  }
}
