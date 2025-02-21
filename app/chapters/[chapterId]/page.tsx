"use client";
import JournalsList from "@/components/JournalsList";
import { useChapter } from "@/lib/hooks/useChapters";
import { useParams } from "next/navigation";
import React from "react";

const Chapter = () => {
  const { chapterId } = useParams();
  const { data: chapter } = useChapter(chapterId! as string);
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold">{chapter?.title}</h2>
      <JournalsList chapterId={chapterId! as string} />
    </div>
  );
};

export default Chapter;
