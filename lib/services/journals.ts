import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/services/firebase";
import {
  Journal,
  Chapter,
  createJournalSchema,
  updateJournalSchema,
  createChapterSchema,
  updateChapterSchema,
  JournalCreate,
} from "@/types/journals";

// Add a new chapter
export const addChapter = async (
  userId: string,
  title: string,
  journals?: JournalCreate[]
) => {
  const chapterData = createChapterSchema.parse({
    userId,
    title,
    journals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log("🚀 ~ addChapter ~ chapterData:", chapterData);

  const docRef = await addDoc(collection(db, "chapters"), chapterData);
  return { id: docRef.id, ...chapterData };
};

// Get all chapters for a user
export const getChapters = async (userId: string): Promise<Chapter[]> => {
  const q = query(collection(db, "chapters"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  console.log("🚀 ~ getChapters ~ querySnapshot:", querySnapshot.docs);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chapter[];
};

// Update a chapter
export const updateChapter = async (
  chapterId: string,
  updatedData: Partial<Chapter>
) => {
  const validData = updateChapterSchema.parse({
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });

  const chapterRef = doc(db, "chapters", chapterId);
  await updateDoc(chapterRef, validData);
};

// Delete a chapter and its journals
export const deleteChapter = async (chapterId: string) => {
  const chapterRef = doc(db, "chapters", chapterId);
  await deleteDoc(chapterRef);
};
// Add a new journal inside a chapter
export const addJournal = async (
  userId: string,
  chapterId: string,
  title?: string,
  description?: string
) => {
  const formattedTitle =
    title ||
    new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const journalData = createJournalSchema.parse({
    chapterId,
    title: formattedTitle,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Add journal to the chapter
  const journalRef = await addDoc(
    collection(db, "chapters", chapterId, "journals"),
    journalData
  );

  return { chapterId, journalId: journalRef.id };
};
// Get all journals for a given chapter
export const getJournals = async (chapterId: string): Promise<Journal[]> => {
  const q = query(collection(db, "chapters", chapterId, "journals"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Journal[];
};

// Update a journal inside a chapter
export const updateJournal = async (
  chapterId: string,
  journalId: string,
  updatedData: Partial<Journal>
) => {
  const validData = updateJournalSchema.parse({
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });

  const journalRef = doc(db, "chapters", chapterId, "journals", journalId);
  await updateDoc(journalRef, validData);
};

// Delete a journal from a chapter
export const deleteJournal = async (chapterId: string, journalId: string) => {
  const journalRef = doc(db, "chapters", chapterId, "journals", journalId);
  await deleteDoc(journalRef);
};

const addOthersChapter = async (userId: string) => {
  // Define chapter ID
  const chapterId = `${userId}_others`;

  // Reference the document directly
  const chapterRef = doc(db, "chapters", chapterId);
  const chapterSnap = await getDoc(chapterRef);

  if (!chapterSnap.exists()) {
    // Create the "Others" chapter if it doesn't exist
    const newChapter = createChapterSchema.parse({
      userId,
      title: "Others",
    });

    await setDoc(chapterRef, newChapter); // ✅ Use setDoc to create the document
    console.log("Created 'Others' chapter:", chapterId);
  } else {
    console.log("'Others' chapter already exists.");
  }
};

addOthersChapter("testUser123");
