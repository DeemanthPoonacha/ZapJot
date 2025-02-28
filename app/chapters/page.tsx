"use client";
import ChaptersList from "@/components/chapters/ChaptersList";
import { PageHeader } from "@/components/page-header";
import PageLayout from "@/components/PageLayout";
import { useRouter } from "next/navigation";
import React from "react";

const Chapters = () => {
  const router = useRouter();
  return (
    <PageLayout
      headerProps={{ title: "Chapters" }}
      floatingButtonProps={{
        label: "New Chapter",
        onClick: () => {
          router.push("/chapters/new");
        },
      }}
    >
      <ChaptersList />
    </PageLayout>
  );
};

export default Chapters;
