"use client";
import CharactersList from "@/components/CharactersList";
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
