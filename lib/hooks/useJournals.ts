import { useQuery } from "@tanstack/react-query";
import { getJournals } from "@/lib/services/journals";

export const useJournals = (userId: string) => {
  return useQuery({
    queryKey: ["journals", userId],
    queryFn: () => getJournals(userId),
    enabled: !!userId,
  });
};
