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
import FloatingButton from "../ui/floating-button";
import { Event, EventsFilter } from "@/types/events";
import { useState } from "react";
import usePlanner from "@/lib/hooks/usePlanner";

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

  if (isLoading) return <div>Loading...</div>;

  // Helper to determine if a specific dialog is open
  const isDialogOpen = (dialogId: string) => selectedEventId === dialogId;

  // Helper to open/close a specific dialog
  const toggleDialog = (dialogId: string | null) => {
    setSelectedEventId(selectedEventId === dialogId ? null : dialogId);
  };

  return (
    <div className="space-y-4">
      {!!addNewButton && (
        <Button
          type="button"
          className="w-full"
          onClick={() => toggleDialog("new")}
        >
          {addNewButton}
        </Button>
      )}
      {/* Add Event Dialog */}
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

        {/* Event-specific Dialogs */}
        {events?.map((event) => (
          <div key={event.id}>
            <EventCard onClick={() => toggleDialog(event.id)} event={event} />
            {isDialogOpen(event.id) && (
              <EventDialogContent
                handleClose={() => setSelectedEventId(null)}
                event={event}
              />
            )}
          </div>
        ))}
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
