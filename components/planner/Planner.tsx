"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoalsList from "./goals/GoalsList";
import ItinerariesList from "./itineraries/ItineraryList";
import TasksList from "./tasks/TasksList";
import usePlanner from "@/lib/hooks/usePlanner";
import { useTasks } from "@/lib/hooks/useTasks";
import { useGoals } from "@/lib/hooks/useGoals";
import { useItineraries } from "@/lib/hooks/useItineraries";
import dayjs from "dayjs";
import { CalendarCheck, Goal, LandPlot, ListCheck } from "lucide-react";
import { useEvents } from "@/lib/hooks/useEvents";
import EventsTabContent from "./events/EventsTab";

/** Global Planner Pulse Summary Bar Component */
function PlannerPulseSummary() {
  const { data: tasks } = useTasks({ limit: 50 });
  const { data: events } = useEvents();
  const { data: goals } = useGoals();
  const { data: itineraries } = useItineraries();

  const completedTasks =
    tasks?.filter((t) => t.status === "completed").length || 0;
  const totalTasks = tasks?.length || 0;

  const totalGoals = goals?.length || 0;
  const avgGoalProgress =
    totalGoals > 0
      ? Math.round(
          goals!.reduce(
            (acc, g) => acc + Math.min((g.progress / g.objective) * 100, 100),
            0,
          ) / totalGoals,
        )
      : 0;

  const upcomingEventsCount =
    events?.filter((e) => {
      const dateVal = e.date ? dayjs(e.date) : dayjs(e.nextOccurrence as Date);
      return !dateVal.isBefore(dayjs().startOf("day"));
    }).length || 0;

  const itinerariesCount =
    itineraries?.filter((i) => dayjs(i.endDate).isAfter(dayjs().startOf("day")))
      .length || 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
      <div className="flex items-center gap-2.5 p-2.5 bg-card border border-border/80 rounded-2xl shadow-2xs hover:border-primary/40 transition-colors">
        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
          <ListCheck className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Tasks
          </p>
          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
            {completedTasks}/{totalTasks} Done
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 p-2.5 bg-card border border-border/80 rounded-2xl shadow-2xs hover:border-primary/40 transition-colors">
        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
          <CalendarCheck className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Events
          </p>
          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
            {upcomingEventsCount} Upcoming
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 p-2.5 bg-card border border-border/80 rounded-2xl shadow-2xs hover:border-primary/40 transition-colors">
        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
          <Goal className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Goals
          </p>
          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
            {avgGoalProgress}% Avg ({totalGoals})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 p-2.5 bg-card border border-border/80 rounded-2xl shadow-2xs hover:border-primary/40 transition-colors">
        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
          <LandPlot className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Trips
          </p>
          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
            {itinerariesCount} Active
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  const { selectedTab: activeTab, setSelectedTab: onTabChange } = usePlanner();
  return (
    <div className="w-full relative min-h-[calc(100vh-120px)] pb-20">
      {/* Planner Pulse Summary Bar */}
      <PlannerPulseSummary />

      <Tabs
        tabValues={["events", "tasks", "goals", "itineraries"]}
        value={activeTab}
        onValueChange={onTabChange}
        className="flex flex-col min-h-[75vh]"
      >
        {/* Sticky Mobile Touch Segmented Navigation Bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl pb-2 pt-1 border-b border-border/40 shrink-0">
          <TabsList className="grid w-full grid-cols-4 bg-muted/60 h-12 md:h-14 p-1 rounded-2xl border border-border/50">
            <TabsTrigger
              className="h-10 md:h-12 flex items-center justify-center gap-1.5 rounded-xl data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground font-semibold text-xs sm:text-sm transition-all duration-200"
              value="events"
            >
              <CalendarCheck className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger
              className="h-10 md:h-12 flex items-center justify-center gap-1.5 rounded-xl data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground font-semibold text-xs sm:text-sm transition-all duration-200"
              value="tasks"
            >
              <ListCheck className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger
              className="h-10 md:h-12 flex items-center justify-center gap-1.5 rounded-xl data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground font-semibold text-xs sm:text-sm transition-all duration-200"
              value="goals"
            >
              <Goal className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger
              className="h-10 md:h-12 flex items-center justify-center gap-1.5 rounded-xl data-[state=active]:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground font-semibold text-xs sm:text-sm transition-all duration-200"
              value="itineraries"
            >
              <LandPlot className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">Itineraries</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent className="flex-1 flex flex-col" value="events">
          <EventsTabContent />
        </TabsContent>
        <TabsContent className="flex-1 flex flex-col" value="tasks">
          <TasksList />
        </TabsContent>
        <TabsContent className="flex-1 flex flex-col" value="goals">
          <GoalsList />
        </TabsContent>
        <TabsContent className="flex-1 flex flex-col" value="itineraries">
          <ItinerariesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
