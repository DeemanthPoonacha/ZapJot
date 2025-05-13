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
  EmailAuthProvider,
  reauthenticateWithCredential,
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

export const deleteAccount = async (reauthData?: {
  email?: string;
  password?: string;
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently signed in.");

  const providerId = user.providerData[0]?.providerId;

  if (providerId === "google.com") {
    await reauthenticateWithPopup(user, new GoogleAuthProvider());
  } else if (providerId === "password") {
    const { email, password } = reauthData || {};
    if (!email || !password) {
      throw new Error("Email and password required for reauthentication.");
    }
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);
  } else {
    throw new Error(`Unsupported provider: ${providerId}`);
  }

  await deleteUserData(user.uid);
  await deleteUser(user);
};
