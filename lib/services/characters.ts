import {
  db,
  fetchDocsOptimistic,
  fetchDocOptimistic,
  setDocOptimistic,
  updateDocOptimistic,
  deleteDocOptimistic,
} from "./firebase/db";
import {
  collection,
  doc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  Character,
  CharacterCreate,
  createCharacterSchema,
  updateCharacterSchema,
} from "@/types/characters";

/**
 * Get all characters for a user.
 */
export const getCharacters = async (userId: string): Promise<Character[]> => {
  const charactersRef = collection(db, `users/${userId}/characters`);
  const snapshot = await fetchDocsOptimistic(charactersRef);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Character,
  );
};

export async function searchByName(userId: string, searchString: string) {
  if (!searchString) return [];

  const searchLower = searchString.toLowerCase();
  const endString = searchLower + "\uf8ff";

  const q = query(
    collection(db, `users/${userId}/characters`),
    where("lowercaseName", ">=", searchLower),
    where("lowercaseName", "<", endString),
  );

  const snapshot = await fetchDocsOptimistic(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    ...doc.data(),
  }));
}
/**
 * Get a single character by ID.
 */
export const getCharacterById = async (
  userId: string,
  characterId: string,
): Promise<Character | null> => {
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  const docSnap = await fetchDocOptimistic(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as Character)
    : null;
};

/**
 * Add a new character.
 */
export const addCharacter = async (
  userId: string,
  character: CharacterCreate,
) => {
  const charactersRef = collection(db, `users/${userId}/characters`);
  const payload = {
    ...character,
    lowercaseName: character.name.toLowerCase(),
    createdAt: character.createdAt || new Date().toISOString(),
    updatedAt: character.updatedAt || new Date().toISOString(),
  };

  // Validate character before write
  const validated = createCharacterSchema.parse(payload);
  const newDocRef = doc(charactersRef);
  await setDocOptimistic(newDocRef, validated);
  return { id: newDocRef.id, ...validated };
};

/**
 * Update an existing character.
 */
export const updateCharacter = async (
  userId: string,
  characterId: string,
  character: Partial<Character>,
) => {
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);

  // Extract id if passed so it's not written back as part of properties
  const updateData = { ...character };
  delete updateData.id;

  if (updateData.name) {
    updateData.lowercaseName = updateData.name.toLowerCase();
  }

  // Validate the update payload before write
  const validated = updateCharacterSchema.parse({
    ...updateData,
    updatedAt: new Date().toISOString(),
  });

  await updateDocOptimistic(docRef, validated);
  return characterId;
};

/**
 * Delete a character.
 */
export const deleteCharacter = async (userId: string, characterId: string) => {
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  await deleteDocOptimistic(docRef);
};

/**
 * Add a reminder to a character's reminders array.
 */
export const addReminder = async (
  userId: string,
  characterId: string,
  reminderId: string,
) => {
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  await updateDocOptimistic(docRef, {
    reminders: arrayUnion(reminderId),
  });
};

/**
 * Remove a reminder from a character's reminders array.
 */
export const removeReminder = async (
  userId: string,
  characterId: string,
  reminderId: string,
) => {
  const docRef = doc(db, `users/${userId}/characters/${characterId}`);
  await updateDocOptimistic(docRef, {
    reminders: arrayRemove(reminderId),
  });
};
