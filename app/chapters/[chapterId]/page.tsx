"use client";
import ChapterForm from "@/components/chapters/ChapterForm";
import JournalsList from "@/components/journals/JournalsList";
import PageLayout from "@/components/PageLayout";
import { useChapter } from "@/lib/hooks/useChapters";
import { Chapter } from "@/types/chapters";
import { useParams } from "next/navigation";
import React from "react";

const ChapterPage = () => {
  const { chapterId } = useParams();
  const { data: chapter } = useChapter(chapterId! as string);
  return (
    <PageLayout>
      <ChapterForm key={chapter?.id || "new"} chapter={chapter as Chapter} />
      <JournalsList chapterId={chapterId! as string} />
    </PageLayout>
  );
};

export default ChapterPage;
