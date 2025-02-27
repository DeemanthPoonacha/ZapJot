"use client";
import CharacterForm from "@/components/characters/CharacterForm";
import { PageHeader } from "@/components/page-header";
import PageLayout from "@/components/PageLayout";
import { useChapter } from "@/lib/hooks/useChapters";
import { useCharacter } from "@/lib/hooks/useCharacters";
import { useJournal } from "@/lib/hooks/useJournals";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Chapter = () => {
  const { characterId } = useParams();
  const router = useRouter();

  const { data: character, isLoading } = useCharacter(characterId! as string);
  console.log("🚀 ~ character:", character);

  if (isLoading) return <p>Loading...</p>;

  return (
    <PageLayout>
      <PageHeader title={character?.name || "Character"} />
      <CharacterForm
        character={character}
        onSuccess={() => router.push(`/characters`)}
      />
    </PageLayout>
  );
};

export default Chapter;
