import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalState } from "./global-state";
import { moveJournal } from "../services/journals";
import { JOURNAL_QUERY_KEY } from "./useJournals";
import { useAuth } from "../context/AuthProvider";

const useOperations = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useGlobalState("selectedId", "");
  const [selectedParentId, setSelectedParentId] = useGlobalState(
    "selectedParentId",
    ""
  );

  const moveJournalMutation = useMutation({
    mutationFn: (newChapterId: string) =>
      moveJournal(userId!, selectedId, selectedParentId, newChapterId),
    onSuccess: (newChapterId) => {
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_QUERY_KEY, userId, newChapterId],
      });
      setSelectedId("");
      setSelectedParentId("");
    },
  });

  return {
    moveJournalMutation,
    selectedId,
    selectedParentId,
    setSelectedId,
    setSelectedParentId,
  };
};

export default useOperations;
