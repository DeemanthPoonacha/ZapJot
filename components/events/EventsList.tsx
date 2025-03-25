import { useEvents } from "@/lib/hooks/useEvents";
import { Button } from "@/components/ui/button";
import EventForm from "./EventForm";
import { EventCard } from "./EventCard";
import { Event, EventsFilter } from "@/types/events";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../Empty";
import { CalendarClock } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import ResponsiveDialogDrawer from "../ui/ResponsiveDialogDrawer";

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

  const isDialogOpen = (dialogId: string) => selectedEventId === dialogId;
  const toggleDialog = (dialogId: string | null) => {
    setSelectedEventId(selectedEventId === dialogId ? null : dialogId);
  };

  const handleClose = () => {
    setSelectedEventId(null);
  };

  return (
    <div className="space-y-4 mb-8">
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
