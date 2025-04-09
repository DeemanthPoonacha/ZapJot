import { GridCardWithOverlay } from "@/components/ui/card";
import { Journal } from "@/types/journals";

function JournalCard({
  journal: Journal,
  extra,
  className,
  onClick,
}: {
  journal: Journal;
  extra?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <GridCardWithOverlay
      title={Journal.title}
      date={Journal.date}
      image={Journal.coverImage}
      // subtitle={Journal.content}
      location={Journal.location}
      extra={extra}
      className={className}
      onClick={onClick}
    />
  );
}

export default JournalCard;
