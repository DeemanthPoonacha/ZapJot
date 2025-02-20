import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/services/firebase";

// Add a character
export const addCharacter = async (
  userId: string,
  name: string,
  relation: string
) => {
  return await addDoc(collection(db, `characters/${userId}/contacts`), {
    name,
    relation,
    createdAt: new Date(),
  });
};

// Get all characters
export const getCharacters = async (userId: string) => {
  const snapshot = await getDocs(
    collection(db, `characters/${userId}/contacts`)
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
