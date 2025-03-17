import { GridCardWithOverlay } from "@/components/ui/card";
import { Journal } from "@/types/journals";

function JournalCard({
  journal: Journal,
  extra,
}: {
  journal: Journal;
  extra?: React.ReactNode;
}) {
  return (
    <GridCardWithOverlay
      title={Journal.title}
      date={Journal.date}
      image={Journal.coverImage}
      // subtitle={Journal.content}
      location={Journal.location}
      extra={extra}
    />
  );
}

export default JournalCard;
