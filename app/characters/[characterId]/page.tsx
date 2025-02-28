"use client";
import CharacterForm from "@/components/characters/CharacterForm";
import { PageHeader } from "@/components/page-header";
import PageLayout from "@/components/PageLayout";
import DeleteConfirm from "@/components/ui/delete-confirm";
import { useChapter } from "@/lib/hooks/useChapters";
import { useCharacter, useCharacterMutations } from "@/lib/hooks/useCharacters";
import { useJournal } from "@/lib/hooks/useJournals";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Chapter = () => {
  const { characterId } = useParams();
  const router = useRouter();

  const { data: character, isLoading } = useCharacter(characterId! as string);
  console.log("🚀 ~ character:", character);
  const { deleteMutation } = useCharacterMutations();

  const handleDelete = async () => {
    if (character?.id) {
      await deleteMutation.mutateAsync(character.id);
      router.push(`/characters`);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <PageLayout>
      <PageHeader
        title={character?.name || "Character"}
        extra={
          character?.id && (
            <DeleteConfirm itemName="Character" handleDelete={handleDelete} />
          )
        }
      />
      <CharacterForm
        character={character}
        onUpdate={() => router.push(`/characters`)}
        onAdd={(id: string) => router.push(`/characters/${id}`)}
      />
    </PageLayout>
  );
};

export default Chapter;
