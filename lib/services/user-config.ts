import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { generateEncryptedUserKey } from "../utils/encryption";
import { UserInDb } from "@/types/user";
import { getDeviceId } from "../utils";
import { DEFAULT_CHAPTER_ID, DEFAULT_THEME } from "../constants";
import { checkAndCreateNewChapter } from "./journals";

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

export const deleteUserData = async (uid: string) => {
  console.log("🚀 ~ deleteUserData ~ uid:", uid);
  // await deleteDoc(doc(db, "users", uid)); // Change path if your user data is elsewhere
};
