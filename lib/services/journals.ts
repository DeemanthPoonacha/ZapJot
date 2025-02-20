import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Add a new journal
export const addJournal = async (
  userId: string,
  title: string,
  description: string
) => {
  return await addDoc(collection(db, "journals"), {
    userId,
    title,
    description,
    createdAt: new Date(),
  });
};

// Get all journals for a user
export const getJournals = async (userId: string) => {
  const q = query(collection(db, "journals"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
