"use client";

import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "./events/EventsList";
import GoalsList from "./goals/GoalsList";
import ItinerariesList from "./itineraries/ItinerariesList";
import TasksList from "./tasks/TasksList";
import { Calendar } from "./ui/calendar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PlannerPage({
  activeTab,
  onTabChange,
  selectedId,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedId?: string;
}) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-muted/50">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="goals">Goals</TabsTrigger>
        <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <TasksList selectedId={selectedId} />
      </TabsContent>
      <TabsContent value="events" className="flex flex-col gap-4">
        <Calendar
          mode="single"
          className="rounded-md border w-full flex justify-center"
        />
        <EventsList />
      </TabsContent>
      <TabsContent value="goals">
        <GoalsList selectedId={selectedId} />
      </TabsContent>
      <TabsContent value="itineraries">
        <ItinerariesList selectedId={selectedId} />
      </TabsContent>
    </Tabs>
  );
}
