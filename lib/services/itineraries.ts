import { db } from "@/lib/services/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ItineraryCreate,
  ItineraryUpdate,
  ItineraryDay,
  ItineraryTask,
} from "@/types/itineraries";

// **Collection Reference**
const getItineraryCollection = (userId: string) =>
  collection(db, `users/${userId}/itineraries`);

/** Fetch all itineraries */
export const getItineraries = async (userId: string) => {
  const snapshot = await getDocs(getItineraryCollection(userId));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as ItineraryCreate),
  }));
};

/** Fetch a single itinerary by ID */
export const getItineraryById = async (userId: string, itineraryId: string) => {
  const docRef = doc(db, `users/${userId}/itineraries/${itineraryId}`);
  const snapshot = await getDoc(docRef);
  return snapshot.exists()
    ? { id: snapshot.id, ...(snapshot.data() as ItineraryCreate) }
    : null;
};

/** Create a new itinerary */
export const addItinerary = async (userId: string, data: ItineraryCreate) => {
  const docRef = await addDoc(getItineraryCollection(userId), data);
  return { id: docRef.id, ...data };
};

/** Update an itinerary */
export const updateItinerary = async (
  userId: string,
  itineraryId: string,
  data: ItineraryUpdate
) => {
  const docRef = doc(db, `users/${userId}/itineraries/${itineraryId}`);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
};

/** Delete an itinerary */
export const deleteItinerary = async (userId: string, itineraryId: string) => {
  const docRef = doc(db, `users/${userId}/itineraries/${itineraryId}`);
  await deleteDoc(docRef);
};

/** Add a day to an itinerary */
export const addItineraryDay = async (
  userId: string,
  itineraryId: string,
  day: ItineraryDay
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
  data: Partial<ItineraryDay>
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = itinerary.days.map((day) =>
    day.id === dayId ? { ...day, ...data } : day
  );
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};

/** Delete a day from an itinerary */
export const deleteItineraryDay = async (
  userId: string,
  itineraryId: string,
  dayId: string
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
  task: ItineraryTask
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = itinerary.days.map((day) =>
    day.id === dayId ? { ...day, tasks: [...day.tasks, task] } : day
  );
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};

/** Update a task in a specific day */
export const updateItineraryTask = async (
  userId: string,
  itineraryId: string,
  dayId: string,
  taskId: string,
  data: Partial<ItineraryTask>
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = itinerary.days.map((day) =>
    day.id === dayId
      ? {
          ...day,
          tasks: day.tasks.map((task) =>
            task.id === taskId ? { ...task, ...data } : task
          ),
        }
      : day
  );
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};

/** Delete a task from a specific day */
export const deleteItineraryTask = async (
  userId: string,
  itineraryId: string,
  dayId: string,
  taskId: string
) => {
  const itinerary = await getItineraryById(userId, itineraryId);
  if (!itinerary) return;
  const updatedDays = itinerary.days.map((day) =>
    day.id === dayId
      ? { ...day, tasks: day.tasks.filter((task) => task.id !== taskId) }
      : day
  );
  await updateItinerary(userId, itineraryId, { days: updatedDays });
};
