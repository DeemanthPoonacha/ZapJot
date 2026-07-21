import { useInfiniteJournals } from "@/lib/hooks/useJournals";
import { useNProgressRouter } from "../layout/link/CustomLink";
import { GridCardWithOverlay } from "@/components/ui/GridCardWithOverlay";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Empty from "../Empty";
import { BookOpenText } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const JournalsList = ({
  chapterId,
  className,
}: {
  chapterId: string;
  className?: string;
}) => {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useInfiniteJournals(chapterId, 10);
  const { routerPush } = useNProgressRouter();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const journals = data?.pages.flatMap((page) => page.journals) || [];

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-xl font-bold">Journals</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : !journals.length ? (
        <Empty
          icon={<BookOpenText className="emptyIcon" />}
          title="No journals yet"
          subtitle="Add journals to keep track of important events and memories"
          buttonTitle="Create First Journal"
          handleCreateClick={() => {
            routerPush(`/chapters/${chapterId}/journals/new`);
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {journals.map(({ id, title, coverImage, location, date }) => (
              <GridCardWithOverlay
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() =>
                  routerPush(`/chapters/${chapterId}/journals/${id}`)
                }
                key={id}
                title={title}
                date={date}
                image={coverImage}
                location={location}
              />
            ))}
          </div>

          {/* Infinite Scroll loading marker */}
          {hasNextPage && (
            <div ref={ref} className="flex justify-center py-6">
              {isFetchingNextPage ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <span className="text-xs text-muted-foreground">Load more</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JournalsList;
