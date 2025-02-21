"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "../events/EventsList";
import GoalsList from "../goals/GoalsList";
import ItinerariesList from "../itineraries/ItinerariesList";
import TasksList from "../tasks/TasksList";

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <TasksList />
        </TabsContent>
        <TabsContent value="events">
          <EventsList />
        </TabsContent>
        <TabsContent value="goals">
          <GoalsList />
        </TabsContent>
        <TabsContent value="itineraries">
          <ItinerariesList />
        </TabsContent>
      </Tabs>
    </>
  );
}
