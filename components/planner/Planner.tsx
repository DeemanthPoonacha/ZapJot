"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "./events/EventsList";
import GoalsList from "./goals/GoalsList";
import ItinerariesList from "./itineraries/ItineraryList";
import TasksList from "./tasks/TasksList";
import { Calendar } from "../ui/calendar";
import usePlanner from "@/lib/hooks/usePlanner";
import dayjs from "dayjs";
import { useState } from "react";
import { CalendarCheck, Goal, LandPlot, ListCheck, Calendar as CalendarIcon } from "lucide-react";
import { useEvents } from "@/lib/hooks/useEvents";
import { groupEventsByDate } from "@/lib/utils/events";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function PlannerPage() {
  const { selectedTab: activeTab, setSelectedTab: onTabChange } = usePlanner();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    setSelectedDate(undefined);
  };

  // Generate Year options dynamically (Current Year - 5 to Current Year + 10)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i);

  // Fetch events for the visible month to show calendar markers/dots
  const { data: monthEvents } = useEvents({
    dateRange: {
      start: dayjs(currentMonth).startOf("month").toDate(),
      end: dayjs(currentMonth).endOf("month").toDate(),
    },
  });

  const groupedMonthEvents = monthEvents
    ? groupEventsByDate(
        monthEvents,
        dayjs(currentMonth).startOf("month").toDate(),
        dayjs(currentMonth).endOf("month").toDate()
      )
    : {};

  const datesWithEvents = new Set(
    Object.entries(groupedMonthEvents)
      .filter(([_, evs]) => evs.length > 0)
      .map(([dateStr]) => dateStr)
  );

  const isCurrentMonth = dayjs(currentMonth).isSame(dayjs(), "month");

  // Set default query range based on selectedDate or currentMonth
  const dateRange = selectedDate
    ? {
        start: dayjs(selectedDate).startOf("day").toDate(),
        end: dayjs(selectedDate).endOf("day").toDate(),
      }
    : isCurrentMonth
    ? {
        start: dayjs().startOf("day").toDate(),
        end: dayjs(currentMonth).endOf("month").toDate(),
      }
    : {
        start: dayjs(currentMonth).startOf("month").toDate(),
        end: dayjs(currentMonth).endOf("month").toDate(),
      };

  return (
    <Tabs
      tabValues={["tasks", "events", "goals", "itineraries"]}
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4 bg-muted/50 md:h-16 mb-2 gap-1 p-1">
        <TabsTrigger
          className="md:flex-col md:h-12 md:gap-1 rounded-lg data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-200"
          value="tasks"
        >
          <ListCheck className="h-4 w-4" /> Tasks
        </TabsTrigger>
        <TabsTrigger
          className="md:flex-col md:h-12 md:gap-1 rounded-lg data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-200"
          value="events"
        >
          <CalendarCheck className="h-4 w-4" /> Events
        </TabsTrigger>
        <TabsTrigger
          className="md:flex-col md:h-12 md:gap-1 rounded-lg data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-200"
          value="goals"
        >
          <Goal className="h-4 w-4" /> Goals
        </TabsTrigger>
        <TabsTrigger
          className="md:flex-col md:h-12 md:gap-1 rounded-lg data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground font-semibold transition-all duration-200"
          value="itineraries"
        >
          <LandPlot className="h-4 w-4" />
          Itineraries
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <TasksList />
      </TabsContent>
      <TabsContent value="events" className="flex flex-col gap-4">
        {/* Quick Month / Year Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/40 rounded-2xl border border-border">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs font-bold text-foreground">Jump to Date:</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Month Select */}
            <Select
              value={currentMonth.getMonth().toString()}
              onValueChange={(val) => {
                const newD = new Date(currentMonth);
                newD.setMonth(parseInt(val));
                handleMonthChange(newD);
              }}
            >
              <SelectTrigger className="h-8 w-32 text-xs font-medium bg-background">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, idx) => (
                  <SelectItem key={month} value={idx.toString()} className="text-xs">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Select */}
            <Select
              value={currentMonth.getFullYear().toString()}
              onValueChange={(val) => {
                const newD = new Date(currentMonth);
                newD.setFullYear(parseInt(val));
                handleMonthChange(newD);
              }}
            >
              <SelectTrigger className="h-8 w-24 text-xs font-medium bg-background">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()} className="text-xs">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                handleMonthChange(today);
                setSelectedDate(today);
              }}
              className="h-8 text-xs font-bold px-2.5"
            >
              Today
            </Button>
          </div>
        </div>

        <Calendar
          mode="single"
          className="rounded-md border w-full flex justify-center"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            if (date) {
              setCurrentMonth(date);
            }
          }}
          month={currentMonth}
          onMonthChange={handleMonthChange}
          modifiers={{
            hasEvent: (date) => datesWithEvents.has(dayjs(date).format("YYYY-MM-DD")),
          }}
          modifiersClassNames={{
            hasEvent: "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full aria-selected:after:bg-primary-foreground",
          }}
        />
        <EventsList
          showDefault={selectedDate === undefined}
          title={
            selectedDate === undefined
              ? isCurrentMonth
                ? "Upcoming Events"
                : `Events in ${dayjs(currentMonth).format("MMMM YYYY")}`
              : undefined
          }
          defaultNewEvent={{
            title: "",
          }}
          query={{
            dateRange,
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
