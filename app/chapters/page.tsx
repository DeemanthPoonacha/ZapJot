"use client";
import ChaptersList from "@/components/chapters/ChaptersList";
import { PageHeader } from "@/components/page-header";
import PageLayout from "@/components/PageLayout";
import React from "react";

const Chapters = () => {
  return (
    <PageLayout>
      <PageHeader title="Chapters" />
      <ChaptersList />
    </PageLayout>
  );
};

export default Chapters;
