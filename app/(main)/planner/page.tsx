"use client";
import PageLayout from "@/components/PageLayout";
import PlannerPage from "@/components/Planner";
import { FloatingButtonProps } from "@/components/ui/floating-button";
import usePlanner from "@/lib/hooks/usePlanner";

const Planner = () => {
  const {
    selectedTab,
    setSelectedTab,
    setSelectedEventId,
    setEditingItineraryId,
    setSelectedTaskId,
    setSelectedGoalId,
  } = usePlanner();
  const actions: Record<string, FloatingButtonProps> = {
    tasks: {
      label: "New Task",
      onClick: () => {
        setSelectedTab("tasks");
        setSelectedTaskId("new");
      },
    },
    events: {
      label: "New Event",
      onClick: () => {
        setSelectedTab("events");
        setSelectedEventId("new");
      },
    },
    goals: {
      label: "New Goal",
      onClick: () => {
        setSelectedTab("goals");
        setSelectedGoalId("new");
      },
    },
    itineraries: {
      label: "New Itinerary",
      onClick: () => {
        setSelectedTab("itineraries");
        setEditingItineraryId("new");
      },
    },
  };
  return (
    <PageLayout
      headerProps={{ title: "Planner" }}
      floatingButtonProps={actions[selectedTab]}
    >
      <PlannerPage />
    </PageLayout>
  );
};

export default Planner;
