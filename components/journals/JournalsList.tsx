import { useJournals } from "@/lib/hooks/useJournals";
import { useRouter } from "next/navigation";
import { GridCardWithOverlay } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const JournalsList = ({
  chapterId,
  className,
}: {
  chapterId: string;
  className?: string;
}) => {
  const { data: journals, isLoading } = useJournals(chapterId);
  const router = useRouter();

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-xl font-bold">Journals</h2>
      <div className="grid grid-cols-2 sm:garid-cols-2 md:garid-cols-3 gap-4">
        {journals?.map(({ id, title, coverImage, location }) => (
          <GridCardWithOverlay
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => router.push(`/chapters/${chapterId}/journals/${id}`)}
            key={id}
            title={title}
            image={coverImage}
            subtitle={location}
          />
        ))}
      </div>
    </div>
  );
};

export default JournalsList;
