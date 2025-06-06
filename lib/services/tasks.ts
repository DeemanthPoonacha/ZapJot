import { db } from "./firebase/db";
import { Task, TaskCreate, TaskFilter } from "@/types/tasks";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  where,
  orderBy,
} from "firebase/firestore";

const getTasks = async (
  userId: string,
  filter?: TaskFilter
): Promise<Task[]> => {
  const tasksRef = collection(db, `users/${userId}/tasks`);
  const constraints = [];

  console.log("filter", filter);

  constraints.push(orderBy("highPriority", "desc"));

  if (filter?.status) {
    constraints.push(where("status", "==", filter.status));
  }

  if (filter?.limit) {
    constraints.push(limit(filter.limit));
  }

  const q = query(tasksRef, ...constraints);

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Task)
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
const getTaskById = async (
  userId: string,
  taskId: string
): Promise<Task | null> => {
  const taskRef = doc(db, `users/${userId}/tasks`, taskId);
  const snapshot = await getDoc(taskRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Task)
    : null;
};

const addTask = async (userId: string, taskData: TaskCreate): Promise<void> => {
  const tasksCollection = collection(db, `users/${userId}/tasks`);
  await addDoc(tasksCollection, taskData);
};

const updateTask = async (
  userId: string,
  taskId: string,
  taskData: Partial<TaskCreate>
): Promise<void> => {
  const taskRef = doc(db, `users/${userId}/tasks`, taskId);
  await updateDoc(taskRef, taskData);
};

const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  const taskRef = doc(db, `users/${userId}/tasks`, taskId);
  await deleteDoc(taskRef);
};

export { getTasks, getTaskById, addTask, updateTask, deleteTask };
