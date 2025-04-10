"use client";
import { useEvents, useEventsOccurrenceMutations } from "@/lib/hooks/useEvents";
import { Button } from "@/components/ui/button";
import EventForm from "./EventForm";
import { EventCard } from "./EventCard";
import { Event, EventsFilter } from "@/types/events";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../Empty";
import { CalendarClock, RefreshCw } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import ResponsiveDialogDrawer from "../ui/ResponsiveDialogDrawer";
import {
  getNextOccurrence,
  getPluralWord,
  groupEventsByDate,
} from "@/lib/utils";
import { useEffect } from "react";
import dayjs from "dayjs";

const EventList = ({
  query,
  addNewButton,
  defaultNewEvent,
  showDefault,
}: {
  showDefault?: boolean;
  query?: EventsFilter;
  addNewButton?: React.ReactNode;
  defaultNewEvent?: Partial<Event>;
}) => {
  console.log("🚀 ~ EventsList ~ query:", query);
  const { data: events, isLoading } = useEvents(query);
  const { selectedEventId, setSelectedEventId } = usePlanner();

  const { updateMutation } = useEventsOccurrenceMutations();
  const { mutateAsync, isPending } = updateMutation;

  const isDialogOpen = (dialogId: string) => selectedEventId === dialogId;
  const toggleDialog = (dialogId: string | null) => {
    setSelectedEventId(selectedEventId === dialogId ? null : dialogId);
  };

  const groupedEvents = !!events?.length
    ? groupEventsByDate(events!, query?.dateRange?.start, query?.dateRange?.end)
    : {};

  console.log("🚀 ~ groupedEvents:", groupedEvents);
  const handleClose = () => {
    setSelectedEventId(null);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    const updatedEvents = events?.map((event) => ({
      id: event.id,
      nextOccurrence: getNextOccurrence(event)?.toDate(),
    }));
    if (updatedEvents) {
      mutateAsync(updatedEvents as { id: string; nextOccurrence: Date }[]);
    }
  };

  return (
    <div className="py-6">
      <div className="space-y-4 mb-8">
        {showDefault && (
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <span className="text-lg font-semibold">Upcoming Events</span>
            <Button type="button" onClick={handleRefresh} disabled={isPending}>
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        )}
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))
        ) : !Object.keys(groupedEvents)?.length ? (
          <Empty
            icon={<CalendarClock className="emptyIcon" />}
            handleCreateClick={() => toggleDialog("new")}
            title="No events yet"
            subtitle="Add events to keep track of important dates and milestones"
            buttonTitle="Create First Event"
          />
        ) : (
          <>
            {!!addNewButton && (
              <Button
                type="button"
                className="w-full"
                onClick={() => toggleDialog("new")}
              >
                {addNewButton}
              </Button>
            )}
            {Object.entries(groupedEvents)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, events]) => (
                <div key={date} className="mb-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl">
                      {dayjs(date).format("ddd, MMMM D, YYYY")}
                    </h2>
                    {`${events.length} ${getPluralWord(
                      "Event",
                      events.length
                    )}`}
                  </div>
                  {!events.length ? (
                    <p className="text-muted-foreground mb-6 text-center py-4">
                      No Events Found
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
                      {events
                        ?.sort(({ time: a }, { time: b }) => a.localeCompare(b))
                        .map((event) => (
                          <div key={event.id}>
                            <EventCard
                              onClick={() => toggleDialog(event.id)}
                              event={event}
                            />
                            {isDialogOpen(event.id) && (
                              <ResponsiveDialogDrawer
                                content={
                                  <EventForm
                                    onClose={handleClose}
                                    eventData={event}
                                  />
                                }
                                title={event.title}
                                handleClose={handleClose}
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
          </>
        )}

        {/* Add Event Dialog */}
        {isDialogOpen("new") && (
          <ResponsiveDialogDrawer
            content={
              <EventForm
                onClose={handleClose}
                eventData={defaultNewEvent as Event}
              />
            }
            title="New Event"
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default EventList;
