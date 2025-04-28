import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent,
  updateOccurrences,
} from "@/lib/services/events";
import { useAuth } from "@/lib/context/AuthProvider";

import { Event, EventCreate, EventsFilter, EventUpdate } from "@/types/events";
import { useCharacters } from "./useCharacters";
import { updateEventOccurrence } from "../utils";

const EVENT_QUERY_KEY = "events";

export const useEvents = (query?: EventsFilter) => {
  const { user } = useAuth();
  const userId = user?.uid;

  const { data: characters } = useCharacters();

  const eventsQuery = useQuery({
    queryKey: [EVENT_QUERY_KEY, userId, query],
    queryFn: () => (userId ? getEvents(userId, query) : Promise.resolve([])),
    enabled: !!userId,
  });

  const eventsWithParticipants = eventsQuery.data?.map((event) => ({
    ...event,
    participants: event.participants?.map((participant) => {
      const character = characters?.find(
        (char) => char.id === participant.value
      );
      return character
        ? { ...participant, label: character.name }
        : participant;
    }),
  }));

  return {
    ...eventsQuery,
    data: eventsWithParticipants,
  };
};

export const useEvent = (id?: string) => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useQuery({
    queryKey: [EVENT_QUERY_KEY, id],
    queryFn: () =>
      userId && id ? getEventById(userId, id) : Promise.resolve(null),
    enabled: !!id,
  });
};

export const useEventMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.uid;

  const addMutation = useMutation({
    mutationFn: (data: EventCreate) => {
      updateEventOccurrence(data);
      return addEvent(userId!, data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY_KEY, userId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EventUpdate }) => {
      updateEventOccurrence(data);
      return updateEvent(userId!, id, data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY_KEY, userId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: ({
      id,
      participants,
    }: {
      id: string;
      participants?: string[];
    }) => deleteEvent(userId!, id, participants),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY_KEY, userId] }),
  });

  return { addMutation, updateMutation, deleteMutation };
};

export const useEventsOccurrenceMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.uid;

  const updateMutation = useMutation({
    mutationFn: (data: Event[]) => {
      data?.map((event) => {
        updateEventOccurrence(event);
        return {
          id: event.id,
          nextOccurrence: event.nextOccurrence,
          nextNotificationAt: event.nextNotificationAt,
        };
      });
      return updateOccurrences(
        userId!,
        data as {
          id: string;
          nextOccurrence: Date;
          nextNotificationAt: Date;
        }[]
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY_KEY] }),
  });

  return { updateMutation };
};
