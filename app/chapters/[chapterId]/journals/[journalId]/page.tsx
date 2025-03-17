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
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";
import JournalCard from "@/components/journals/JournalCard";

const JournalPage = () => {
  const { chapterId, journalId } = useParams();
  const { data: journal } = useJournal(
    chapterId! as string,
    journalId! as string
  );

  const [isEditing, setIsEditing] = useState(journalId === "new");

  const { deleteMutation } = useJournalMutations(chapterId! as string);
  const router = useRouter();

  const handleDelete = async () => {
    if (journal?.id) {
      await deleteMutation.mutateAsync(journal.id);
      router.push(`/chapters/${chapterId}`);
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
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }}
    >
      {!isEditing ? (
        journal && (
          <div>
            <JournalCard journal={journal as Journal} />
            {journal.content && (
              <div className="prose mt-4">{journal.content}</div>
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
