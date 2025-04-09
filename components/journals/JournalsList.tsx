import { useJournals } from "@/lib/hooks/useJournals";
import { useRouter } from "next/navigation";
import { GridCardWithOverlay } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Empty from "../Empty";
import { BookOpenText } from "lucide-react";

const JournalsList = ({
  chapterId,
  className,
}: {
  chapterId: string;
  className?: string;
}) => {
  const { data: journals, isLoading } = useJournals(chapterId);
  const router = useRouter();

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-xl font-bold">Journals</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : !journals?.length ? (
        <Empty
          icon={<BookOpenText className="emptyIcon" />}
          title="No journals yet"
          subtitle="Add journals to keep track of important events and memories"
          buttonTitle="Create First Journal"
          handleCreateClick={() => {
            router.push(`/chapters/${chapterId}/journals/new`);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {journals?.map(({ id, title, coverImage, location, date }) => (
            <GridCardWithOverlay
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() =>
                router.push(`/chapters/${chapterId}/journals/${id}`)
              }
              key={id}
              title={title}
              date={date}
              image={coverImage}
              location={location}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalsList;
