"use client";
import ChaptersList from "@/components/chapters/ChaptersList";
import { useNProgressRouter } from "@/components/layout/link/CustomLink";
import PageLayout from "@/components/layout/PageLayout";
import { useSearchParams } from "next/navigation";
import React from "react";

const Chapters = () => {
  const { routerPush } = useNProgressRouter();

  const searchParams = useSearchParams();
  const operation = searchParams.get("operation");
  const isMoving = operation === "move";

  return (
    <PageLayout
      headerProps={{ title: "Chapters" }}
      floatingButtonProps={{
        label: "New Chapter",
        onClick: () => {
          routerPush("/chapters/new");
        },
      }}
    >
      <ChaptersList isMoving={isMoving} />
    </PageLayout>
  );
};

export default Chapters;
