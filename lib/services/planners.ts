import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Add a new task
export const addTask = async (
  userId: string,
  title: string,
  status: string
) => {
  return await addDoc(collection(db, `planners/${userId}/tasks`), {
    title,
    status,
    createdAt: new Date(),
  });
};

// Get all tasks
export const getTasks = async (userId: string) => {
  const snapshot = await getDocs(collection(db, `planners/${userId}/tasks`));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
