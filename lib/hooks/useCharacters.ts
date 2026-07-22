import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCharacters,
  getCharacterById,
  addCharacter,
  updateCharacter,
  deleteCharacter,
} from "@/lib/services/characters";
import { useAuth } from "@/lib/context/AuthProvider";

import { CharacterCreate, CharacterUpdate } from "@/types/characters";

// Query Key
export const CHARACTER_QUERY_KEY = "characters";

/** Fetch all characters for the logged-in user */
export const useCharacters = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useQuery({
    queryKey: [CHARACTER_QUERY_KEY, userId],
    queryFn: () => (userId ? getCharacters(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};

/** Fetch a single character by ID */
export const useCharacter = (id?: string) => {
  const { user } = useAuth();
  const userId = user?.uid;
  return useQuery({
    queryKey: [CHARACTER_QUERY_KEY, userId, id],
    queryFn: () =>
      userId && id ? getCharacterById(userId, id) : Promise.resolve(null),
    enabled: !!id,
  });
};

/** Mutations */
export const useCharacterMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.uid;

  const addMutation = useMutation({
    mutationFn: (data: CharacterCreate) => addCharacter(userId!, data),
    onSuccess: (newChar) => {
      queryClient.setQueriesData(
        { queryKey: [CHARACTER_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return [...oldData, newChar];
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({
        queryKey: [CHARACTER_QUERY_KEY, userId],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CharacterUpdate }) =>
      updateCharacter(userId!, id, data),
    onSuccess: (_data, { id, data }) => {
      queryClient.setQueriesData(
        { queryKey: [CHARACTER_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.map((char: any) =>
              char.id === id ? { ...char, ...data } : char
            );
          }
          if (typeof oldData === "object" && oldData.id === id) {
            return { ...oldData, ...data };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({
        queryKey: [CHARACTER_QUERY_KEY, userId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCharacter(userId!, id),
    onSuccess: (_data, id) => {
      queryClient.setQueriesData(
        { queryKey: [CHARACTER_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.filter((char: any) => char.id !== id);
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({
        queryKey: [CHARACTER_QUERY_KEY, userId],
      });
    },
  });

  return { addMutation, updateMutation, deleteMutation };
};
