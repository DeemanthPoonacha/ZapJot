import { db } from "@/lib/services/firebase";
import { Chapter, ChapterCreate, ChapterUpdate } from "@/types/chapters";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  writeBatch,
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
  const docRef = await addDoc(chaptersRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data };
};

// Update an existing chapter
export const updateChapter = async (
  userId: string,
  chapterId: string,
  data: ChapterUpdate
) => {
  const chapterRef = doc(db, `users/${userId}/chapters/${chapterId}`);
  await updateDoc(chapterRef, { ...data, updatedAt: new Date().toISOString() });
};

// Delete a chapter
export const deleteChapter = async (userId: string, chapterId: string) => {
  const chapterRef = doc(db, `users/${userId}/chapters/${chapterId}`);
  await deleteDoc(chapterRef);
  await deleteJournalsInChapter(userId, chapterId);
};

export const deleteJournalsInChapter = async (
  userId: string,
  chapterId: string
) => {
  const journalsRef = collection(
    db,
    `users/${userId}/chapters/${chapterId}/journals`
  );
  const snapshot = await getDocs(journalsRef);

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
};
