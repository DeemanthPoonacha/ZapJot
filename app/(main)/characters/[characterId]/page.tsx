"use client";
import CharacterForm from "@/components/characters/CharacterForm";
import { CustomLoader } from "@/components/layout/CustomLoader";
import { useNProgressRouter } from "@/components/layout/link/CustomLink";
import PageLayout from "@/components/layout/PageLayout";
import DeleteConfirm from "@/components/ui/delete-confirm";
import { toast } from "@/components/ui/sonner";
import { useCharacter, useCharacterMutations } from "@/lib/hooks/useCharacters";
import { useParams } from "next/navigation";
import React from "react";

const Chapter = () => {
  const { characterId } = useParams();
  const { routerPush } = useNProgressRouter();

  const { data: character, isLoading } = useCharacter(characterId! as string);

  const { deleteMutation } = useCharacterMutations();
  const handleDelete = async () => {
    try {
      if (character?.id) {
        await deleteMutation.mutateAsync(character.id);
        routerPush(`/characters`);
        toast.success("Character deleted successfully");
      }
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      toast.error("Error deleting character");
    }
  };

  if (isLoading) return <CustomLoader />;

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
        onUpdate={() => routerPush(`/characters`)}
        onCancel={() => routerPush(`/characters`)}
        onAdd={(id: string) => routerPush(`/characters/${id}`)}
      />
    </PageLayout>
  );
};

export default Chapter;
