"use client";
import TasksList from "@/components/TasksList";
import PageLayout from "@/components/PageLayout";
import React from "react";

const Tasks = () => {
  return (
    <PageLayout>
      Tasks:
      <TasksList />
    </PageLayout>
  );
};

export default Tasks;
