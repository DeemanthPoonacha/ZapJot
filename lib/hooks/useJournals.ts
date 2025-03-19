import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJournals,
  getJournalById,
  addJournal,
  updateJournal,
  deleteJournal,
} from "@/lib/services/journals";
import { useAuth } from "@/lib/context/AuthProvider";

export const JOURNAL_QUERY_KEY = "journals";

export const useJournals = (chapterId?: string) => {
  const { user } = useAuth();
  const userId = user?.uid;

  return useQuery({
    queryKey: [JOURNAL_QUERY_KEY, userId, chapterId],
    queryFn: () => (userId && chapterId ? getJournals(userId, chapterId) : []),
    enabled: !!userId && !!chapterId,
  });
};

export const useJournal = (chapterId?: string, journalId?: string) => {
  const { user } = useAuth();
  const userId = user?.uid;

  return useQuery({
    queryKey: [JOURNAL_QUERY_KEY, userId, chapterId, journalId],
    queryFn: () =>
      userId && chapterId && journalId
        ? getJournalById(userId, chapterId, journalId)
        : null,
    enabled: !!userId && !!chapterId && !!journalId,
  });
};

export const useJournalMutations = (chapterId: string) => {
  const { user } = useAuth();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: any) => addJournal(userId!, chapterId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_QUERY_KEY, userId, chapterId],
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ journalId, data }: { journalId: string; data: any }) =>
      updateJournal(userId!, chapterId, journalId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_QUERY_KEY, userId, chapterId],
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (journalId: string) =>
      deleteJournal(userId!, chapterId, journalId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_QUERY_KEY, userId, chapterId],
      }),
  });

  return { addMutation, updateMutation, deleteMutation };
};
