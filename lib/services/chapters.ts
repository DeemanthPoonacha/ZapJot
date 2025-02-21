import { db } from "@/lib/services/firebase";
import { Chapter, ChapterCreate } from "@/types/chapters";
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
