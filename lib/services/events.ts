import { db } from "@/lib/services/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { EventCreate, Event } from "@/types/events";

export const getEvents = async (userId: string) => {
  const eventsRef = collection(db, `users/${userId}/events`);
  const snapshot = await getDocs(eventsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Event[];
};

export const getEventById = async (userId: string, eventId: string) => {
  const eventRef = doc(db, `users/${userId}/events`, eventId);
  const snapshot = await getDoc(eventRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Event)
    : null;
};

export const addEvent = async (userId: string, data: EventCreate) => {
  const eventRef = doc(collection(db, `users/${userId}/events`));
  await setDoc(eventRef, { ...data, id: eventRef.id });
};

export const updateEvent = async (
  userId: string,
  eventId: string,
  data: EventCreate
) => {
  const eventRef = doc(db, `users/${userId}/events`, eventId);
  await updateDoc(eventRef, data);
};

export const deleteEvent = async (userId: string, eventId: string) => {
  const eventRef = doc(db, `users/${userId}/events`, eventId);
  await deleteDoc(eventRef);
};
