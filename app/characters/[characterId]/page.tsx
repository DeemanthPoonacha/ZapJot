"use client";
import CharacterForm from "@/components/characters/CharacterForm";
import PageLayout from "@/components/PageLayout";
import DeleteConfirm from "@/components/ui/delete-confirm";
import { toast } from "@/components/ui/sonner";
import { useCharacter, useCharacterMutations } from "@/lib/hooks/useCharacters";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Chapter = () => {
  const { characterId } = useParams();
  const router = useRouter();

  const { data: character, isLoading } = useCharacter(characterId! as string);

  const { deleteMutation } = useCharacterMutations();
  const handleDelete = async () => {
    try {
      if (character?.id) {
        await deleteMutation.mutateAsync(character.id);
        router.push(`/characters`);
        toast.success("Character deleted successfully");
      }
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      toast.error("Error deleting character");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <PageLayout
      headerProps={{
        title: character?.name || "Character",
        backLink: "/characters",
        extra: character?.id && (
          <DeleteConfirm itemName="Character" handleDelete={handleDelete} />
        ),
      }}
    >
      <CharacterForm
        character={character}
        onUpdate={() => router.push(`/characters`)}
        onAdd={(id: string) => router.push(`/characters/${id}`)}
      />
    </PageLayout>
  );
};

export default Chapter;
