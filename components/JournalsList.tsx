import { useJournals } from "@/lib/hooks/useJournals";
import { useRouter } from "next/navigation";
import JournalForm from "@/components/JournalForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const JournalsList = ({ chapterId }: { chapterId: string }) => {
  const { data: journals, isLoading } = useJournals(chapterId);
  const router = useRouter();

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Journals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {journals?.map((journal) => (
          <Card
            key={journal.id}
            className="cursor-pointer hover:shadow-lg transition h-12"
            onClick={() =>
              router.push(`/chapters/${chapterId}/journals/${journal.id}`)
            }
          >
            <CardHeader>
              <CardTitle>{journal.title || "Untitled Journal"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{journal.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <JournalForm chapterId={chapterId} />
    </div>
  );
};

export default JournalsList;
