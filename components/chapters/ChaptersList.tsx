import { useChapters } from "@/lib/hooks/useChapters";
import Link from "next/link";
import { Chapter } from "@/types/chapters";
import ChapterCard from "./ChapterCard";

const ChaptersList = () => {
  const { data: chapters, isLoading } = useChapters();

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="grid grid-cols-2 sm:garid-cols-2 md:garid-cols-3 lg:garid-cols-4 gap-6">
      {chapters?.map((chapter) => (
        <Link href={`/chapters/${chapter.id}`} key={chapter.id}>
          <ChapterCard chapter={chapter} />
        </Link>
      ))}
    </div>
  );
};

export default ChaptersList;
