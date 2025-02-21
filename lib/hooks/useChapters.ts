import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChapters,
  getChapterById,
  addChapter,
  updateChapter,
  deleteChapter,
} from "@/lib/services/journals";
import { useUser } from "@/lib/hooks/useUser";

export const CHAPTER_QUERY_KEY = "chapters";

/**
 * Fetch all chapters for the logged-in user
 */
export const useChapters = () => {
  const { user } = useUser();
  const userId = user?.uid;

  return useQuery({
    queryKey: [CHAPTER_QUERY_KEY, userId],
    queryFn: () => (userId ? getChapters(userId) : []),
    enabled: !!userId,
  });
};

/**
 * Fetch a single chapter by ID
 */
export const useChapter = (chapterId?: string) => {
  const { user } = useUser();
  const userId = user?.uid;

  return useQuery({
    queryKey: [CHAPTER_QUERY_KEY, userId, chapterId],
    queryFn: () =>
      userId && chapterId ? getChapterById(userId, chapterId) : null,
    enabled: !!userId && !!chapterId,
  });
};

/**
 * Mutations for adding, updating, and deleting chapters
 */
export const useChapterMutations = (onSuccess?: () => void) => {
  const { user } = useUser();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: any) => addChapter(userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries([CHAPTER_QUERY_KEY, userId] as any);
      onSuccess?.();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ chapterId, data }: { chapterId: string; data: any }) =>
      updateChapter(userId!, chapterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries([CHAPTER_QUERY_KEY, userId] as any);
      onSuccess?.();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (chapterId: string) => deleteChapter(userId!, chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries([CHAPTER_QUERY_KEY, userId] as any);
      onSuccess?.();
    },
  });

  return { addMutation, updateMutation, deleteMutation };
};
