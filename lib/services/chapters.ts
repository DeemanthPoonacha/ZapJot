import {
  db,
  fetchDocsOptimistic,
  fetchDocOptimistic,
  setDocOptimistic,
  updateDocOptimistic,
  deleteDocOptimistic,
} from "./firebase/db";
import {
  Chapter,
  ChapterCreate,
  ChapterUpdate,
  createChapterSchema,
  updateChapterSchema,
} from "@/types/chapters";
import { collection, doc, writeBatch } from "firebase/firestore";

// Get all chapters for a user
export const getChapters = async (userId: string): Promise<Chapter[]> => {
  const chaptersRef = collection(db, `users/${userId}/chapters`);
  const snapshot = await fetchDocsOptimistic(chaptersRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chapter[];
};

// Get a single chapter by ID
export const getChapterById = async (
  userId: string,
  chapterId: string,
): Promise<Chapter | null> => {
  const docRef = doc(db, `users/${userId}/chapters/${chapterId}`);
  const snapshot = await fetchDocOptimistic(docRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Chapter)
    : null;
};

// Add a new chapter
export const addChapter = async (userId: string, data: ChapterCreate) => {
  const chaptersRef = collection(db, `users/${userId}/chapters`);
  const payload = {
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };

  // Validate chapter payload before setDoc
  const validated = createChapterSchema.parse(payload);
  const newDocRef = doc(chaptersRef);
  await setDocOptimistic(newDocRef, validated);
  return { id: newDocRef.id, ...validated };
};

// Update an existing chapter
export const updateChapter = async (
  userId: string,
  chapterId: string,
  data: ChapterUpdate,
) => {
  const chapterRef = doc(db, `users/${userId}/chapters/${chapterId}`);

  // Validate chapter update payload before updateDoc
  const validated = updateChapterSchema.parse({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  await updateDocOptimistic(chapterRef, validated);
};

// Delete a chapter
export const deleteChapter = async (userId: string, chapterId: string) => {
  const chapterRef = doc(db, `users/${userId}/chapters/${chapterId}`);
  await deleteDocOptimistic(chapterRef);
  await deleteJournalsInChapter(userId, chapterId);
};

export const deleteJournalsInChapter = async (
  userId: string,
  chapterId: string,
) => {
  const journalsRef = collection(
    db,
    `users/${userId}/chapters/${chapterId}/journals`,
  );
  const snapshot = await fetchDocsOptimistic(journalsRef);

  // Firestore batches are limited to 500 writes. We chunk deletions into batches of 400.
  const docs = snapshot.docs;
  const chunkSize = 400;
  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    chunk.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  }
};
