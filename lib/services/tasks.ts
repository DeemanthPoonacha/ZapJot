import {
  db,
  fetchDocsOptimistic,
  fetchDocOptimistic,
  setDocOptimistic,
  updateDocOptimistic,
  deleteDocOptimistic,
} from "./firebase/db";
import {
  Task,
  TaskCreate,
  TaskFilter,
  createTaskSchema,
  updateTaskSchema,
} from "@/types/tasks";
import {
  collection,
  doc,
  query,
  limit,
  where,
  orderBy,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";

// Helper utility to remove undefined properties from Firestore payloads
const sanitizeFirestorePayload = <T extends Record<string, any>>(
  obj: T,
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as Partial<T>;
};

const getTasks = async (
  userId: string,
  filter?: TaskFilter,
): Promise<Task[]> => {
  const tasksRef = collection(db, `users/${userId}/tasks`);
  const constraints = [];

  constraints.push(orderBy("highPriority", "desc"));

  if (filter?.status) {
    constraints.push(where("status", "==", filter.status));
  }

  if (filter?.limit) {
    constraints.push(limit(filter.limit));
  }

  const q = query(tasksRef, ...constraints);

  try {
    const snapshot = await fetchDocsOptimistic(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Task,
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

const getTaskById = async (
  userId: string,
  taskId: string,
): Promise<Task | null> => {
  const taskRef = doc(db, `users/${userId}/tasks`, taskId);
  const snapshot = await fetchDocOptimistic(taskRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Task)
    : null;
};

const addTask = async (userId: string, taskData: TaskCreate) => {
  const tasksCollection = collection(db, `users/${userId}/tasks`);
  const finalizedTask = {
    ...taskData,
    status: taskData.status || "pending",
    highPriority:
      taskData.highPriority !== undefined ? taskData.highPriority : false,
    subtasks: taskData.subtasks || [],
    createdAt: taskData.createdAt || new Date().toISOString(),
    updatedAt: taskData.updatedAt || new Date().toISOString(),
  };

  // Validate and sanitize payload before Firestore write
  const validated = createTaskSchema.parse(finalizedTask);
  const sanitized = sanitizeFirestorePayload(validated);

  const newDocRef = doc(tasksCollection);
  await setDocOptimistic(newDocRef, sanitized);
  return { id: newDocRef.id, ...sanitized } as Task;
};

const updateTask = async (
  userId: string,
  taskId: string,
  taskData: Partial<TaskCreate>,
): Promise<void> => {
  const taskRef = doc(db, `users/${userId}/tasks`, taskId);

  // Validate update payload
  const validated = updateTaskSchema.parse({
    ...taskData,
    updatedAt: new Date().toISOString(),
  });
  const sanitized = sanitizeFirestorePayload(validated);

  await updateDocOptimistic(taskRef, sanitized);
};

const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  const taskRef = doc(db, `users/${userId}/tasks`, taskId);
  await deleteDocOptimistic(taskRef);
};

export interface PaginatedTasks {
  tasks: Task[];
  lastDoc: DocumentSnapshot | null;
}

const getTasksPaginated = async (
  userId: string,
  filter?: TaskFilter & { startAfterDoc?: DocumentSnapshot | null },
): Promise<PaginatedTasks> => {
  const tasksRef = collection(db, `users/${userId}/tasks`);
  const constraints = [];

  constraints.push(orderBy("highPriority", "desc"));

  if (filter?.status) {
    constraints.push(where("status", "==", filter.status));
  }

  if (filter?.limit) {
    constraints.push(limit(filter.limit));
  }

  if (filter?.startAfterDoc) {
    constraints.push(startAfter(filter.startAfterDoc));
  }

  const q = query(tasksRef, ...constraints);

  try {
    const snapshot = await fetchDocsOptimistic(q);
    return {
      tasks: snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Task,
      ),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  } catch (error) {
    console.error("Error fetching paginated tasks:", error);
    throw error;
  }
};

export {
  getTasks,
  getTasksPaginated,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
};
