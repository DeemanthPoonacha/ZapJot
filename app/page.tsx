"use client";
import ChapterForm from "@/components/ChapterForm";
import JournalForm from "@/components/JournalForm";
import { useChapters } from "@/lib/hooks/useChapters";
import { useJournals } from "@/lib/hooks/useJournals";

export default function Home() {
  const { data: chapters, isLoading, error } = useChapters();
  console.log("🚀 ~ Home ~ chapters:", chapters);

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
    </main>
  );
}
