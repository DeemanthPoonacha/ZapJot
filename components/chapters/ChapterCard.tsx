import { GridCardWithOverlay } from "@/components/ui/card";
import { Chapter } from "@/types/chapters";

function ChapterCard({
  chapter,
  extra,
  className,
  onClick,
}: {
  chapter: Chapter;
  extra?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <GridCardWithOverlay
      title={chapter.title}
      date={chapter.date}
      image={chapter.image}
      subtitle={chapter.subtitle}
      extra={extra}
      className={className}
      onClick={onClick}
    />
  );
}

export default ChapterCard;
