import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJournals,
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
    onSuccess: (data) =>
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_QUERY_KEY, userId, data.chapterId || chapterId],
      }),
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
    onSuccess: (data) =>
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_QUERY_KEY, userId, data.chapterId || chapterId],
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
