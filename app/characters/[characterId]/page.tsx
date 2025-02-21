"use client";
import PageLayout from "@/components/PageLayout";
import { useChapter } from "@/lib/hooks/useChapters";
import { useCharacter } from "@/lib/hooks/useCharacters";
import { useJournal } from "@/lib/hooks/useJournals";
import { useParams } from "next/navigation";
import React from "react";

const Chapter = () => {
  const { characterId } = useParams();
  const { data: character } = useCharacter(characterId! as string);
  return (
    <PageLayout>
      <h2 className="text-xl font-bold">{character?.name}</h2>
    </PageLayout>
  );
};

export default Chapter;
