import { useChapters } from "@/lib/hooks/useChapters";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChapterCard from "./ChapterCard";
import Empty from "../Empty";
import { Grid2X2 } from "lucide-react";

const ChaptersList = ({ isMoving }: { isMoving?: boolean }) => {
  const { data: chapters, isLoading } = useChapters();
  const router = useRouter();

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;

  if (!chapters?.length) {
    return (
      <Empty
        icon={<Grid2X2 className="emptyIcon" />}
        handleCreateClick={() => router.push("/chapters/new")}
        title="No chapters yet"
        subtitle="Add chapters to keep track of important people in your life"
        buttonTitle="Create First Character"
      />
    );
  }
  return (
    <div className="grid grid-cols-2 sm:garid-cols-2 md:garid-cols-3 lg:garid-cols-4 gap-6">
      {chapters?.map((chapter) => (
        <Link
          href={
            isMoving
              ? `/chapters/${chapter.id}?operation=move`
              : `/chapters/${chapter.id}`
          }
          key={chapter.id}
        >
          <ChapterCard chapter={chapter} />
        </Link>
      ))}
    </div>
  );
};

export default ChaptersList;
