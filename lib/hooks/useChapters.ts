import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChapters,
  getChapterById,
  addChapter,
  updateChapter,
  deleteChapter,
} from "@/lib/services/chapters";
import { useAuth } from "@/lib/context/AuthProvider";
import { ChapterCreate, ChapterUpdate } from "@/types/chapters";

export const CHAPTER_QUERY_KEY = "chapters";

/**
 * Fetch all chapters for the logged-in user
 */
export const useChapters = () => {
  const { user } = useAuth();
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
  const { user } = useAuth();
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
export const useChapterMutations = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: ChapterCreate) => addChapter(userId!, data),
    onSuccess: (newChapter) => {
      queryClient.setQueriesData(
        { queryKey: [CHAPTER_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return [...oldData, newChapter];
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({ queryKey: [CHAPTER_QUERY_KEY, userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      chapterId,
      data,
    }: {
      chapterId: string;
      data: ChapterUpdate;
    }) => updateChapter(userId!, chapterId, data),
    onSuccess: (_data, { chapterId, data }) => {
      queryClient.setQueriesData(
        { queryKey: [CHAPTER_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.map((chapter: any) =>
              chapter.id === chapterId ? { ...chapter, ...data } : chapter
            );
          }
          if (typeof oldData === "object" && oldData.id === chapterId) {
            return { ...oldData, ...data };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({ queryKey: [CHAPTER_QUERY_KEY, userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (chapterId: string) => deleteChapter(userId!, chapterId),
    onSuccess: (_data, chapterId) => {
      queryClient.setQueriesData(
        { queryKey: [CHAPTER_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.filter((chapter: any) => chapter.id !== chapterId);
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({ queryKey: [CHAPTER_QUERY_KEY, userId] });
    },
  });

  return { addMutation, updateMutation, deleteMutation };
};
