"use client";
import CharactersList from "@/components/characters/CharactersList";
import PageLayout from "@/components/layout/PageLayout";
import { useRouter } from "next/navigation";

const Characters = () => {
  const router = useRouter();
  return (
    <PageLayout
      headerProps={{ title: "Characters" }}
      floatingButtonProps={{
        label: "New Character",
        onClick: () => router.push("/characters/new"),
      }}
    >
      <CharactersList />
    </PageLayout>
  );
};

export default Characters;
