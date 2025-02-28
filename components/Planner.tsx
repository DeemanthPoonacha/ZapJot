"use client";

import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "./events/EventsList";
import GoalsList from "./goals/GoalsList";
import ItinerariesList from "./itineraries/ItinerariesList";
import TasksList from "./tasks/TasksList";
import { Calendar } from "./ui/calendar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PlannerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "tasks";
  const [activeTab, setActiveTab] = useState(tab);
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={(tab) => {
        setActiveTab(tab);
        router.push(pathname + "?" + createQueryString("tab", tab));
      }}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4 bg-muted/50">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="goals">Goals</TabsTrigger>
        <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <TasksList />
      </TabsContent>
      <TabsContent value="events" className="flex flex-col gap-4">
        <Calendar
          mode="single"
          className="rounded-md border w-full flex justify-center"
        />
        <EventsList />
      </TabsContent>
      <TabsContent value="goals">
        <GoalsList />
      </TabsContent>
      <TabsContent value="itineraries">
        <ItinerariesList />
      </TabsContent>
    </Tabs>
  );
}
