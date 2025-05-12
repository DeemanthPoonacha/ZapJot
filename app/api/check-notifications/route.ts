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
import serviceAccountJson from "@/service_key.json";
import { getMinutesRelative } from "@/lib/utils";
import { UserInDb } from "@/types/user";

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

    const totalEvents = snapshot.size;
    console.log(`Total events: ${totalEvents}`);

    let sentCount = 0;

    for (const document of snapshot.docs) {
      const event = document.data();
      const userId = document.ref.path.split("/")[1];
      const userSnap = await getDoc(doc(db, "users", userId));
      const user = userSnap.data() as UserInDb;

      const devices = user?.settings?.notifications?.devices || {};

      for (const [deviceId, deviceInfo] of Object.entries(devices)) {
        try {
          if (!deviceInfo.enabled || !deviceInfo.token) continue;

          const payload: Message = {
            token: deviceInfo.token,
            notification: {
              title: event.title,
              body: `${getMinutesRelative(event.nextOccurrence?.toDate())}`,
            },
            webpush: {
              fcmOptions: {
                link: "https://zap-jot.netlify.app/planner",
              },
            },
          };

          await admin.messaging().send(payload);
          sentCount++;
        } catch (sendError) {
          console.error(`Failed to send to ${deviceId}`, sendError);
        }
      }

      await updateDoc(document.ref, { nextNotificationAt: null });
    }

    return Response.json({
      status: `Notificaions sent!`,
      sentCount,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return Response.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
