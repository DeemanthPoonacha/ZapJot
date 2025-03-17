import { Card, GridCardWithOverlay } from "@/components/ui/card";
import Image from "next/image";
import { formatDateTitle } from "@/lib/utils";
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
      extra={extra}
    />
  );
}

export default JournalCard;
