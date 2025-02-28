"use client";
import ChapterCard from "@/components/chapters/ChapterCard";
import ChapterForm from "@/components/chapters/ChapterForm";
import JournalsList from "@/components/journals/JournalsList";
import { PageHeader } from "@/components/page-header";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import DeleteConfirm from "@/components/ui/delete-confirm";
import { useChapter, useChapterMutations } from "@/lib/hooks/useChapters";
import { Chapter } from "@/types/chapters";
import { PenLine } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const ChapterPage = () => {
  const { chapterId } = useParams();
  const router = useRouter();
  const { data: chapter, isLoading } = useChapter(chapterId! as string);

  const { deleteMutation } = useChapterMutations();
  const handleDelete = async () => {
    if (chapter?.id) {
      await deleteMutation.mutateAsync(chapter.id);
      router.push(`/chapters`);
    }
  };

  const [isEditing, setIsEditing] = useState(chapterId === "new");

  if (isLoading) return <p>Loading...</p>;
  return (
    <PageLayout
      headerProps={{
        title: chapter?.title || "New Chapter",
        backLink: "/chapters",
        extra: chapter?.id && (
          <DeleteConfirm itemName="Chapter" handleDelete={handleDelete} />
        ),
      }}
    >
      {!isEditing ? (
        chapter && (
          <ChapterCard
            chapter={chapter}
            extra={
              <Button
                variant={"outline"}
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <PenLine className="h-4 w-4" />
              </Button>
            }
          />
        )
      ) : (
        <ChapterForm
          key={chapter?.id || "new"}
          chapter={chapter as Chapter}
          onUpdate={() => {
            router.push(`/chapters/${chapter?.id}`);
            setIsEditing(false);
          }}
          onAdd={(id: string) => {
            router.push(`/chapters/${id}`);
            setIsEditing(false);
          }}
        />
      )}
      {chapter?.id && (
        <JournalsList className="mt-4" chapterId={chapterId! as string} />
      )}
    </PageLayout>
  );
};

export default ChapterPage;
