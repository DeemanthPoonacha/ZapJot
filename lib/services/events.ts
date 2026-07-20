import { db } from "./firebase/db";
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
  writeBatch,
  orderBy,
  limit,
} from "firebase/firestore";
import { EventCreate, Event, EventsFilter, EventUpdate, createEventSchema, updateEventSchema } from "@/types/events";
import { addReminder, removeReminder } from "./characters";

export const getEvents = async (userId: string, filter?: EventsFilter) => {
  // Start with basic collection reference
  const eventsRef = collection(db, `users/${userId}/events`);
  const constraints = [];

  // Always add orderBy for nextOccurrence first since we're using it
  constraints.push(orderBy("nextOccurrence", "asc"));

  // Add upcoming filter (note: this might be redundant with dateRange.start if both are used)
  if (filter?.onlyUpcoming) {
    constraints.push(where("nextOccurrence", ">=", new Date()));
  }

  // Add other filters that don't conflict with orderBy
  if (filter?.participants) {
    constraints.push(
      where("participants", "array-contains-any", filter.participants)
    );
  }

  if (filter?.eventIds) {
    if (!filter.eventIds.length) return [];
    constraints.push(where("id", "in", filter.eventIds));
  }

  // Add limit last
  if (filter?.limit) {
    constraints.push(limit(filter.limit));
  }

  // Create the query with all constraints
  const q = query(eventsRef, ...constraints);

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (userId: string, eventId: string) => {
  const eventRef = doc(db, `users/${userId}/events`, eventId);
  const snapshot = await getDoc(eventRef);
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Event)
    : null;
};

export const addEvent = async (userId: string, data: EventCreate): Promise<Event> => {
  const eventRef = doc(collection(db, `users/${userId}/events`));
  
  if (data.participants && data.participants.length > 0) {
    await Promise.all(
      data.participants.map(async (participant: { value: string }) => {
        if (participant && eventRef.id) {
          await addReminder(userId, participant.value, eventRef.id);
        }
      })
    );
  }
  
  const newEvent: Event = {
    ...data,
    repeat: data.repeat || "none",
    repeatDays: data.repeatDays || [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    id: eventRef.id,
  } as Event;

  // Calculate nextOccurrence and nextNotificationAt if not already provided
  if (!newEvent.nextOccurrence) {
    const { updateEventOccurrence } = await import("@/lib/utils/events");
    updateEventOccurrence(newEvent);
  }

  // Validate the event data before setDoc
  const validated = createEventSchema.parse(newEvent);
  await setDoc(eventRef, validated);
  return newEvent;
};

// export const addMultipleTest = (userId: string) => {
//   for (let index = 0; index < 1000; index++) {
//     addEvent(userId, {
//       title: "test - once " + index,
//       date: dayjs().add(index, "day").format("YYYY-MM-DD"),
//       nextOccurrence: dayjs().add(index, "day").toDate(),
//       repeat: "none",
//       time: "01:20",
//       repeatDays: [],
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     });
//   }
// };
// export const deletMultipleTest = (userId: string, ids: string[]) => {
//   ids.map((id) => deleteEvent(userId, id));
// };

export const updateEvent = async (
  userId: string,
  eventId: string,
  data: EventUpdate
) => {
  const eventRef = doc(db, `users/${userId}/events`, eventId);
  const existingEvent = await getEventById(userId, eventId);

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  const existingParticipants = existingEvent.participants || [];
  const newParticipants = data.participants || [];

  const participantsToAdd = newParticipants.filter(
    (newParticipant) =>
      !existingParticipants.some(
        (existingParticipant) =>
          existingParticipant.value === newParticipant.value
      )
  );

  const participantsToRemove = existingParticipants.filter(
    (existingParticipant) =>
      !newParticipants.some(
        (newParticipant) => newParticipant.value === existingParticipant.value
      )
  );

  await Promise.all([
    ...participantsToAdd.map(async (participant: { value: string }) => {
      if (participant && eventRef.id) {
        await addReminder(userId, participant.value, eventRef.id);
      }
    }),
    ...participantsToRemove.map(async (participant: { value: string }) => {
      if (participant && eventRef.id) {
        await removeReminder(userId, participant.value, eventRef.id);
      }
    })
  ]);

  // Validate the update payload before write
  const validated = updateEventSchema.parse({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  await updateDoc(eventRef, validated);
  return { participants: [...participantsToAdd, ...participantsToRemove] };
};

export const deleteEvent = async (
  userId: string,
  eventId: string,
  participants?: string[]
) => {
  const eventRef = doc(db, `users/${userId}/events`, eventId);
  if (eventRef.id && participants && participants.length > 0) {
    await Promise.all(
      participants.map(async (participant) => {
        await removeReminder(userId, participant, eventRef.id);
      })
    );
  }
  await deleteDoc(eventRef);
};

export const updateOccurrences = async (
  userId: string,
  data: { id: string; nextOccurrence: Date; nextNotificationAt: Date }[]
) => {
  const batch = writeBatch(db);

  data?.forEach(({ id, nextOccurrence, nextNotificationAt }) => {
    const ref = doc(db, `users/${userId}/events/${id}`);
    batch.update(ref, { 
      nextOccurrence: nextOccurrence ?? null, 
      nextNotificationAt: nextNotificationAt ?? null 
    });
  });

  await batch.commit();
};
