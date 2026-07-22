import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getDocs,
  getDoc,
  getDocsFromCache,
  getDocFromCache,
  setDoc,
  updateDoc,
  deleteDoc,
  Query,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { app } from "./base";

export const db = (() => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (e) {
    console.warn("initializeFirestore failed, using getFirestore:", e);
    return getFirestore(app);
  }
})();

export async function fetchDocsOptimistic(q: Query): Promise<QuerySnapshot> {
  if (typeof window !== "undefined" && !navigator.onLine) {
    try {
      return await getDocsFromCache(q);
    } catch (e) {
      console.warn("getDocsFromCache failed while offline:", e);
    }
  }
  try {
    return await getDocs(q);
  } catch (error) {
    console.warn("getDocs network fetch failed, falling back to cache:", error);
    return await getDocsFromCache(q);
  }
}

export async function fetchDocOptimistic(
  docRef: DocumentReference,
): Promise<DocumentSnapshot> {
  if (typeof window !== "undefined" && !navigator.onLine) {
    try {
      return await getDocFromCache(docRef);
    } catch (e) {
      console.warn("getDocFromCache failed while offline:", e);
    }
  }
  try {
    return await getDoc(docRef);
  } catch (error) {
    console.warn("getDoc network fetch failed, falling back to cache:", error);
    return await getDocFromCache(docRef);
  }
}

export async function setDocOptimistic(
  docRef: DocumentReference,
  data: any,
  options?: any,
): Promise<void> {
  const p = options ? setDoc(docRef, data, options) : setDoc(docRef, data);
  if (typeof window !== "undefined" && !navigator.onLine) {
    p.catch((err) => console.warn("Background setDoc sync error:", err));
    return;
  }
  await Promise.race([
    p.catch((err) => console.warn("setDoc error:", err)),
    new Promise((resolve) => setTimeout(resolve, 400)),
  ]);
}

export async function updateDocOptimistic(
  docRef: DocumentReference,
  data: any,
): Promise<void> {
  const p = updateDoc(docRef, data);
  if (typeof window !== "undefined" && !navigator.onLine) {
    p.catch((err) => console.warn("Background updateDoc sync error:", err));
    return;
  }
  await Promise.race([
    p.catch((err) => console.warn("updateDoc error:", err)),
    new Promise((resolve) => setTimeout(resolve, 400)),
  ]);
}

export async function deleteDocOptimistic(
  docRef: DocumentReference,
): Promise<void> {
  const p = deleteDoc(docRef);
  if (typeof window !== "undefined" && !navigator.onLine) {
    p.catch((err) => console.warn("Background deleteDoc sync error:", err));
    return;
  }
  await Promise.race([
    p.catch((err) => console.warn("deleteDoc error:", err)),
    new Promise((resolve) => setTimeout(resolve, 400)),
  ]);
}
