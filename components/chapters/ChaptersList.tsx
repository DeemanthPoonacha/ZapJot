import { useChapters } from "@/lib/hooks/useChapters";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const ChaptersList = () => {
  const { data: chapters, isLoading } = useChapters();
  console.log("🚀 ~ ChaptersList ~ chapters:", chapters);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {chapters?.map((chapter) => (
        <Link href={`/chapters/${chapter.id}`} key={chapter.id}>
          <Card className="group relative aspect-square overflow-hidden">
            {chapter.image && (
              <Image
                src={chapter.image || "/placeholder.svg"}
                alt={chapter.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end z-10">
              <h3 className="font-semibold text-white">{chapter.title}</h3>
              {chapter.subtitle && (
                <p className="text-sm text-white/80">{chapter.subtitle}</p>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ChaptersList;
