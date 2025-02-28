"use client";
import JournalForm from "@/components/journals/JournalForm";
import { PageHeader } from "@/components/page-header";
import PageLayout from "@/components/PageLayout";
import DeleteConfirm from "@/components/ui/delete-confirm";
import { useJournal, useJournalMutations } from "@/lib/hooks/useJournals";
import { Journal } from "@/types/journals";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const Chapter = () => {
  const { chapterId, journalId } = useParams();
  const { data: journal } = useJournal(
    chapterId! as string,
    journalId! as string
  );

  const [isEditing, setIsEditing] = useState(false);

  const { deleteMutation } = useJournalMutations(chapterId! as string);
  const router = useRouter();

  const handleDelete = async () => {
    if (journal?.id) {
      await deleteMutation.mutateAsync(journal.id);
      router.push(`/chapters/${chapterId}`);
    }
  };
  return (
    <PageLayout>
      <PageHeader
        title={journal?.title || "New Journal"}
        backLink={`/chapters/${chapterId}`}
        extra={
          journal?.id && (
            <DeleteConfirm itemName="Journal" handleDelete={handleDelete} />
          )
        }
      />
      {!isEditing ? (
        <div className="flex items-center justify-center h-full">
          {journal?.title}
        </div>
      ) : (
        <JournalForm
          chapterId={chapterId as string}
          journal={journal as Journal}
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

export default Chapter;
