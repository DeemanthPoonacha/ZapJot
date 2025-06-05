import { db } from "@/lib/services/firebase/base";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Character, CharacterCreate } from "@/types/characters";

/**
 * Get all characters for a user.
 */
export const getCharacters = async (
  userId: string
  // filter?: CharactersFilter,
  // fields?: string[]
): Promise<Character[]> => {
  // let q = query(collection(db, `users/${userId}/characters`));

  // if (filter && filter.characterIds) {
  //   q = query(q, where("id", "in", filter.characterIds));
  // }

  // if (!!fields?.length) {
  //   q = query(q, (q as any).select(...fields)); // `.select()` is a method, not an import
  // }

  const charactersRef = collection(db, `users/${userId}/characters`);
  const snapshot = await getDocs(charactersRef);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Character)
  );
};

export async function searchByName(userId: string, searchString: string) {
  if (!searchString) return [];

  const searchLower = searchString.toLowerCase();
  const endString = searchLower + "\uf8ff";

  const q = query(
    collection(db, `users/${userId}/characters`),
    where("lowercaseName", ">=", searchLower),
    where("lowercaseName", "<", endString)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
}
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
  console.log("🚀 ~ character:", character);
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

/**
 * Add a reminder to a character's reminders array.
 */
export const addReminder = async (
  userId: string,
  characterId: string,
  reminderId: string
) => {
  console.log("🚀 Adding reminder:", characterId, reminderId);
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  await updateDoc(docRef, {
    reminders: arrayUnion(reminderId),
  });
};

/**
 * Remove a reminder from a character's reminders array.
 */
export const removeReminder = async (
  userId: string,
  characterId: string,
  reminderId: string
) => {
  console.log("🚀 Removing reminder:", characterId, reminderId);
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  await updateDoc(docRef, {
    reminders: arrayRemove(reminderId),
  });
};
