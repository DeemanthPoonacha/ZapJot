"use client";
import JournalForm from "@/components/journals/JournalForm";
import PageLayout from "@/components/layout/PageLayout";
import { useJournal, useJournalMutations } from "@/lib/hooks/useJournals";
import { Journal } from "@/types/journals";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { MoveRight } from "lucide-react";
import JournalCard from "@/components/journals/JournalCard";
import useOperations from "@/lib/hooks/useOperations";
import { toast } from "@/components/ui/sonner";
import CloudinaryMediaModal from "@/components/MediaPreviewModal";
import { useSearchParams } from "next/navigation";
import { useNProgressRouter } from "@/components/layout/link/CustomLink";
import { CustomLoader } from "@/components/layout/CustomLoader";
import { WysiwygViewer } from "@/components/wysiwyg/viewer";
import MenuDropdown from "@/components/MenuDropdown";

const JournalPage = () => {
  const searchParams = useSearchParams();
  const defaultCamOpen = searchParams.get("isCamOpen");

  const { chapterId, journalId } = useParams();
  const { data: journal, isLoading } = useJournal(
    chapterId! as string,
    journalId! as string
  );

  const [selectedMedia, setSelectedMedia] = useState<{
    title: string;
    type: "image" | "video";
    src: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(journalId === "new");

  const { deleteMutation } = useJournalMutations(chapterId! as string);
  const { routerPush } = useNProgressRouter();

  const { setSelectedId, setSelectedParentId } = useOperations();

  const handleDelete = async () => {
    try {
      if (journal?.id) {
        await deleteMutation.mutateAsync(journal.id);
        routerPush(`/chapters/${chapterId}`);
        toast.success("Journal deleted successfully");
      }
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      toast.error("Error deleting journal");
    }
  };

  const onFinish = (id: string, chId?: string) => {
    routerPush(`/chapters/${chId || chapterId}/journals/${id}`);
    setIsEditing(false);
  };
  const extra = (
    <DropdownMenuItem
      onSelect={() => {
        if (journal?.id && chapterId) {
          setSelectedId(journal.id || "");
          setSelectedParentId((chapterId as string) || "");
          routerPush(`/chapters?operation=move`);
        }
      }}
    >
      <MoveRight size={16} />
      Move to chapter
    </DropdownMenuItem>
  );

  return (
    <PageLayout
      headerProps={{
        title: journal?.title || "New Journal",
        backLink: `/chapters/${chapterId}`,
        extra: journal?.id && (
          <MenuDropdown
            extra={extra}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleDelete={handleDelete}
            deleteItemName="Journal"
          />
        ),
      }}
    >
      {!isEditing ? (
        isLoading ? (
          <CustomLoader />
        ) : journal ? (
          <div className="flex flex-col gap-4">
            <JournalCard
              onClick={() =>
                setSelectedMedia({
                  title: journal.title,
                  type: "image",
                  src: journal.coverImage!,
                })
              }
              className="min-h-96"
              journal={journal as Journal}
            />
            {journal.content && (
              <div className="mt-2 px-4 break-words">
                <WysiwygViewer html={journal.content} />
              </div>
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
          </div>
        ) : (
          <div className="flex h-[80vh] items-center justify-center">
            Could not load journal data
          </div>
        )
      ) : (
        <JournalForm
          defaultCamOpen={defaultCamOpen === "true"}
          chapterId={chapterId as string}
          journal={journal as Journal}
          onCancel={() => {
            if (!journal?.id) routerPush(`/chapters/${chapterId}`);
            setIsEditing(false);
          }}
          onFinish={onFinish}
        />
      )}
    </PageLayout>
  );
};

export default JournalPage;
