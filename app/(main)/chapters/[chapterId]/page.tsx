"use client";
import ChapterCard from "@/components/chapters/ChapterCard";
import ChapterForm from "@/components/chapters/ChapterForm";
import { CustomLoader } from "@/components/CustomLoader";
import JournalsList from "@/components/journals/JournalsList";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import DeleteConfirm from "@/components/ui/delete-confirm";
import { toast } from "@/components/ui/sonner";
import { useChapter, useChapterMutations } from "@/lib/hooks/useChapters";
import useOperations from "@/lib/hooks/useOperations";
import { Chapter } from "@/types/chapters";
import CloudinaryMediaModal from "@/components/MediaPreviewModal";
import { PenLine } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const NotFound = () => <p>Chapter not found</p>;

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

  const [selectedMedia, setSelectedMedia] = useState<{
    title: string;
    type: "image" | "video";
    src: string;
  } | null>(null);

  const handleDelete = async () => {
    try {
      if (chapter?.id) {
        await deleteMutation.mutateAsync(chapter.id);
        router.push(`/chapters`);
        toast.success("Chapter deleted successfully");
      }
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      toast.error("Error deleting chapter");
    }
  };

  const handleMoveChapter = async () => {
    try {
      if (chapter?.id) {
        await moveJournalMutation.mutateAsync(chapter.id);
        router.push(`/chapters/${chapter.id}`);
        toast.success("Journal moved successfully");
      }
    } catch (error) {
      console.log("🚀 ~ handleMoveChapter ~ error:", error);
      toast.error("Error moving journal");
    }
  };

  const isNewChapter = chapterId === "new";
  const [isEditing, setIsEditing] = useState(isNewChapter);

  if (isLoading) return <CustomLoader />;

  return (
    <PageLayout
      headerProps={{
        title: isMoving
          ? "Move Journal"
          : isNewChapter
          ? "New Chapter"
          : chapter?.title || (chapterId as string),
        backLink: "/chapters",
        extra:
          chapter?.id &&
          (isMoving ? (
            <Button onClick={handleMoveChapter}>Move Here</Button>
          ) : (
            <DeleteConfirm
              itemName="Chapter"
              description="Are you sure you want to delete this chapter? All journals in this chapter will be deleted. This action cannot be undone."
              handleDelete={handleDelete}
            />
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
      {!chapter && !isNewChapter ? (
        <NotFound />
      ) : !isEditing ? (
        chapter && (
          <>
            <ChapterCard
              onClick={() =>
                setSelectedMedia({
                  title: chapter.title,
                  type: "image",
                  src: chapter.image!,
                })
              }
              className="min-h-96"
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
            {chapter?.description && (
              <p className="mt-2 px-4 break-words">{chapter.description}</p>
            )}
          </>
        )
      ) : (
        <ChapterForm
          key={chapter?.id || "new"}
          chapter={chapter as Chapter}
          onCancel={() => {
            if (!chapter?.id) router.push(`/chapters`);
            setIsEditing(false);
          }}
          onUpdate={() => {
            router.push(
              isMoving
                ? `/chapters/${chapter?.id}?operation=move`
                : `/chapters/${chapter?.id}`
            );
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
      {!!selectedMedia?.src && (
        <CloudinaryMediaModal
          isModalOpen={!!selectedMedia}
          setIsModalOpen={() => {
            setSelectedMedia(null);
          }}
          mediaType={selectedMedia.type}
          publicId={selectedMedia.src}
          title={selectedMedia.title}
        />
      )}
    </PageLayout>
  );
};

export default ChapterPage;
