"use client";
import CharactersList from "@/components/characters/CharactersList";
import { PageHeader } from "@/components/page-header";
import PageLayout from "@/components/PageLayout";

const characters = () => {
  return (
    <PageLayout headerProps={{ title: "Characters" }}>
      <CharactersList />
    </PageLayout>
  );
};

export default characters;
