"use client";
import TasksList from "@/components/TasksList";
import PageLayout from "@/components/PageLayout";
import React from "react";
import EventsList from "@/components/EventsList";
import EventForm from "@/components/EventForm";
import GoalsList from "@/components/GoalsList";
import GoalForm from "@/components/GoalForm";
import ItineraryList from "@/components/ItinerariesList";
import ItineraryForm from "@/components/ItineraryForm";

const Tasks = () => {
  return (
    <PageLayout>
      Tasks:
      <TasksList />
      Events:
      <EventsList />
      <EventForm />
      Goals:
      <GoalsList />
      <GoalForm />
      Itineraries:
      <ItineraryList />
      <ItineraryForm />
    </PageLayout>
  );
};

export default Tasks;
