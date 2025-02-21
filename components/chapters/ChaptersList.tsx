import { useChapters } from "@/lib/hooks/useChapters";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ChapterForm from "@/components/chapters/ChapterForm";

const ChaptersList = () => {
  const { data: chapters, isLoading } = useChapters();
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {chapters?.map((chapter) => (
          <Card
            key={chapter.id}
            className="cursor-pointer hover:shadow-lg transition h-12"
            onClick={() => router.push(`/chapters/${chapter.id}`)}
          >
            <CardContent>
              <CardTitle>{chapter.title}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold">Add New Chapter</h2>
        <ChapterForm />
      </div>
    </div>
  );
};

export default ChaptersList;
