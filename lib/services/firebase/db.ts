import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getDocs,
  getDoc,
  getDocsFromCache,
  getDocFromCache,
  Query,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { app } from "./base";

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

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
  docRef: DocumentReference
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


