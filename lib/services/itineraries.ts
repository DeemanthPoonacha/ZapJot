import {
  db,
  fetchDocsOptimistic,
  fetchDocOptimistic,
  setDocOptimistic,
  updateDocOptimistic,
  deleteDocOptimistic,
} from "./firebase/db";
import { collection, doc } from "firebase/firestore";
import {
  ItineraryCreate,
  ItineraryUpdate,
  ItineraryTask,
  ItineraryDayType,
  createItinerarySchema,
  updateItinerarySchema,
} from "@/types/itineraries";

// **Collection Reference**
const getItineraryCollection = (userId: string) =>
  collection(db, `users/${userId}/itineraries`);

/** Fetch all itineraries */
export const getItineraries = async (userId: string) => {
  const snapshot = await fetchDocsOptimistic(getItineraryCollection(userId));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as ItineraryCreate),
  }));
};

/** Fetch a single itinerary by ID */
export const getItineraryById = async (userId: string, itineraryId: string) => {
  const docRef = doc(db, `users/${userId}/itineraries/${itineraryId}`);
  const snapshot = await fetchDocOptimistic(docRef);
  return snapshot.exists()
    ? { id: snapshot.id, ...(snapshot.data() as ItineraryCreate) }
    : null;
};

/** Create a new itinerary */
export const addItinerary = async (userId: string, data: ItineraryCreate) => {
  const payload = {
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };

  // Validate itinerary payload before setDoc
  const validated = createItinerarySchema.parse(payload);
  const newDocRef = doc(getItineraryCollection(userId));
  await setDocOptimistic(newDocRef, validated);
  return { id: newDocRef.id, ...validated };
};

/** Update an itinerary */
export const updateItinerary = async (
  userId: string,
  itineraryId: string,
  data: ItineraryUpdate,
) => {
  const docRef = doc(db, `users/${userId}/itineraries/${itineraryId}`);
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // Validate itinerary update payload before updateDoc
  const validated = updateItinerarySchema.parse(payload);
  await updateDocOptimistic(docRef, validated);
};

export const updateItineraryCost = async (
  userId: string,
  itineraryId: string,
  cost: number,
) => {
  const docRef = doc(db, `users/${userId}/itineraries/${itineraryId}`);
  const payload = {
    actualCost: cost,
    updatedAt: new Date().toISOString(),
  };

  // Validate itinerary cost update payload before updateDoc
  const validated = updateItinerarySchema.parse(payload);
  await updateDocOptimistic(docRef, validated);
};

/** Delete an itinerary */
export const deleteItinerary = async (userId: string, itineraryId: string) => {
  const docRef = doc(db, `users/${userId}/itineraries/${itineraryId}`);
  await deleteDocOptimistic(docRef);
};

/** Add a day to an itinerary */
export const addItineraryDay = async (
  userId: string,
  itineraryId: string,
  day: ItineraryDayType,
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = [...itinerary.days, day];
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};

/** Update a day in an itinerary */
export const updateItineraryDay = async (
  userId: string,
  itineraryId: string,
  dayId: string,
  data: Partial<ItineraryDayType>,
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = itinerary.days.map((day) =>
    day.id === dayId ? { ...day, ...data } : day,
  );
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};

/** Delete a day from an itinerary */
export const deleteItineraryDay = async (
  userId: string,
  itineraryId: string,
  dayId: string,
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = itinerary.days.filter((day) => day.id !== dayId);
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};

/** Add a task to a specific day */
export const addItineraryTask = async (
  userId: string,
  itineraryId: string,
  dayId: string,
  task: ItineraryTask,
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = itinerary.days.map((day) =>
    day.id === dayId ? { ...day, tasks: [...day.tasks, task] } : day,
  );
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};

/** Update a task in a specific day */
export const updateItineraryTask = async (
  userId: string,
  itineraryId: string,
  dayId: string,
  taskId: string,
  data: Partial<ItineraryTask>,
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = itinerary.days.map((day) =>
    day.id === dayId
      ? {
          ...day,
          tasks: day.tasks.map((task) =>
            task.id === taskId ? { ...task, ...data } : task,
          ),
        }
      : day,
  );
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};

/** Delete a task from a specific day */
export const deleteItineraryTask = async (
  userId: string,
  itineraryId: string,
  dayId: string,
  taskId: string,
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = itinerary.days.map((day) =>
    day.id === dayId
      ? { ...day, tasks: day.tasks.filter((task) => task.id !== taskId) }
      : day,
  );
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};

export interface TodayItineraryTask {
  itineraryId: string;
  itineraryTitle: string;
  dayId: string;
  dayTitle: string;
  task: ItineraryTask;
}

/** Fetch all itinerary tasks scheduled for today across active itineraries */
export const getTodayItineraryTasks = async (
  userId: string
): Promise<TodayItineraryTask[]> => {
  const itineraries = await getItineraries(userId);
  if (!itineraries || itineraries.length === 0) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const results: TodayItineraryTask[] = [];
  console.log("itinerary", itineraries);

  for (const itinerary of itineraries) {
    if (!itinerary.startDate || !itinerary.endDate || !itinerary.days) continue;

    const start = new Date(itinerary.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(itinerary.endDate);
    end.setHours(23, 59, 59, 999);

    if (today >= start && today <= end) {
      // Calculate day index (0-based)
      const diffTime = today.getTime() - start.getTime();
      const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const dayObj = itinerary.days[dayIndex] || itinerary.days.find((d, idx) => idx === dayIndex);

      if (dayObj && dayObj.tasks) {
        for (const task of dayObj.tasks) {
          results.push({
            itineraryId: itinerary.id,
            itineraryTitle: itinerary.title,
            dayId: dayObj.id,
            dayTitle: dayObj.title,
            task,
          });
        }
      }
    }
  }

  return results;
};

/** Import / Duplicate a publicly shared itinerary into user's profile */
export const importPublicItinerary = async (
  userId: string,
  share: any
) => {
  if (share.type !== "itinerary") {
    throw new Error("Only itineraries can be imported to planner");
  }

  // Calculate default start date as today and end date based on totalDays
  const startDateObj = new Date();
  const totalDays = share.totalDays || share.days?.length || 1;
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(endDateObj.getDate() + (totalDays - 1));

  const startDateStr = startDateObj.toISOString().split("T")[0];
  const endDateStr = endDateObj.toISOString().split("T")[0];

  // Reset task completed state to false for all tasks in imported days
  const cleanDays = (share.days || []).map((day: any, idx: number) => ({
    id: `day_${Date.now()}_${idx}`,
    title: day.title || `Day ${idx + 1}`,
    budget: typeof day.budget === "number" ? day.budget : 0,
    tasks: (day.tasks || []).map((task: any, tIdx: number) => ({
      id: `task_${Date.now()}_${tIdx}`,
      title: task.title || "Activity",
      time: task.time || "",
      completed: false, // Reset completed status for importer!
    })),
  }));

  const itineraryData: ItineraryCreate = {
    title: `${share.title} (Imported)`,
    destination: share.destination || "",
    coverImage: share.coverImage || "",
    startDate: startDateStr,
    endDate: endDateStr,
    totalDays,
    budget: 0,
    actualCost: 0,
    days: cleanDays,
    notes: share.content || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return await addItinerary(userId, itineraryData);
};

