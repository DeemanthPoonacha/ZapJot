import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getItineraries,
  getItineraryById,
  addItinerary,
  updateItinerary,
  deleteItinerary,
} from "@/lib/services/itineraries";
import { useUser } from "@/lib/hooks/useUser";
import { Itinerary, ItineraryCreate } from "@/types/itineraries";

// Query Key
const ITINERARY_QUERY_KEY = "itineraries";

/** Fetch all itineraries for the logged-in user */
export const useItineraries = () => {
  const { user } = useUser();
  const userId = user?.uid;
  return useQuery({
    queryKey: [ITINERARY_QUERY_KEY, userId],
    queryFn: () => (userId ? getItineraries(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};

/** Fetch a single itinerary by ID */
export const useItinerary = (id?: string) => {
  const { user } = useUser();
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
  const { user } = useUser();
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

  return { addMutation, updateMutation, deleteMutation };
};
