import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCharacters,
  getCharacterById,
  addCharacter,
  updateCharacter,
  deleteCharacter,
} from "@/lib/services/characters";
import { useUser } from "@/lib/hooks/useUser";
import { Character, CharacterCreate } from "@/types/characters";

// Query Key
const CHARACTER_QUERY_KEY = "characters";

/** Fetch all characters for the logged-in user */
export const useCharacters = () => {
  const { user } = useUser();
  const userId = user?.uid;
  return useQuery({
    queryKey: [CHARACTER_QUERY_KEY, userId],
    queryFn: () => (userId ? getCharacters(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};

/** Fetch a single character by ID */
export const useCharacter = (id?: string) => {
  const { user } = useUser();
  const userId = user?.uid;
  return useQuery({
    queryKey: [CHARACTER_QUERY_KEY, id],
    queryFn: () =>
      userId && id ? getCharacterById(userId, id) : Promise.resolve(null),
    enabled: !!id,
  });
};

/** Mutations */
export const useCharacterMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.uid;

  const addMutation = useMutation({
    mutationFn: (data: CharacterCreate) => addCharacter(userId!, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [CHARACTER_QUERY_KEY, userId],
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CharacterCreate }) =>
      updateCharacter(userId!, id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [CHARACTER_QUERY_KEY, userId],
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCharacter(userId!, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [CHARACTER_QUERY_KEY, userId],
      }),
  });

  return { addMutation, updateMutation, deleteMutation };
};
