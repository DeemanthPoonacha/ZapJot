import { Card, GridCardWithOverlay } from "@/components/ui/card";
import Image from "next/image";
import { formatDateTitle } from "@/lib/utils";
import { Chapter } from "@/types/chapters";

function ChapterCard({
  chapter,
  extra,
}: {
  chapter: Chapter;
  extra?: React.ReactNode;
}) {
  return (
    <GridCardWithOverlay
      title={chapter.title}
      date={chapter.date}
      image={chapter.image}
      subtitle={chapter.subtitle}
      extra={extra}
    />
  );
}

export default ChapterCard;
