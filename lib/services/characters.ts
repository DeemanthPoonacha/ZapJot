import { db } from "@/lib/services/firebase";
import {
  doc,
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Character, CharacterCreate, Reminder } from "@/types/characters";

// Firestore Collections
const charactersCollection = collection(db, "characters");
const eventsCollection = collection(db, "events");

/**
 * Get all characters for a user
 */
export const getCharacters = async (userId: string): Promise<Character[]> => {
  const snapshot = await getDocs(charactersCollection);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Character))
    .filter((char) => char.userId === userId);
};

/**
 * Get a single character by ID
 */
export const getCharacterById = async (
  id: string
): Promise<Character | null> => {
  const docRef = doc(charactersCollection, id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Character)
    : null;
};

/**
 * Add a new character
 */
export const addCharacter = async (data: CharacterCreate): Promise<string> => {
  // Create reminders separately in "events" collection
  const reminderRefs = await Promise.all(
    data.reminders.map(async (reminder) => {
      const reminderDoc = await addDoc(eventsCollection, reminder);
      return reminderDoc.id; // Store only the reference in the character doc
    })
  );

  const newCharacter = {
    userId: data.userId,
    name: data.name,
    title: data.title || "",
    reminders: reminderRefs, // Store reference IDs, not full objects
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const docRef = await addDoc(charactersCollection, newCharacter);
  return docRef.id;
};

/**
 * Update a character (updates character details and manages reminders)
 */
export const updateCharacter = async (
  id: string,
  data: Partial<CharacterCreate>
) => {
  if (data.reminders) {
    // Create new reminders in "events" collection
    const reminderRefs = await Promise.all(
      data.reminders.map(async (reminder) => {
        const reminderDoc = await addDoc(eventsCollection, reminder);
        return reminderDoc.id;
      })
    );

    // data.reminders = reminderRefs; // Store only reference IDs
  }

  data.updatedAt = new Date().toISOString();

  const docRef = doc(charactersCollection, id);
  await updateDoc(docRef, data);
};

/**
 * Delete a character and its reminders
 */
export const deleteCharacter = async (id: string, reminderIds: string[]) => {
  await deleteDoc(doc(charactersCollection, id));

  // Delete associated reminders from "events" collection
  await Promise.all(
    reminderIds.map(async (reminderId) =>
      deleteDoc(doc(eventsCollection, reminderId))
    )
  );
};
