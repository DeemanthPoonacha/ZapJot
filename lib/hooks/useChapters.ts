import { useQuery } from "@tanstack/react-query";
import { getChapters } from "@/lib/services/journals";
import { useUser } from "./useUser";
import { Chapter, Journal } from "@/types/journals";

export const useChapters = () => {
  const { user } = useUser();
  const userId = user?.uid;

  return useQuery<Chapter[]>({
    queryKey: ["Chapters", userId],
    queryFn: () => getChapters(userId!),
    enabled: !!userId,
  });
};
