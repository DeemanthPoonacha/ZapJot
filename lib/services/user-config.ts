import { doc, setDoc, deleteDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./firebase/db";
import { generateEncryptedUserKey } from "../utils/encryption";
import { UserInDb } from "@/types/user";
import { getDeviceId } from "../utils";
import { DEFAULT_CHAPTER_ID, DEFAULT_THEME } from "../constants";
import { checkAndCreateNewChapter } from "./journals";
import { AVAILABLE_MODELS } from "./firebase/ai";

export async function setUpUser(userId: string, email: string) {
  try {
    const encryption = await generateEncryptedUserKey(userId, email);
    const deviceId = getDeviceId();
    const timestamp = new Date().toISOString();
    const user: UserInDb = {
      createdAt: timestamp,
      updatedAt: timestamp,
      email,
      encryption,
      settings: {
        createdAt: timestamp,
        updatedAt: timestamp,
        theme: DEFAULT_THEME,
        ai: {
          confirmAiActions: true,
          preferredModel: AVAILABLE_MODELS[0],
        },
        notifications: {
          devices: {
            [deviceId]: {
              token: "",
              enabled: false,
              lastActive: timestamp,
            },
          },
          notifyMinsBefore: 10,
        },
      },
    };
    await setDoc(doc(db, "users", userId), user, { merge: true });
    await checkAndCreateNewChapter(userId, DEFAULT_CHAPTER_ID);
    console.log("User setup successfully");
  } catch (error) {
    console.error("Error setting up user:", error);
    throw new Error("Failed to set up user");
  }
}

/** Helper to delete all documents in a collection/subcollection in chunked batches of 400 */
async function deleteCollection(collectionRef: any) {
  const snapshot = await getDocs(collectionRef);
  const docs = snapshot.docs;
  const chunkSize = 400;
  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    chunk.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  }
}

export const deleteUserData = async (uid: string) => {
  try {
    console.log(`Starting cascade deletion for user: ${uid}`);

    // 1. Delete tasks
    await deleteCollection(collection(db, `users/${uid}/tasks`));

    // 2. Delete events
    await deleteCollection(collection(db, `users/${uid}/events`));

    // 3. Delete goals
    await deleteCollection(collection(db, `users/${uid}/goals`));

    // 4. Delete characters
    await deleteCollection(collection(db, `users/${uid}/characters`));

    // 5. Cascade delete chapters and nested journals
    const chaptersRef = collection(db, `users/${uid}/chapters`);
    const chaptersSnapshot = await getDocs(chaptersRef);
    for (const chapterDoc of chaptersSnapshot.docs) {
      const journalsRef = collection(db, `users/${uid}/chapters/${chapterDoc.id}/journals`);
      await deleteCollection(journalsRef);
    }
    await deleteCollection(chaptersRef);

    // 6. Delete itineraries
    await deleteCollection(collection(db, `users/${uid}/itineraries`));

    // 7. Finally delete the user document itself
    await deleteDoc(doc(db, "users", uid));

    console.log(`Cascade deletion completed for user: ${uid}`);
  } catch (error) {
    console.error(`Error deleting user data for ${uid}:`, error);
    throw error;
  }
};
