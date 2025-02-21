"use client";
import TasksList from "@/components/TasksList";
import PageLayout from "@/components/PageLayout";
import React from "react";
import EventsList from "@/components/events/EventsList";
import EventForm from "@/components/events/EventForm";
import GoalsList from "@/components/goals/GoalsList";
import GoalForm from "@/components/goals/GoalForm";
import ItineraryList from "@/components/itineraries/ItinerariesList";
import ItineraryForm from "@/components/itineraries/ItineraryForm";

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
