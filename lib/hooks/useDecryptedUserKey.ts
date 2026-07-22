import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/services/firebase/auth"; // Adjust based on your setup
import { decryptUserKey, deriveSimpleKey } from "@/lib/utils/encryption";
import { useGlobalState } from "./global-state";
import { getUserKey } from "../services/encryption";

const keyCache = new Map<string, CryptoKey>();

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
        if (keyCache.has(user.uid)) {
          setKey(keyCache.get(user.uid)!);
          setLoading(false);
        }

        try {
          const { encryptedKey, iv } = await getUserKey(user.uid);
          if (encryptedKey && iv) {
            const decrypted = await decryptUserKey(
              user.uid,
              user.email,
              encryptedKey,
              iv
            );
            keyCache.set(user.uid, decrypted);
            setKey(decrypted);
          } else {
            const derived = await deriveSimpleKey(user.uid, user.email);
            keyCache.set(user.uid, derived);
            setKey(derived);
          }
        } catch (_err) {
          try {
            const derived = await deriveSimpleKey(user.uid, user.email);
            keyCache.set(user.uid, derived);
            setKey(derived);
          } catch (fallbackErr) {
            setError(
              fallbackErr instanceof Error
                ? fallbackErr
                : new Error("Failed to derive encryption key")
            );
          }
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
