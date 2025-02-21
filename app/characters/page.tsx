"use client";
import CharactersList from "@/components/characters/CharactersList";
import PageLayout from "@/components/PageLayout";
import React from "react";

const characters = () => {
  return (
    <PageLayout>
      characters:
      <CharactersList />
    </PageLayout>
  );
};

export default characters;
