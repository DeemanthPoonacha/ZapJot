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
import { getNextOccurrence } from "@/lib/utils";
import { useEffect } from "react";

const EventsList = ({
  query,
  addNewButton,
  defaultNewEvent,
}: {
  query?: EventsFilter;
  addNewButton?: React.ReactNode;
  defaultNewEvent?: Partial<Event>;
}) => {
  console.log("🚀 ~ EventsList ~ query:", query);
  const { data: events, isLoading } = useEvents(query);
  const { selectedEventId, setSelectedEventId } = usePlanner();

  const { updateMutation } = useEventsOccurrenceMutations();

  const isDialogOpen = (dialogId: string) => selectedEventId === dialogId;
  const toggleDialog = (dialogId: string | null) => {
    setSelectedEventId(selectedEventId === dialogId ? null : dialogId);
  };

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
      updateMutation.mutate(
        updatedEvents as { id: string; nextOccurrence: Date }[]
      );
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Upcoming Events</span>
        <Button type="button" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))
      ) : !events?.length ? (
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
          {events?.map((event) => (
            <div key={event.id}>
              <EventCard onClick={() => toggleDialog(event.id)} event={event} />
              {isDialogOpen(event.id) && (
                <ResponsiveDialogDrawer
                  content={
                    <EventForm onClose={handleClose} eventData={event} />
                  }
                  title={event.title}
                  handleClose={handleClose}
                />
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
  );
};

export default EventsList;
