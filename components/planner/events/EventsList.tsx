"use client";
import { useEvents, useEventsOccurrenceMutations } from "@/lib/hooks/useEvents";
import { Button } from "@/components/ui/button";
import EventForm from "./EventForm";
import { EventCard } from "./EventCard";
import { Event, EventsFilter } from "@/types/events";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../../Empty";
import { CalendarClock, RefreshCw } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import ResponsiveDialogDrawer from "../../ui/ResponsiveDialogDrawer";
import { getPluralWord } from "@/lib/utils";
import { groupEventsByDate } from "@/lib/utils/events";
import { useEffect } from "react";
import dayjs from "dayjs";

const EventList = ({
  query,
  addNewButton,
  defaultNewEvent,
  showDefault,
  groupByDate = true,
}: {
  showDefault?: boolean;
  query?: EventsFilter;
  addNewButton?: React.ReactNode;
  defaultNewEvent?: Partial<Event>;
  groupByDate?: boolean;
}) => {
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
    <div className="flex justify-between items-center gap-2">
      <span className="text-lg font-semibold">
        Events/Reminders - {events?.length}
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
      title="No events yet"
      subtitle="Add events to keep track of important dates and milestones"
      buttonTitle="Create First Event"
    />
  );

  return (
    <div className="py-6">
      <div className="space-y-4 mb-8">
        {showDefault && (
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <span className="text-lg font-semibold">Upcoming Events</span>
            <Button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshPending}
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        )}
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))
        ) : groupByDate ? (
          <GroupedEvents
            {...{
              events,
              toggleDialog,
              newButton,
              handleClose,
              query,
              emptyPrompt,
              selectedEventId,
            }}
          />
        ) : (
          <>
            {newButton}
            {!events?.length ? (
              emptyPrompt
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
                {events.map((event) => (
                  <div key={event.id}>
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => toggleDialog(event.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
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
  toggleDialog,
  newButton,
  query,
  emptyPrompt,
}: {
  events?: Event[];
  query?: EventsFilter;
  newButton: React.ReactNode;
  emptyPrompt: React.ReactNode;
  toggleDialog: (dialogId: string | null) => void;
}) {
  const groupedEvents = !!events?.length
    ? groupEventsByDate(events!, query?.dateRange?.start, query?.dateRange?.end)
    : {};

  return !Object.keys(groupedEvents)?.length ? (
    emptyPrompt
  ) : (
    <>
      {newButton}
      {Object.entries(groupedEvents)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, events]) => (
          <div key={date} className="mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">
                {dayjs(date).format("ddd, MMMM D, YYYY")}
              </h2>
              {`${events.length} ${getPluralWord("Event", events.length)}`}
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
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
    </>
  );
}
