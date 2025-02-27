import { db } from "@/lib/services/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
import { EventCreate, Event, EventsFilter } from "@/types/events";
import { addReminder, updateCharacter } from "./characters";

export const getEvents = async (userId: string, filter?: EventsFilter) => {
  let q = query(collection(db, `users/${userId}/events`));
  console.log("filter", filter);

  if (filter && filter.participants) {
    q = query(
      q,
      where("participants", "array-contains-any", filter.participants)
    );
  }

  if (filter && filter.eventIds) {
    q = query(q, where("id", "in", filter.eventIds));
  }

  const snapshot = await getDocs(q);
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
  data.participants?.map(async (participant: { value: string }) => {
    if (participant && eventRef.id) {
      await addReminder(userId, participant.value, eventRef.id);
    }
  });
  await setDoc(eventRef, { ...data, id: eventRef.id });
};

export const updateEvent = async (
  userId: string,
  eventId: string,
  data: EventCreate
) => {
  const eventRef = doc(db, `users/${userId}/events`, eventId);
  data.participants?.map(async (participant: { value: string }) => {
    if (participant && eventRef.id) {
      await addReminder(userId, participant.value, eventRef.id);
    }
  });
  await updateDoc(eventRef, data);
};

export const deleteEvent = async (userId: string, eventId: string) => {
  const eventRef = doc(db, `users/${userId}/events`, eventId);
  await deleteDoc(eventRef);
};
