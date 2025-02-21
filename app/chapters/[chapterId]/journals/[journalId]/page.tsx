"use client";
import { useChapter } from "@/lib/hooks/useChapters";
import { useJournal } from "@/lib/hooks/useJournals";
import { useParams } from "next/navigation";
import React from "react";

const Chapter = () => {
  const { chapterId, journalId } = useParams();
  const { data: journal } = useJournal(
    chapterId! as string,
    journalId! as string
  );
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold">{journal?.title}</h2>
    </div>
  );
};

export default Chapter;
