"use client";

import { useState, useMemo } from "react";
import { TabsContent } from "@/components/ui/tabs";
import EventsList from "@/components/planner/events/EventsList";
import dayjs from "dayjs";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import { useEvents } from "@/lib/hooks/useEvents";
import { groupEventsByDate } from "@/lib/utils/events";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsiveDialogDrawer from "@/components/ui/ResponsiveDialogDrawer";
import { cn } from "@/lib/utils";

type CalendarViewMode = "day" | "week" | "month";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Quick Month & Year Date Jump Dialog */
function MonthYearJumpModal({
  currentDate,
  onSelectDate,
  onClose,
}: {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i);
  const currentD = dayjs(currentDate);

  const [selectedMonth, setSelectedMonth] = useState(
    currentD.month().toString(),
  );
  const [selectedYear, setSelectedYear] = useState(currentD.year().toString());

  const handleApply = () => {
    const newD = dayjs(currentDate)
      .month(parseInt(selectedMonth))
      .year(parseInt(selectedYear))
      .toDate();
    onSelectDate(newD);
    onClose();
  };

  return (
    <div className="space-y-5 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Select Month
          </label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="h-10 text-sm font-medium bg-background border-border">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, idx) => (
                <SelectItem
                  key={month}
                  value={idx.toString()}
                  className="text-xs"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Select Year
          </label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-10 text-sm font-medium bg-background border-border">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="text-xs"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date();
            onSelectDate(today);
            onClose();
          }}
          className="text-xs font-bold rounded-xl"
        >
          Jump to Today
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleApply}
          className="text-xs font-bold rounded-xl bg-gradient-primary text-primary-foreground shadow-md px-5"
        >
          Jump to Date
        </Button>
      </div>
    </div>
  );
}

/** Custom Mobile-First Planner Calendar Component */
function CustomPlannerCalendar({
  currentDate,
  selectedDayDate,
  onDayClick,
  onNavigateDate,
  viewMode,
  onViewModeChange,
  datesWithEvents,
}: {
  currentDate: Date;
  selectedDayDate: Date | null;
  onDayClick: (date: Date) => void;
  onNavigateDate: (date: Date) => void;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  datesWithEvents: Set<string>;
}) {
  const [showJumpModal, setShowJumpModal] = useState(false);
  const currentDayjs = dayjs(currentDate);

  // Navigation handlers for Day, Week, and Month modes
  const handleNavigate = (direction: "prev" | "next") => {
    if (viewMode === "day") {
      onNavigateDate(
        direction === "prev"
          ? currentDayjs.subtract(1, "day").toDate()
          : currentDayjs.add(1, "day").toDate(),
      );
    } else if (viewMode === "week") {
      onNavigateDate(
        direction === "prev"
          ? currentDayjs.subtract(1, "week").toDate()
          : currentDayjs.add(1, "week").toDate(),
      );
    } else {
      onNavigateDate(
        direction === "prev"
          ? currentDayjs.subtract(1, "month").toDate()
          : currentDayjs.add(1, "month").toDate(),
      );
    }
  };

  // Header Title based on active View Mode
  const headerTitle = useMemo(() => {
    if (viewMode === "day") {
      return currentDayjs.format("dddd, MMM D, YYYY");
    } else if (viewMode === "week") {
      const start = currentDayjs.startOf("week");
      const end = currentDayjs.endOf("week");
      return `${start.format("MMM D")} – ${end.format("MMM D, YYYY")}`;
    } else {
      return currentDayjs.format("MMMM YYYY");
    }
  }, [viewMode, currentDayjs]);

  // Compute 7 Days for Week Mode
  const weekDays = useMemo(() => {
    const startOfWeek = currentDayjs.startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  }, [currentDayjs]);

  // Compute Month Grid Days for Month Mode
  const monthGridDays = useMemo(() => {
    const startOfMonth = currentDayjs.startOf("month");
    const endOfMonth = currentDayjs.endOf("month");
    const startGrid = startOfMonth.startOf("week");
    const endGrid = endOfMonth.endOf("week");

    const days: dayjs.Dayjs[] = [];
    let curr = startGrid;
    while (curr.isBefore(endGrid) || curr.isSame(endGrid, "day")) {
      days.push(curr);
      curr = curr.add(1, "day");
    }
    return days;
  }, [currentDayjs]);

  return (
    <>
      <div className="flex flex-col gap-3 p-3.5 bg-card border border-border/80 rounded-2xl shadow-sm">
        {/* View Mode Switcher Header Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-border/50">
          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/50">
            <Button
              type="button"
              variant={viewMode === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("day")}
              className="h-7 text-xs font-semibold rounded-lg px-2.5"
            >
              Day
            </Button>
            <Button
              type="button"
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("week")}
              className="h-7 text-xs font-semibold rounded-lg px-2.5"
            >
              Week
            </Button>
            <Button
              type="button"
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("month")}
              className="h-7 text-xs font-semibold rounded-lg px-2.5"
            >
              Month
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onNavigateDate(new Date());
              onDayClick(new Date());
            }}
            className="h-7 text-xs font-bold px-2.5 rounded-xl border-border"
          >
            Today
          </Button>
        </div>

        {/* Date Header Title (Clickable Jump Trigger) & Nav Controls */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg shrink-0"
            onClick={() => handleNavigate("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Clickable Header Title to Jump Month/Year */}
          <button
            type="button"
            onClick={() => setShowJumpModal(true)}
            title="Click to jump to any month or year"
            className="text-xs sm:text-sm font-bold text-foreground tracking-tight hover:text-primary transition-colors flex items-center gap-1 px-2.5 py-1 rounded-xl hover:bg-muted/60 cursor-pointer"
          >
            <CalendarIcon className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{headerTitle}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg shrink-0"
            onClick={() => handleNavigate("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* CALENDAR BODY */}
        {/* 1. DAY VIEW */}
        {viewMode === "day" && (
          <div className="flex items-center justify-center p-3 bg-muted/20 rounded-xl border border-border/40 text-xs text-muted-foreground font-medium">
            <CalendarIcon className="h-4 w-4 text-primary mr-2" />
            Showing events for{" "}
            <strong className="text-foreground ml-1">
              {currentDayjs.format("dddd, MMMM D")}
            </strong>
          </div>
        )}

        {/* 2. WEEK VIEW */}
        {viewMode === "week" && (
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((day) => {
              const isSelected =
                selectedDayDate && day.isSame(dayjs(selectedDayDate), "day");
              const isToday = day.isSame(dayjs(), "day");
              const dateStr = day.format("YYYY-MM-DD");
              const hasEvent = datesWithEvents.has(dateStr);

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => onDayClick(day.toDate())}
                  title={
                    isSelected
                      ? "Tap again to show full week"
                      : `Filter ${day.format("MMM D")}`
                  }
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative cursor-pointer",
                    isSelected
                      ? "bg-gradient-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/40"
                      : isToday
                        ? "bg-primary/15 text-primary font-bold border border-primary/30"
                        : "hover:bg-muted/50 text-foreground font-medium",
                  )}
                >
                  <span className="text-[10px] uppercase opacity-75">
                    {day.format("ddd")}
                  </span>
                  <span className="text-sm font-bold mt-0.5">
                    {day.format("D")}
                  </span>
                  {hasEvent && (
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full mt-1",
                        isSelected ? "bg-primary-foreground" : "bg-primary",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 3. MONTH VIEW */}
        {viewMode === "month" && (
          <div className="space-y-1">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground uppercase pb-1">
              {WEEKDAYS.map((wd) => (
                <span key={wd}>{wd}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {monthGridDays.map((day) => {
                const isCurrentMonth = day.isSame(currentDayjs, "month");
                const isSelected =
                  selectedDayDate && day.isSame(dayjs(selectedDayDate), "day");
                const isToday = day.isSame(dayjs(), "day");
                const dateStr = day.format("YYYY-MM-DD");
                const hasEvent = datesWithEvents.has(dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => onDayClick(day.toDate())}
                    title={
                      isSelected
                        ? "Tap again to show full month"
                        : `Filter ${day.format("MMM D")}`
                    }
                    className={cn(
                      "flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative cursor-pointer text-xs min-h-9",
                      !isCurrentMonth && "opacity-35 hover:opacity-75",
                      isSelected
                        ? "bg-gradient-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/40"
                        : isToday
                          ? "bg-primary/15 text-primary font-bold border border-primary/30"
                          : "hover:bg-muted/50 text-foreground font-medium",
                    )}
                  >
                    <span>{day.format("D")}</span>
                    {hasEvent && (
                      <span
                        className={cn(
                          "absolute w-1.5 h-1.5 rounded-full top-2 right-2 sm:mr-2",
                          isSelected ? "bg-primary-foreground" : "bg-primary",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Month & Year Jump Dialog */}
      {showJumpModal && (
        <ResponsiveDialogDrawer
          title="Jump to Month / Year"
          handleClose={() => setShowJumpModal(false)}
          content={
            <MonthYearJumpModal
              currentDate={currentDate}
              onSelectDate={(newD) => {
                onNavigateDate(newD);
              }}
              onClose={() => setShowJumpModal(false)}
            />
          }
        />
      )}
    </>
  );
}

export default function EventsTabContent() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");

  const currentDayjs = dayjs(currentDate);

  // Toggle day selection
  const handleDayClick = (date: Date) => {
    if (selectedDayDate && dayjs(selectedDayDate).isSame(dayjs(date), "day")) {
      setSelectedDayDate(null);
    } else {
      setSelectedDayDate(date);
      setCurrentDate(date);
    }
  };

  // Compute active dateRange for querying EventsList dynamically
  const dateRange = useMemo(() => {
    if (viewMode === "day") {
      return {
        start: currentDayjs.startOf("day").toDate(),
        end: currentDayjs.endOf("day").toDate(),
      };
    }

    if (selectedDayDate) {
      const selectedDayjs = dayjs(selectedDayDate);
      return {
        start: selectedDayjs.startOf("day").toDate(),
        end: selectedDayjs.endOf("day").toDate(),
      };
    }

    if (viewMode === "week") {
      return {
        start: currentDayjs.startOf("week").toDate(),
        end: currentDayjs.endOf("week").toDate(),
      };
    } else {
      return {
        start: currentDayjs.startOf("month").toDate(),
        end: currentDayjs.endOf("month").toDate(),
      };
    }
  }, [currentDate, selectedDayDate, viewMode]);

  // Fetch events for the visible month to show calendar event dots
  const { data: monthEvents } = useEvents({
    dateRange: {
      start: currentDayjs.startOf("month").subtract(7, "day").toDate(),
      end: currentDayjs.endOf("month").add(7, "day").toDate(),
    },
  });

  const groupedMonthEvents = monthEvents
    ? groupEventsByDate(
        monthEvents,
        currentDayjs.startOf("month").subtract(7, "day").toDate(),
        currentDayjs.endOf("month").add(7, "day").toDate(),
      )
    : {};

  const datesWithEvents = new Set(
    Object.entries(groupedMonthEvents)
      .filter(([_, evs]) => evs.length > 0)
      .map(([dateStr]) => dateStr),
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Custom Mobile-First Planner Calendar */}
      <CustomPlannerCalendar
        currentDate={currentDate}
        selectedDayDate={selectedDayDate}
        onDayClick={handleDayClick}
        onNavigateDate={(d) => {
          setCurrentDate(d);
          setSelectedDayDate(null);
        }}
        viewMode={viewMode}
        onViewModeChange={(m) => {
          setViewMode(m);
          setSelectedDayDate(null);
        }}
        datesWithEvents={datesWithEvents}
      />

      {/* Filter Indicator Bar */}
      {selectedDayDate && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/30 p-2.5 rounded-2xl text-xs font-semibold text-primary">
          <span>
            Filtered Day:{" "}
            <strong>{dayjs(selectedDayDate).format("dddd, MMM D")}</strong>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDayDate(null)}
            className="h-6 text-[11px] font-bold px-2.5 hover:bg-primary/20 rounded-xl"
          >
            Clear (Show Full {viewMode === "week" ? "Week" : "Month"})
          </Button>
        </div>
      )}

      {/* Events List Filtered Dynamic to Day / Week / Month */}
      <EventsList
        showDefault={false}
        title={
          viewMode === "day" || selectedDayDate
            ? `Events on ${dayjs(selectedDayDate || currentDate).format("MMM D, YYYY")}`
            : viewMode === "week"
              ? `Events (${currentDayjs.startOf("week").format("MMM D")} – ${currentDayjs.endOf("week").format("MMM D")})`
              : `Events in ${currentDayjs.format("MMMM YYYY")}`
        }
        defaultNewEvent={{
          title: "",
          date: dayjs(selectedDayDate || currentDate).format("YYYY-MM-DD"),
        }}
        query={{
          dateRange,
        }}
      />
    </div>
  );
}
