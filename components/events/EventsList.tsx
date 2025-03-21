import { useEvents } from "@/lib/hooks/useEvents";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from "./EventForm";
import { EventCard } from "./EventCard";
import { Event, EventsFilter } from "@/types/events";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../Empty";
import { CalendarClock } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

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

  // Helper to determine if a specific dialog is open
  const isDialogOpen = (dialogId: string) => selectedEventId === dialogId;

  // Helper to open/close a specific dialog
  const toggleDialog = (dialogId: string | null) => {
    setSelectedEventId(selectedEventId === dialogId ? null : dialogId);
  };

  return (
    <div className="space-y-4">
      {/* Add/Edit Event Dialog */}
      <Dialog
        open={selectedEventId !== null}
        onOpenChange={(open) => toggleDialog(open ? selectedEventId : null)}
      >
        {isDialogOpen("new") && (
          <EventDialogContent
            handleClose={() => setSelectedEventId(null)}
            event={defaultNewEvent as Event}
          />
        )}

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
                <EventCard
                  onClick={() => toggleDialog(event.id)}
                  event={event}
                />
                {isDialogOpen(event.id) && (
                  <EventDialogContent
                    handleClose={() => setSelectedEventId(null)}
                    event={event}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </Dialog>
    </div>
  );
};

function EventDialogContent({
  event,
  handleClose,
}: {
  event?: Event;
  handleClose: () => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{event?.title || "New Event"}</DialogTitle>
      </DialogHeader>
      <EventForm onClose={handleClose} eventData={event} />
    </DialogContent>
  );
}

export default EventsList;
