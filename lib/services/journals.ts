import { db } from "@/lib/services/firebase";
import {
  Chapter,
  ChapterCreate,
  Journal,
  JournalCreate,
} from "@/types/journals";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

// Get all chapters for a user
export const getChapters = async (userId: string): Promise<Chapter[]> => {
  const chaptersRef = collection(db, `users/${userId}/chapters`);
  const snapshot = await getDocs(chaptersRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chapter[];
};

// Get a single chapter by ID
export const getChapterById = async (
  userId: string,
  chapterId: string
): Promise<Chapter | null> => {
  const docRef = doc(db, `users/${userId}/chapters/${chapterId}`);
  const snapshot = await getDoc(docRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Chapter)
    : null;
};

// Add a new chapter
export const addChapter = async (userId: string, data: ChapterCreate) => {
  const chaptersRef = collection(db, `users/${userId}/chapters`);
  await addDoc(chaptersRef, { ...data, updatedAt: new Date().toISOString() });
};

// Update an existing chapter
export const updateChapter = async (
  userId: string,
  chapterId: string,
  data: ChapterCreate
) => {
  const chapterRef = doc(db, `users/${userId}/chapters/${chapterId}`);
  await updateDoc(chapterRef, { ...data, updatedAt: new Date().toISOString() });
};

// Delete a chapter
export const deleteChapter = async (userId: string, chapterId: string) => {
  const chapterRef = doc(db, `users/${userId}/chapters/${chapterId}`);
  await deleteDoc(chapterRef);
};

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
  await addDoc(journalsRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
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
