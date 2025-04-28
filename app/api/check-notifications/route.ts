import { db } from "@/lib/services/firebase";
import {
  getDocs,
  query,
  collectionGroup,
  where,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { UserSettings } from "@/types/settings";
import serviceAccountJson from "@/service_key.json";

if (!admin.apps.length) {
  const serviceAccount = serviceAccountJson as admin.ServiceAccount;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function GET(request: Request) {
  try {
    const AUTH_SECRET = process.env.NOTIF_SECRET;
    const auth = request.headers.get("Authorization");

    if (auth !== `Bearer ${AUTH_SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Fetch due notifications from Firestore
    const snapshot = await getDocs(
      query(
        collectionGroup(db, "events"),
        where("nextNotificationAt", "<=", now)
      )
    );

    if (snapshot.empty) {
      console.log("No notifications to send");
      return Response.json({ status: "No notifications to send" });
    }

    console.log("Notifications to send", snapshot.size);

    for (const document of snapshot.docs) {
      const event = document.data();
      const userRef = document.ref.path.split("/")[1]; // crude userId extract
      const user = await getDoc(doc(db, "users", userRef));
      const fcmToken = (user.data() as UserSettings)?.settings?.notifications
        ?.fcmToken;

      if (fcmToken) {
        const payload: Message = {
          token: fcmToken,
          notification: {
            title: event.title,
            body: `${event.nextOccurrence}`,
          },
        };
        console.log("🚀 ~ GET ~ payload:", payload);

        await admin.messaging().send(payload);
      }

      await updateDoc(document.ref, { nextNotificationAt: null });
    }

    return Response.json({ status: "Notifications sent" });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return Response.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
