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
  const [open, setOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <FloatingButton label="Add Event" />
        </DialogTrigger>
        <EventDialogContent setOpen={setOpen} />
      </Dialog>
      {events?.map((event) => (
        <Dialog key={event.id}>
          <div className="space-y-3">
            <DialogTrigger className="" asChild>
              <span key={event.id}>
                <EventCard event={event} />
              </span>
            </DialogTrigger>
          </div>

          <EventDialogContent setOpen={setOpen} event={event} />
        </Dialog>
      ))}
    </div>
  );
};

function EventDialogContent({
  event,
  setOpen,
}: {
  event?: Event;
  setOpen: (open: boolean) => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{event?.title || "New Event"}</DialogTitle>
        {event && (
          <DialogDescription>
            {`Event on ${event.date} at ${event.time}, ${event.location} with ${event.participants} participants`}
          </DialogDescription>
        )}
      </DialogHeader>
      <EventForm
        onSuccess={() => setOpen(false)}
        eventData={event}
        footer={
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        }
      />
    </DialogContent>
  );
}

export default EventsList;
