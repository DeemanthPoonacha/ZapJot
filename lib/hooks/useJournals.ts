import { useQuery } from "@tanstack/react-query";
import { getJournals } from "@/lib/services/journals";
import { useUser } from "./useUser";
import { Journal } from "@/types/journals";

export const useJournals = () => {
  const { user } = useUser();
  const userId = user?.uid;

  return useQuery<Journal[]>({
    queryKey: ["journals", userId],
    queryFn: () => getJournals(userId!),
    enabled: !!userId,
  });
};
