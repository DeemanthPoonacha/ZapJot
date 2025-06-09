import { db } from "./firebase/db";
import { Goal, GoalCreate, GoalUpdate } from "@/types/goals";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";

/** Get all goals for a specific user */
export const getGoals = async (userId: string): Promise<Goal[]> => {
  const goalsRef = collection(db, `users/${userId}/goals`);
  const q = query(goalsRef);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Goal));
};

/** Get a single goal by ID */
export const getGoalById = async (
  userId: string,
  goalId: string
): Promise<Goal | null> => {
  const docRef = doc(db, `users/${userId}/goals`, goalId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Goal)
    : null;
};

/** Add a new goal */
export const addGoal = async (userId: string, data: GoalCreate) => {
  const newDocRef = doc(collection(db, `users/${userId}/goals`));
  await setDoc(newDocRef, {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

/** Update an existing goal */
export const updateGoal = async (
  userId: string,
  goalId: string,
  data: GoalUpdate
) => {
  const docRef = doc(db, `users/${userId}/goals`, goalId);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
};

/** Delete a goal */
export const deleteGoal = async (userId: string, goalId: string) => {
  const docRef = doc(db, `users/${userId}/goals`, goalId);
  await deleteDoc(docRef);
};
