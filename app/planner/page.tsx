"use client";
import PageLayout from "@/components/PageLayout";
import React from "react";
import PlannerPage from "@/components/characters/Planner";
import { PageHeader } from "@/components/page-header";

const Tasks = () => {
  return (
    <PageLayout>
      <PageHeader title="Planner" />
      <PlannerPage />
    </PageLayout>
  );
};

export default Tasks;
