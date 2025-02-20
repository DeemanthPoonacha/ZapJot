import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/services/firebase";

const dummyuser = {
  uid: "testUser123",
  displayName: "Test User",
  email: "a7K4o@example.com",
  emailVerified: true,
  isAnonymous: false,
  phoneNumber: null,
  photoURL: null,
  providerData: [],
  providerId: "",
  refreshToken: "",
  tenantId: "",
  metadata: { creationTime: "", lastSignInTime: "" },
  getIdToken: () => Promise.resolve(""),
  getIdTokenResult: () => Promise.resolve({} as any),
  delete: () => Promise.resolve(),
  reload: () => Promise.resolve(),
  toJSON: () => ({}),
};
export const useUser = () => {
  const [user, setUser] = useState<User | null>(dummyuser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      //   setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
