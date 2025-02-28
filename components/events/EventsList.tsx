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
  const [openDialogId, setOpenDialogId] = useState<string | null>(null); // null when no dialog is open

  if (isLoading) return <div>Loading...</div>;

  // Helper to determine if a specific dialog is open
  const isDialogOpen = (dialogId: string) => openDialogId === dialogId;

  // Helper to open/close a specific dialog
  const toggleDialog = (dialogId: string | null) => {
    setOpenDialogId(openDialogId === dialogId ? null : dialogId);
  };

  return (
    <div className="space-y-4">
      {/* Add Event Dialog */}
      <Dialog
        open={openDialogId !== null}
        onOpenChange={(open) => toggleDialog(open ? openDialogId : null)}
      >
        {addNewButton ? (
          <Button
            type="button"
            className="w-full"
            onClick={() => toggleDialog("add-event")}
          >
            {addNewButton}
          </Button>
        ) : (
          <FloatingButton
            label="Add Event"
            onClick={() => toggleDialog("add-event")}
          />
        )}
        {isDialogOpen("add-event") && (
          <EventDialogContent
            handleClose={() => setOpenDialogId(null)}
            event={defaultNewEvent as Event}
          />
        )}

        {/* Event-specific Dialogs */}
        {events?.map((event) => (
          <div key={event.id}>
            <EventCard onClick={() => toggleDialog(event.id)} event={event} />
            {isDialogOpen(event.id) && (
              <EventDialogContent
                handleClose={() => setOpenDialogId(null)}
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
