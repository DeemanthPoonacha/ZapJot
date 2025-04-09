"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "./events/EventsList";
import GoalsList from "./goals/GoalsList";
import ItinerariesList from "./itineraries/ItineraryList";
import TasksList from "./tasks/TasksList";
import { Calendar } from "./ui/calendar";
import usePlanner from "@/lib/hooks/usePlanner";
import dayjs from "dayjs";
import { useState } from "react";
import {
  CalendarCheck,
  CalendarIcon,
  Goal,
  LandPlot,
  List,
  ListCheck,
  MapPin,
  MapPinned,
} from "lucide-react";

export default function PlannerPage() {
  const { selectedTab: activeTab, setSelectedTab: onTabChange } = usePlanner();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const endDate = selectedDate ? dayjs(selectedDate) : dayjs().add(2, "days");
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-muted/50 md:h-16 mb-2">
        <TabsTrigger className="md:flex-col md:h-12 md:gap-0" value="tasks">
          <ListCheck /> Tasks
        </TabsTrigger>
        <TabsTrigger className="md:flex-col md:h-12 md:gap-0" value="events">
          <CalendarCheck /> Events
        </TabsTrigger>
        <TabsTrigger className="md:flex-col md:h-12 md:gap-0" value="goals">
          <Goal /> Goals
        </TabsTrigger>
        <TabsTrigger
          className="md:flex-col md:h-12 md:gap-0"
          value="itineraries"
        >
          <LandPlot />
          Itineraries
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <TasksList />
      </TabsContent>
      <TabsContent value="events" className="flex flex-col gap-4">
        <Calendar
          mode="single"
          className="rounded-md border w-full flex justify-center"
          selected={selectedDate}
          onSelect={setSelectedDate}
        />
        <EventsList
          showDefault={selectedDate === undefined}
          query={{
            dateRange: {
              start: dayjs(selectedDate).startOf("day").toDate(),
              end: endDate.endOf("day").toDate(),
            },
          }}
        />
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
