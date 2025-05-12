import { db } from "@/lib/services/firebase";
import { Journal, JournalCreate, JournalUpdate } from "@/types/journals";
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
import { DEFAULT_CHAPTER_ID } from "../constants";

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
  await checkAndCreateNewChapter(userId, chapterId);

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
  data: JournalUpdate
) => {
  console.log("🚀 ~ chapterId:", chapterId);
  const newChapterId = data.chapterId;
  if (newChapterId && newChapterId !== chapterId) {
    await moveJournal(userId, journalId, chapterId, newChapterId);
  }
  const editingChapterId = newChapterId || chapterId;

  const journalRef = doc(
    db,
    `users/${userId}/chapters/${editingChapterId}/journals/${journalId}`
  );
  await updateDoc(journalRef, { ...data, updatedAt: new Date().toISOString() });
  return { id: journalId, ...data };
};

export const moveJournal = async (
  userId: string,
  journalId: string,
  oldChapterId: string,
  newChapterId: string
) => {
  console.log("Moving journal from", oldChapterId, "to", newChapterId);

  if (newChapterId === oldChapterId) {
    return;
  }

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

  await checkAndCreateNewChapter(userId, newChapterId);

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

export async function checkAndCreateNewChapter(
  userId: string,
  newChapterId: string,
  description: string = "This chapter holds notes, thoughts, or entries that don't quite fit into any specific category or predefined chapter. It's a flexible space for miscellaneous ideas, spontaneous jottings, or anything you're unsure where to place—until you decide if it belongs elsewhere or deserves a chapter of its own."
) {
  const chapterRef = doc(db, `users/${userId}/chapters/${newChapterId}`);
  const chapterSnapshot = await getDoc(chapterRef);

  if (!chapterSnapshot.exists()) {
    await setDoc(chapterRef, {
      id: generateIdByName(newChapterId) || DEFAULT_CHAPTER_ID,
      title:
        `${newChapterId[0].toUpperCase()}${newChapterId.slice(1)}` || "Others",
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

function generateIdByName(newChapterId: string): string {
  return newChapterId.trim().toLowerCase().replace(/ /g, "-");
}
