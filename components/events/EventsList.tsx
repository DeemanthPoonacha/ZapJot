import { useEvents } from "@/lib/hooks/useEvents";
import { Card } from "../ui/card";
import { Calendar } from "../ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EventForm from "./EventForm";
import { EventCard } from "./EventCard";
import FloatingButton from "../ui/floating-button-planner";
import { Event } from "@/types/events";
import { useState } from "react";
const EventsList = () => {
  const { data: events, isLoading } = useEvents();
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
        <FloatingButton
          label="Add Event"
          onClick={() => toggleDialog("add-event")}
        />
        {isDialogOpen("add-event") && (
          <EventDialogContent handleClose={() => setOpenDialogId(null)} />
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
