import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/services/firebase"; // Adjust based on your setup
import { decryptUserKey } from "@/lib/utils/encryption";
import { useGlobalState } from "./global-state";
import { getUserKey } from "../services/encryption";

export function useDecryptedUserKey() {
  const [key, setKey] = useGlobalState<CryptoKey | null>(
    ["encrypted-key"],
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setLoading(true);
      if (user && user.email) {
        try {
          const { encryptedKey, iv } = await getUserKey(user.uid);
          if (encryptedKey && iv) {
            const decrypted = await decryptUserKey(
              user.uid,
              user.email,
              encryptedKey,
              iv
            );
            setKey(decrypted);
          } else {
            setError(new Error("Encrypted key not found."));
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } else {
        setKey(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { key, loading, error };
}
