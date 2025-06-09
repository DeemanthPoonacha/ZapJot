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
import { EventCreate, Event, EventsFilter, EventUpdate } from "@/types/events";
import { addReminder, removeReminder } from "./characters";

export const getEvents = async (userId: string, filter?: EventsFilter) => {
  console.log("🚀 ~ getEvents ~ filter:", filter);

  // Start with basic collection reference
  const eventsRef = collection(db, `users/${userId}/events`);
  const constraints = [];

  // Always add orderBy for nextOccurrence first since we're using it
  constraints.push(orderBy("nextOccurrence", "asc"));

  // // Add date range filters
  // if (filter?.dateRange) {
  //   if (filter.dateRange.start) {
  //     constraints.push(
  //       where(
  //         "nextOccurrence",
  //         ">=",
  //         Timestamp.fromDate(filter.dateRange.start)
  //       )
  //     );
  //   }
  //   if (filter.dateRange.end) {
  //     constraints.push(
  //       where("nextOccurrence", "<", Timestamp.fromDate(filter.dateRange.end))
  //     );
  //   }
  // }

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

export const addEvent = async (userId: string, data: EventCreate) => {
  const eventRef = doc(collection(db, `users/${userId}/events`));
  data.participants?.map(async (participant: { value: string }) => {
    if (participant && eventRef.id) {
      await addReminder(userId, participant.value, eventRef.id);
    }
  });
  await setDoc(eventRef, { ...data, id: eventRef.id });
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

  participantsToAdd.map(async (participant: { value: string }) => {
    if (participant && eventRef.id) {
      await addReminder(userId, participant.value, eventRef.id);
    }
  });

  participantsToRemove.map(async (participant: { value: string }) => {
    if (participant && eventRef.id) {
      await removeReminder(userId, participant.value, eventRef.id);
    }
  });

  await updateDoc(eventRef, data);
};

export const deleteEvent = async (
  userId: string,
  eventId: string,
  participants?: string[]
) => {
  const eventRef = doc(db, `users/${userId}/events`, eventId);
  if (eventRef.id)
    participants?.map(async (participant) => {
      await removeReminder(userId, participant, eventRef.id);
    });
  await deleteDoc(eventRef);
};

export const updateOccurrences = async (
  userId: string,
  data: { id: string; nextOccurrence: Date; nextNotificationAt: Date }[]
) => {
  const batch = writeBatch(db);

  data?.forEach(({ id, nextOccurrence, nextNotificationAt }) => {
    const ref = doc(db, `users/${userId}/events/${id}`);
    batch.update(ref, { nextOccurrence, nextNotificationAt });
  });

  await batch.commit();
};
