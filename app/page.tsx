"use client";
import ChapterForm from "@/components/chapters/ChapterForm";
import CharacterForm from "@/components/characters/CharacterForm";
import JournalForm from "@/components/journals/JournalForm";
import { useChapters } from "@/lib/hooks/useChapters";
import { useCharacters } from "@/lib/hooks/useCharacters";
import { useJournals } from "@/lib/hooks/useJournals";

export default function Home() {
  const { data: chapters, isLoading, error } = useChapters();
  const { data: characters } = useCharacters();

  console.log("🚀 ~ Home ~ chapters:", chapters, characters);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading journals</p>;

  return (
    <main>
      <h1>Home</h1>
      {chapters?.map((journal) => (
        <div key={journal.id}>
          <h2>{journal.title}</h2>
          <p>{journal.createdAt}</p>
        </div>
      ))}
      <JournalForm />
      <ChapterForm />
      <div className="m-12">
        {characters?.map((character) => (
          <div key={character.id}>
            <h2>{character.name}</h2>
            <p>{character.title}</p>
          </div>
        ))}
      </div>
      <CharacterForm />
    </main>
  );
}
