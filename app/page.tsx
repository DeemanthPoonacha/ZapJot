"use client";
import { useJournals } from "@/lib/hooks/useJournals";

export default function Home() {
  const userId = "testUser123"; // Replace with auth user ID
  const { data: journals, isLoading, error } = useJournals(userId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading journals</p>;

  return (
    <main>
      <h1>Home</h1>
      {journals?.map((journal) => (
        <div key={journal.id}>
          <h2>{journal.title}</h2>
          <p>{journal.description}</p>
        </div>
      ))}
    </main>
  );
}
