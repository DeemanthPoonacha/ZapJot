import { db } from "@/lib/services/firebase";
import { Task, TaskCreate } from "@/types/tasks";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const getTasks = async (userId: string): Promise<Task[]> => {
  const tasksCollection = collection(db, `users/${userId}/tasks`);
  const snapshot = await getDocs(tasksCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
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
