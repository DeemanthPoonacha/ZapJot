"use client";
import ChaptersList from "@/components/chapters/ChaptersList";
import PageLayout from "@/components/layout/PageLayout";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Chapters = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const operation = searchParams.get("operation");
  const isMoving = operation === "move";

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
      <ChaptersList isMoving={isMoving} />
    </PageLayout>
  );
};

export default Chapters;
