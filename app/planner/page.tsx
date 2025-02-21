"use client";
import TasksList from "@/components/TasksList";
import PageLayout from "@/components/PageLayout";
import React from "react";
import EventsList from "@/components/EventsList";
import EventForm from "@/components/EventForm";

const Tasks = () => {
  return (
    <PageLayout>
      Tasks:
      <TasksList />
      Events:
      <EventsList />
      <EventForm />
    </PageLayout>
  );
};

export default Tasks;
