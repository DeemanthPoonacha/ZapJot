import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getItineraries,
  getItineraryById,
  addItinerary,
  updateItinerary,
  deleteItinerary,
  updateItineraryTask,
  updateItineraryDay,
  deleteItineraryDay,
  updateItineraryCost,
} from "@/lib/services/itineraries";
import { useAuth } from "@/lib/context/AuthProvider";

import { Itinerary, ItineraryCreate } from "@/types/itineraries";

// Query Key
const ITINERARY_QUERY_KEY = "itineraries";

/** Fetch all itineraries for the logged-in user */
export const useItineraries = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useQuery({
    queryKey: [ITINERARY_QUERY_KEY, userId],
    queryFn: () => (userId ? getItineraries(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};

/** Fetch a single itinerary by ID */
export const useItinerary = (id?: string) => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useQuery({
    queryKey: [ITINERARY_QUERY_KEY, id],
    queryFn: () =>
      userId && id ? getItineraryById(userId, id) : Promise.resolve(null),
    enabled: !!id,
  });
};

/** Mutations */
export const useItineraryMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.uid;

  const addMutation = useMutation({
    mutationFn: (data: ItineraryCreate) => addItinerary(userId!, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [ITINERARY_QUERY_KEY, userId],
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Itinerary> }) =>
      updateItinerary(userId!, id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [ITINERARY_QUERY_KEY, userId],
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItinerary(userId!, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [ITINERARY_QUERY_KEY, userId],
      }),
  });

  const updateDayMutation = useMutation({
    mutationFn: ({
      id,
      dayId,
      data,
    }: {
      id: string;
      dayId: string;
      data: Partial<Itinerary>;
    }) => updateItineraryDay(userId!, id, dayId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [ITINERARY_QUERY_KEY, userId],
      }),
  });

  const deleteDayMutation = useMutation({
    mutationFn: ({ id, dayId }: { id: string; dayId: string }) =>
      deleteItineraryDay(userId!, id, dayId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [ITINERARY_QUERY_KEY, userId],
      }),
  });

  const editTaskMutation = useMutation({
    mutationFn: ({
      id,
      dayId,
      taskId,
      data,
    }: {
      id: string;
      dayId: string;
      taskId: string;
      data: Partial<Itinerary>;
    }) => updateItineraryTask(userId!, id, dayId, taskId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [ITINERARY_QUERY_KEY, userId],
      }),
  });

  const updateCostMutation = useMutation({
    mutationFn: ({ id, cost }: { id: string; cost: number }) =>
      updateItineraryCost(userId!, id, cost),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [ITINERARY_QUERY_KEY, userId],
      }),
  });

  return {
    addMutation,
    updateMutation,
    deleteMutation,
    updateDayMutation,
    deleteDayMutation,
    editTaskMutation,
    updateCostMutation,
  };
};
