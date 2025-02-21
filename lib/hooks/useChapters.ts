import { useQuery } from "@tanstack/react-query";
import { getChapters } from "@/lib/services/journals";
import { useUser } from "./useUser";
import { Chapter, Journal } from "@/types/journals";
const CHAPTER_QUERY_KEY = "Chapters";

export const useChapters = () => {
  const { user } = useUser();
  const userId = user?.uid;

  return useQuery<Chapter[]>({
    queryKey: [CHAPTER_QUERY_KEY, userId],
    queryFn: () => getChapters(userId!),
    enabled: !!userId,
  });
};
