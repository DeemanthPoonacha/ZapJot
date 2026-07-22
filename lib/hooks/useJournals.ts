import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  getJournals,
  getJournalsPaginated,
  getJournalById,
  addJournal,
  updateJournal,
  deleteJournal,
} from "@/lib/services/journals";
import { useAuth } from "@/lib/context/AuthProvider";
import { JournalCreate, JournalUpdate } from "@/types/journals";
import { decryptContent, encryptContent } from "../utils/encryption";
import { useDecryptedUserKey } from "./useDecryptedUserKey";

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

export const useInfiniteJournals = (chapterId?: string, pageSize: number = 25) => {
  const { user } = useAuth();
  const userId = user?.uid;

  return useInfiniteQuery({
    queryKey: [JOURNAL_QUERY_KEY, userId, chapterId, "infinite", pageSize],
    queryFn: ({ pageParam }) =>
      userId && chapterId
        ? getJournalsPaginated(userId, chapterId, {
            limit: pageSize,
            startAfterDoc: pageParam as any,
          })
        : Promise.resolve({ journals: [], lastDoc: null }),
    initialPageParam: null as any,
    getNextPageParam: (lastPage) => lastPage.lastDoc,
    enabled: !!userId && !!chapterId,
  });
};

export const useJournal = (chapterId?: string, journalId?: string) => {
  const { user } = useAuth();
  const userId = user?.uid;
  const { key } = useDecryptedUserKey();

  return useQuery({
    queryKey: [JOURNAL_QUERY_KEY, userId, chapterId, journalId],
    queryFn: async () => {
      if (!userId || !chapterId || !journalId) return null;
      const journal = await getJournalById(userId, chapterId, journalId);
      if (journal && key) {
        await decryptData(journal, key);
      }
      return journal;
    },
    enabled: !!userId && !!chapterId && !!journalId && !!key,
  });
};

export const useJournalMutations = (chapterId: string) => {
  const { user } = useAuth();
  const userId = user?.uid;
  const queryClient = useQueryClient();
  const { key } = useDecryptedUserKey();

  const addMutation = useMutation({
    mutationFn: async (data: JournalCreate) => {
      await encryptData(data, key!);
      return addJournal(userId!, data.chapterId || chapterId, data);
    },
    onSuccess: (newJournal) => {
      queryClient.setQueriesData(
        { queryKey: [JOURNAL_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return [newJournal, ...oldData];
          }
          if (typeof oldData === "object" && "pages" in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any, index: number) =>
                index === 0
                  ? { ...page, journals: [newJournal, ...(page.journals || [])] }
                  : page
              ),
            };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_QUERY_KEY, userId, newJournal.chapterId || chapterId],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      journalId,
      data,
    }: {
      journalId: string;
      data: JournalUpdate;
    }) => {
      console.log("🚀 ~ useJournalMutations ~ data:", data);
      await encryptData(data, key!);
      return updateJournal(userId!, chapterId, journalId, data);
    },
    onSuccess: (updatedJournal, variables) => {
      queryClient.setQueriesData(
        { queryKey: [JOURNAL_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.map((journal: any) =>
              journal.id === variables.journalId ? { ...journal, ...updatedJournal } : journal
            );
          }
          if (typeof oldData === "object" && "pages" in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                journals: page.journals?.map((journal: any) =>
                  journal.id === variables.journalId ? { ...journal, ...updatedJournal } : journal
                ),
              })),
            };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_QUERY_KEY, userId, updatedJournal.chapterId || chapterId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (journalId: string) =>
      deleteJournal(userId!, chapterId, journalId),
    onSuccess: (_data, journalId) => {
      queryClient.setQueriesData(
        { queryKey: [JOURNAL_QUERY_KEY, userId] },
        (oldData: any) => {
          if (!oldData) return oldData;
          if (Array.isArray(oldData)) {
            return oldData.filter((journal: any) => journal.id !== journalId);
          }
          if (typeof oldData === "object" && "pages" in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                journals: page.journals?.filter((journal: any) => journal.id !== journalId),
              })),
            };
          }
          return oldData;
        }
      );
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_QUERY_KEY, userId, chapterId],
      });
    },
  });

  return { addMutation, updateMutation, deleteMutation };
};

const encryptData = async (data: JournalUpdate, key: CryptoKey) => {
  if (!key || !data.content) {
    console.log("Skipping encryption!");
    return;
  }
  const { encrypted, iv } = await encryptContent(data.content, key);
  data.content = encrypted;
  data.iv = iv;
};

const decryptData = async (data: JournalUpdate, key: CryptoKey) => {
  if (!key || !data.iv || !data.content) {
    console.log("Skipping decryption!");
    return;
  }
  data.content = await decryptContent(data.content, data.iv, key);
};
