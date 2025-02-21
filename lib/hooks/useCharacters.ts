import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCharacters, getCharacterById } from "@/lib/services/characters";
import { useUser } from "@/lib/hooks/useUser";

// Query Keys
const CHARACTER_QUERY_KEY = "characters";

/**
 * Fetch all characters for the logged-in user
 */
export const useCharacters = () => {
  const { user } = useUser();
  const userId = user?.uid;
  return useQuery({
    queryKey: [CHARACTER_QUERY_KEY, userId],
    queryFn: () => (userId ? getCharacters(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
};

/**
 * Fetch a single character by ID
 */
export const useCharacter = (id?: string) => {
  return useQuery({
    queryKey: [CHARACTER_QUERY_KEY, id],
    queryFn: () => (id ? getCharacterById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};
