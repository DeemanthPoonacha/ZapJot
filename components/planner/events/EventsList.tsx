"use client";

import { useState, useEffect } from "react";
import { useEvents, useEventsOccurrenceMutations } from "@/lib/hooks/useEvents";
import { Button } from "@/components/ui/button";
import EventForm from "./EventForm";
import { EventCard } from "./EventCard";
import { Event, EventsFilter } from "@/types/events";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../../Empty";
import { CalendarClock, RefreshCw, CheckCircle2 } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import ResponsiveDialogDrawer from "../../ui/ResponsiveDialogDrawer";
import { getPluralWord } from "@/lib/utils";
import { groupEventsByDate } from "@/lib/utils/events";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

const EventList = ({
  query,
  addNewButton,
  defaultNewEvent,
  showDefault,
  groupByDate = true,
  title,
}: {
  showDefault?: boolean;
  query?: EventsFilter;
  addNewButton?: React.ReactNode;
  defaultNewEvent?: Partial<Event>;
  groupByDate?: boolean;
  title?: string;
}) => {
  const [includeCompleted, setIncludeCompleted] = useState(false);
  const { data: events, isLoading } = useEvents(query);
  const { selectedEventId, setSelectedEventId } = usePlanner();
  const selectedEvent =
    !!selectedEventId &&
    (selectedEventId === "new"
      ? (defaultNewEvent as Event)
      : events?.find((event) => event.id === selectedEventId));

  const { mutateAsync: refreshOccurrences, isPending: isRefreshPending } =
    useEventsOccurrenceMutations().updateMutation;

  const toggleDialog = (dialogId: string | null) => {
    setSelectedEventId(selectedEventId === dialogId ? null : dialogId);
  };

  const handleClose = () => {
    setSelectedEventId(null);
  };

  useEffect(() => {
    handleRefresh();
  }, [events?.length]);

  const handleRefresh = () => {
    refreshOccurrences();
  };

  const newButton = !!addNewButton && (
    <div className="flex justify-between items-center gap-2 pb-3 mb-4 border-b border-border/60">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Events/Reminders — {events?.length}
      </span>
      <Button type="button" onClick={() => toggleDialog("new")}>
        {addNewButton}
      </Button>
    </div>
  );

  const emptyPrompt = (
    <Empty
      icon={<CalendarClock className="emptyIcon" />}
      handleCreateClick={() => toggleDialog("new")}
      title="No events found"
      subtitle="Add events to keep track of important dates and milestones"
      buttonTitle="Create First Event"
    />
  );

  return (
    <div className="py-2">
      <div className="space-y-4 mb-8">
        {/* Header Bar with Refresh & Styled Badge Toggle */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4 border-b border-border/50 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {title || "Events"}
          </span>

          <div className="flex items-center gap-2">
            <Badge
              variant={includeCompleted ? "default" : "outline"}
              onClick={() => setIncludeCompleted(!includeCompleted)}
              className="cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full shadow-sm gap-1.5 flex items-center transition-all text-xs font-semibold select-none"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Include Past Days</span>
            </Badge>

            {showDefault && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshPending}
                className="h-8 rounded-full text-xs font-semibold px-3"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        ) : !events?.length ? (
          emptyPrompt
        ) : groupByDate ? (
          <GroupedEvents
            events={events}
            includeCompleted={includeCompleted}
            toggleDialog={toggleDialog}
            newButton={newButton}
            query={query}
            emptyPrompt={emptyPrompt}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => toggleDialog(event.id)}
              />
            ))}
          </div>
        )}

        {selectedEvent && (
          <ResponsiveDialogDrawer
            content={
              <EventForm onClose={handleClose} eventData={selectedEvent} />
            }
            title={selectedEvent.title || "New Event"}
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default EventList;

function GroupedEvents({
  events,
  includeCompleted,
  toggleDialog,
  newButton,
  query,
  emptyPrompt,
}: {
  events?: Event[];
  includeCompleted: boolean;
  query?: EventsFilter;
  newButton: React.ReactNode;
  emptyPrompt: React.ReactNode;
  toggleDialog: (dialogId: string | null) => void;
}) {
  const groupedEvents = !!events?.length
    ? groupEventsByDate(events!, query?.dateRange?.start, query?.dateRange?.end)
    : {};

  const isSingleDay =
    query?.dateRange?.start &&
    query?.dateRange?.end &&
    dayjs(query.dateRange.start).isSame(dayjs(query.dateRange.end), "day");

  const todayStr = dayjs().format("YYYY-MM-DD");

  // Filter grouped days based on includeCompleted toggle state
  const filteredGroupedEvents = Object.entries(groupedEvents)
    .filter(([dateStr, dayEvents]) => {
      if (!isSingleDay && !dayEvents.length) return false;
      // If includeCompleted is false, hide past days before today
      if (!includeCompleted && !isSingleDay && dateStr < todayStr) return false;
      return true;
    })
    .sort(([a], [b]) => a.localeCompare(b));

  return !filteredGroupedEvents.length ? (
    emptyPrompt
  ) : (
    <>
      {newButton}
      {filteredGroupedEvents.map(([date, events]) => {
        const isPastDay = date < todayStr;

        return (
          <div
            key={date}
            className={`mb-6 space-y-3 ${isPastDay ? "opacity-70" : ""}`}
          >
            <div className="flex justify-between items-baseline pb-2 border-b border-dashed border-border/60">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                {dayjs(date).format("ddd, MMMM D, YYYY")}
                {isPastDay && (
                  <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    Past
                  </span>
                )}
              </h3>
              <span className="text-xs text-muted-foreground font-medium">
                {events.length} {getPluralWord("Event", events.length)}
              </span>
            </div>
            {!events.length ? (
              <p className="text-muted-foreground py-2 text-xs italic">
                No events on this day
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 items-start">
                {events
                  ?.sort(({ time: a }, { time: b }) => a.localeCompare(b))
                  .map((event) => (
                    <div key={event.id}>
                      <EventCard
                        onClick={() => toggleDialog(event.id)}
                        event={event}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
