import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { generateEncryptedUserKey } from "../utils/encryption";

export type UserEncryptedKey = {
  encryptedKey: string;
  iv: string;
};

export async function setUserKey(userId: string, email: string) {
  try {
    const encryption = await generateEncryptedUserKey(userId, email);
    await setDoc(
      doc(db, "users", userId),
      {
        email,
        encryption,
        createdAt: Date.now(),
      },
      { merge: true }
    );
    console.log("User key setup successfully");
  } catch (error) {
    console.error("Error setting up user key:", error);
    throw new Error("Failed to set up user key");
  }
}

export async function getUserKey(userId: string) {
  const keyDoc = await getDoc(doc(db, "users", userId));
  const { encryptedKey, iv } = keyDoc.data()?.encryption as UserEncryptedKey;
  return {
    encryptedKey,
    iv,
  };
}

// export async function rotateUserKey(userId: string, email: string) {
//   const oldDoc = await getDoc(doc(db, "users", userId));
//   const { encrypted, iv } = await generateEncryptedUserKey(userId, email);
//   await setDoc(
//     doc(db, "users", userId),
//     {
//       encryptedKey: encrypted,
//       iv,
//       updatedAt: Date.now(),
//     },
//     { merge: true }
//   );
// }
