import {
  db,
  fetchDocsOptimistic,
  fetchDocOptimistic,
  setDocOptimistic,
  updateDocOptimistic,
  deleteDocOptimistic,
} from "./firebase/db";
import {
  Journal,
  JournalCreate,
  JournalUpdate,
  createJournalSchema,
  updateJournalSchema,
} from "@/types/journals";
import {
  collection,
  doc,
  runTransaction,
  query,
  limit,
  orderBy,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { DEFAULT_CHAPTER_ID } from "../constants";

// Get all journals for a chapter
export const getJournals = async (userId: string, chapterId: string) => {
  const journalsRef = collection(
    db,
    `users/${userId}/chapters/${chapterId}/journals`,
  );
  const snapshot = await fetchDocsOptimistic(journalsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Journal[];
};

// Get a single journal by ID
export const getJournalById = async (
  userId: string,
  chapterId: string,
  journalId: string,
): Promise<Journal | null> => {
  const docRef = doc(
    db,
    `users/${userId}/chapters/${chapterId}/journals/${journalId}`,
  );
  const snapshot = await fetchDocOptimistic(docRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Journal)
    : null;
};

// Add a new journal
export const addJournal = async (
  userId: string,
  chapterId: string,
  data: JournalCreate,
) => {
  await checkAndCreateNewChapter(userId, chapterId);

  const journalsRef = collection(
    db,
    `users/${userId}/chapters/${chapterId}/journals`,
  );
  const payload = {
    ...data,
    chapterId,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };

  // Validate the journal payload before setDoc
  const validated = createJournalSchema.parse(payload);
  const newDocRef = doc(journalsRef);
  await setDocOptimistic(newDocRef, validated);
  return { id: newDocRef.id, ...validated };
};

// Update an existing journal
export const updateJournal = async (
  userId: string,
  chapterId: string,
  journalId: string,
  data: JournalUpdate,
) => {
  const newChapterId = data.chapterId;
  if (newChapterId && newChapterId !== chapterId) {
    await moveJournal(userId, journalId, chapterId, newChapterId);
  }
  const editingChapterId = newChapterId || chapterId;

  const journalRef = doc(
    db,
    `users/${userId}/chapters/${editingChapterId}/journals/${journalId}`,
  );

  // Validate the journal update payload before updateDoc
  const validated = updateJournalSchema.parse({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  await updateDocOptimistic(journalRef, validated);
  return { id: journalId, ...validated };
};

export const moveJournal = async (
  userId: string,
  journalId: string,
  oldChapterId: string,
  newChapterId: string,
) => {
  if (newChapterId === oldChapterId) {
    return;
  }

  const oldRef = doc(
    db,
    `users/${userId}/chapters/${oldChapterId}/journals/${journalId}`,
  );
  const newRef = doc(
    db,
    `users/${userId}/chapters/${newChapterId}/journals/${journalId}`,
  );

  // Check and create the destination chapter first (outside the transaction)
  await checkAndCreateNewChapter(userId, newChapterId);

  // Perform the copy-delete atomically using a Firestore Transaction
  await runTransaction(db, async (transaction) => {
    const oldSnap = await transaction.get(oldRef);
    if (!oldSnap.exists()) {
      throw new Error("Journal not found");
    }

    const journalData = oldSnap.data();
    transaction.set(newRef, {
      ...journalData,
      chapterId: newChapterId,
      updatedAt: new Date().toISOString(),
    });
    transaction.delete(oldRef);
  });

  return newChapterId;
};

// Delete a journal
export const deleteJournal = async (
  userId: string,
  chapterId: string,
  journalId: string,
) => {
  const journalRef = doc(
    db,
    `users/${userId}/chapters/${chapterId}/journals/${journalId}`,
  );
  await deleteDocOptimistic(journalRef);
};

export async function checkAndCreateNewChapter(
  userId: string,
  newChapterId: string,
  description: string = "This chapter holds notes, thoughts, or entries that don't quite fit into any specific category or predefined chapter. It's a flexible space for miscellaneous ideas, spontaneous jottings, or anything you're unsure where to place—until you decide if it belongs elsewhere or deserves a chapter of its own.",
) {
  const chapterRef = doc(db, `users/${userId}/chapters/${newChapterId}`);
  const chapterSnapshot = await fetchDocOptimistic(chapterRef);

  if (!chapterSnapshot.exists()) {
    await setDocOptimistic(chapterRef, {
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

export interface PaginatedJournals {
  journals: Journal[];
  lastDoc: DocumentSnapshot | null;
}

export const getJournalsPaginated = async (
  userId: string,
  chapterId: string,
  options?: { limit?: number; startAfterDoc?: DocumentSnapshot | null },
): Promise<PaginatedJournals> => {
  const journalsRef = collection(
    db,
    `users/${userId}/chapters/${chapterId}/journals`,
  );

  const constraints = [];
  constraints.push(orderBy("createdAt", "desc"));

  if (options?.limit) {
    constraints.push(limit(options.limit));
  }

  if (options?.startAfterDoc) {
    constraints.push(startAfter(options.startAfterDoc));
  }

  const q = query(journalsRef, ...constraints);
  const snapshot = await fetchDocsOptimistic(q);

  return {
    journals: snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Journal[],
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
};
