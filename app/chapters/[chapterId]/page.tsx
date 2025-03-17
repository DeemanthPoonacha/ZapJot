"use client";
import ChapterCard from "@/components/chapters/ChapterCard";
import ChapterForm from "@/components/chapters/ChapterForm";
import JournalsList from "@/components/journals/JournalsList";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import DeleteConfirm from "@/components/ui/delete-confirm";
import { useChapter, useChapterMutations } from "@/lib/hooks/useChapters";
import useOperations from "@/lib/hooks/useOperations";
import { Chapter } from "@/types/chapters";
import { PenLine } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const ChapterPage = () => {
  const { chapterId } = useParams();

  const searchParams = useSearchParams();
  const operation = searchParams.get("operation");
  const isMoving = operation === "move";

  const router = useRouter();
  console.log("🚀 ~ ChapterPage ~ searchParams:", searchParams, chapterId);
  const { data: chapter, isLoading } = useChapter(chapterId! as string);

  const { deleteMutation } = useChapterMutations();
  const { moveJournalMutation } = useOperations();

  const handleDelete = async () => {
    if (chapter?.id) {
      await deleteMutation.mutateAsync(chapter.id);
      router.push(`/chapters`);
    }
  };

  const isNewChapter = chapterId === "new";
  const [isEditing, setIsEditing] = useState(isNewChapter);

  if (isLoading) return <p>Loading...</p>;
  return (
    <PageLayout
      headerProps={{
        title: isMoving ? "Move Journal" : chapter?.title || "New Chapter",
        backLink: "/chapters",
        extra:
          chapter?.id &&
          (isMoving ? (
            <Button
              onClick={() => {
                moveJournalMutation.mutate(chapter.id);
                router.push(`/chapters/${chapter.id}`);
              }}
            >
              Move Here
            </Button>
          ) : (
            <DeleteConfirm itemName="Chapter" handleDelete={handleDelete} />
          )),
      }}
      {...(!isNewChapter && {
        floatingButtonProps: {
          label: "New Journal",
          onClick: () => {
            router.push(`/chapters/${chapterId}/journals/new`);
          },
        },
      })}
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
          onCancel={() => setIsEditing(false)}
          onUpdate={() => {
            isMoving
              ? router.push(`/chapters/${chapter?.id}?operation=move`)
              : router.push(`/chapters/${chapter?.id}`);
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
