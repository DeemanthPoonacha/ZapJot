import { db } from "@/lib/services/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { Character, CharacterCreate } from "@/types/characters";

/**
 * Get all characters for a user.
 */
export const getCharacters = async (userId: string): Promise<Character[]> => {
  const charactersRef = collection(db, `users/${userId}/characters`);
  const snapshot = await getDocs(charactersRef);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Character)
  );
};

/**
 * Get a single character by ID.
 */
export const getCharacterById = async (
  userId: string,
  characterId: string
): Promise<Character | null> => {
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as Character)
    : null;
};

/**
 * Add a new character.
 */
export const addCharacter = async (
  userId: string,
  character: CharacterCreate
) => {
  const charactersRef = collection(db, `users/${userId}/characters`);
  const docRef = await addDoc(charactersRef, character);
  return { id: docRef.id, ...character };
};

/**
 * Update an existing character.
 */
export const updateCharacter = async (
  userId: string,
  characterId: string,
  character: Partial<Character>
) => {
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  await updateDoc(docRef, character);
};

/**
 * Delete a character.
 */
export const deleteCharacter = async (userId: string, characterId: string) => {
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  await deleteDoc(docRef);
};
