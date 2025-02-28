"use client";
import PageLayout from "@/components/PageLayout";
import React from "react";
import PlannerPage from "@/components/Planner";
import { PageHeader } from "@/components/page-header";

const Tasks = () => {
  return (
    <PageLayout headerProps={{ title: "Planner" }}>
      <PlannerPage />
    </PageLayout>
  );
};

export default Tasks;
