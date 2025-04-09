"use client";
import JournalForm from "@/components/journals/JournalForm";
import PageLayout from "@/components/PageLayout";
import DeleteConfirm from "@/components/ui/delete-confirm";
import { useJournal, useJournalMutations } from "@/lib/hooks/useJournals";
import { Journal } from "@/types/journals";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { EllipsisVertical, MoveRight, SquarePen, Trash2 } from "lucide-react";
import JournalCard from "@/components/journals/JournalCard";
import useOperations from "@/lib/hooks/useOperations";
import { toast } from "@/components/ui/sonner";
import CloudinaryMediaModal from "@/types/MediaPreviewModal";

const JournalPage = () => {
  const { chapterId, journalId } = useParams();
  const { data: journal } = useJournal(
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
  const router = useRouter();

  const { setSelectedId, setSelectedParentId } = useOperations();

  const handleDelete = async () => {
    try {
      if (journal?.id) {
        await deleteMutation.mutateAsync(journal.id);
        router.push(`/chapters/${chapterId}`);
        toast.success("Journal deleted successfully");
      }
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      toast.error("Error deleting journal");
    }
  };

  return (
    <PageLayout
      headerProps={{
        title: journal?.title || "New Journal",
        backLink: `/chapters/${chapterId}`,
        extra: journal?.id && (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer p-2">
              <EllipsisVertical size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <SquarePen size={16} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault(); // Prevents menu from closing too soon
                  // setTimeout(() => setOpen(true), 0); // Ensures dropdown closes first
                }}
              >
                <DeleteConfirm
                  itemName="Journal"
                  handleDelete={handleDelete}
                  trigger={
                    <span className="w-full flex gap-2">
                      <Trash2 size={16} />
                      Delete
                    </span>
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {journal?.id && (
                <DropdownMenuItem
                  onSelect={() => {
                    setSelectedId(journal.id);
                    setSelectedParentId(chapterId! as string);
                    router.push(`/chapters?operation=move`);
                  }}
                >
                  <MoveRight size={16} />
                  Move to chapter
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }}
    >
      {!isEditing ? (
        journal && (
          <div>
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
              <div className="prose mt-4">{journal.content}</div>
            )}
            {!!selectedMedia?.src && (
              <CloudinaryMediaModal
                isModalOpen={!!selectedMedia}
                setIsModalOpen={(value) => {
                  setSelectedMedia(null);
                }}
                mediaType={selectedMedia.type}
                publicId={selectedMedia.src}
                title={selectedMedia.title}
              />
            )}
          </div>
        )
      ) : (
        <JournalForm
          chapterId={chapterId as string}
          journal={journal as Journal}
          onCancel={() => setIsEditing(false)}
          onUpdate={() => {
            router.push(`/chapters/${chapterId}/journals/${journal?.id}`);
            setIsEditing(false);
          }}
          onAdd={(id: string) => {
            router.push(`/chapters/${chapterId}/journals/${id}`);
            setIsEditing(false);
          }}
        />
      )}
    </PageLayout>
  );
};

export default JournalPage;
