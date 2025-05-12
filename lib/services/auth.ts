// @/lib/services/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  deleteUser,
  reauthenticateWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { deleteUserData } from "./user-config";

export const signUp = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  return signOut(auth);
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const deleteAccount = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently signed in.");
  try {
    // Optional: Delete user data from Firestore/Storage
    await deleteUserData(user.uid);

    // Attempt to delete the user
    await deleteUser(user);
  } catch (error) {
    if ((error as { code: string }).code === "auth/requires-recent-login") {
      // Reauthenticate with Google popup
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);

      // Try deleting again after reauthentication
      await deleteUserData(user.uid); // In case data wasn't deleted before
      await deleteUser(user);
    } else {
      throw error;
    }
  }
};
