"use client";
import CharactersList from "@/components/characters/CharactersList";
import { PageHeader } from "@/components/page-header";
import PageLayout from "@/components/PageLayout";
import React from "react";

const characters = () => {
  return (
    <PageLayout>
      <PageHeader title="Characters" />
      <CharactersList />
    </PageLayout>
  );
};

export default characters;
