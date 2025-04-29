import { useChapters } from "@/lib/hooks/useChapters";
import { Link, useNProgressRouter } from "@/components/layout/link/CustomLink";
import ChapterCard from "./ChapterCard";
import Empty from "../Empty";
import { Grid2X2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const ChaptersList = ({ isMoving }: { isMoving?: boolean }) => {
  const { data: chapters, isLoading } = useChapters();
  const { routerPush } = useNProgressRouter();

  return (
    <div className={cn("space-y-4")}>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : !chapters?.length ? (
        <Empty
          icon={<Grid2X2 className="emptyIcon" />}
          handleCreateClick={() => routerPush("/chapters/new")}
          title="No chapters yet"
          subtitle="Add chapters to keep track of important people in your life"
          buttonTitle="Create First Chapter"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      )}
    </div>
  );
};

export default ChaptersList;
