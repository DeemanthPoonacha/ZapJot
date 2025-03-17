import { db } from "@/lib/services/firebase";
import { Journal, JournalCreate } from "@/types/journals";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

// Get all journals for a chapter
export const getJournals = async (userId: string, chapterId: string) => {
  const journalsRef = collection(
    db,
    `users/${userId}/chapters/${chapterId}/journals`
  );
  const snapshot = await getDocs(journalsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Journal[];
};

// Get a single journal by ID
export const getJournalById = async (
  userId: string,
  chapterId: string,
  journalId: string
): Promise<Journal | null> => {
  const docRef = doc(
    db,
    `users/${userId}/chapters/${chapterId}/journals/${journalId}`
  );
  const snapshot = await getDoc(docRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Journal)
    : null;
};

// Add a new journal
export const addJournal = async (
  userId: string,
  chapterId: string,
  data: JournalCreate
) => {
  const journalsRef = collection(
    db,
    `users/${userId}/chapters/${chapterId}/journals`
  );
  const docRef = await addDoc(journalsRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
};

// Update an existing journal
export const updateJournal = async (
  userId: string,
  chapterId: string,
  journalId: string,
  data: JournalCreate
) => {
  const journalRef = doc(
    db,
    `users/${userId}/chapters/${chapterId}/journals/${journalId}`
  );
  await updateDoc(journalRef, { ...data, updatedAt: new Date().toISOString() });
};

export const moveJournal = async (
  userId: string,
  journalId: string,
  oldChapterId: string,
  newChapterId: string
) => {
  const oldRef = doc(
    db,
    `users/${userId}/chapters/${oldChapterId}/journals/${journalId}`
  );
  const newRef = doc(
    db,
    `users/${userId}/chapters/${newChapterId}/journals/${journalId}`
  );

  const snapshot = await getDoc(oldRef);
  if (!snapshot.exists()) {
    throw new Error("Journal not found");
  }

  const journalData = snapshot.data();
  await setDoc(newRef, {
    ...journalData,
    chapterId: newChapterId,
    updatedAt: new Date(),
  });
  await deleteDoc(oldRef);
  return newChapterId;
};

// Delete a journal
export const deleteJournal = async (
  userId: string,
  chapterId: string,
  journalId: string
) => {
  const journalRef = doc(
    db,
    `users/${userId}/chapters/${chapterId}/journals/${journalId}`
  );
  await deleteDoc(journalRef);
};
