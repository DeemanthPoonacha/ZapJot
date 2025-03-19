import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/services/events";
import { useAuth } from "@/lib/context/AuthProvider";

import { EventCreate, EventsFilter } from "@/types/events";
import { useCharacters } from "./useCharacters";

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
    mutationFn: (data: EventCreate) => addEvent(userId!, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY_KEY, userId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EventCreate }) =>
      updateEvent(userId!, id, data),
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
