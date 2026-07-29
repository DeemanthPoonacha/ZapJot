"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  Clock,
  RepeatIcon,
  Sparkles,
  Plus,
  LoaderCircle,
} from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";
import { useEvents, useEventMutations } from "@/lib/hooks/useEvents";
import { Skeleton } from "../ui/skeleton";
import { EventNextOccurance } from "../planner/events/EventCard";
import usePlanner from "@/lib/hooks/usePlanner";
import ResponsiveDialogDrawer from "@/components/ui/ResponsiveDialogDrawer";
import EventForm from "../planner/events/EventForm";
import { Event } from "@/types/events";
import { Badge } from "@/components/ui/badge";
import { toast } from "../ui/sonner";
import dayjs from "dayjs";

function HomeQuickAddEventBar() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [time, setTime] = useState(
    dayjs().add(1, "hour").minute(0).second(0).format("HH:mm"),
  );
  const { addMutation } = useEventMutations();

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || addMutation.isPending) return;

    try {
      await addMutation.mutateAsync({
        title: title.trim(),
        date,
        time: time || "09:00",
        repeat: "none",
        repeatDays: [],
        nextOccurrence: dayjs(`${date}T${time || "09:00"}`).toDate(),
        nextNotificationAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success("Event added successfully");
      setTitle("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add event");
    }
  };

  return (
    <form
      onSubmit={handleQuickAdd}
      className="flex items-center gap-2 p-1.5 bg-muted/40 border border-border/80 rounded-xl focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all mb-4"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quick add event..."
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-xs sm:text-sm h-8 flex-1 px-2.5"
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="h-8 text-xs w-28 rounded-xl bg-background border-border p-1"
      />
      <Input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="h-8 text-xs w-20 rounded-xl bg-background border-border p-1"
      />
      <Button
        type="submit"
        size="sm"
        disabled={!title.trim() || addMutation.isPending}
        className="h-8 text-xs font-bold rounded-xl px-3 bg-gradient-primary text-primary-foreground shrink-0"
      >
        {addMutation.isPending ? (
          <LoaderCircle className="h-3 w-3 animate-spin" />
        ) : (
          <Plus className="h-3.5 w-3.5" />
        )}
      </Button>
    </form>
  );
}

export function UpcomingEvents() {
  const { data: events, isLoading } = useEvents({
    limit: 5,
    onlyUpcoming: true,
  });
  const { setSelectedTab } = usePlanner();
  const [previewEvent, setPreviewEvent] = useState<Event | null>(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-40" />;
  }

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm sm:text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Upcoming Events
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/planner"
              onClick={() => setSelectedTab("events")}
              className="flex items-center !gap-1 text-xs"
            >
              All Events <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* 1-Line Quick Add Event Bar */}
        <HomeQuickAddEventBar />

        {!events?.length ? (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
            <CalendarDays className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Nothing on the horizon yet.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => setPreviewEvent(event)}
                className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0 cursor-pointer hover:bg-muted/50 px-2.5 rounded-xl transition-all duration-150 group"
              >
                <CalendarDays className="h-4 w-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="line-clamp-1 flex-1 text-sm font-medium group-hover:text-foreground">
                  {event.title}
                </span>
                <span className="text-xs text-muted-foreground text-right shrink-0">
                  <EventNextOccurance
                    text="Next on "
                    event={event}
                    format="D MMM, hh:mma"
                  />
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Premium Event Preview Card Modal using strict theme colors */}
      {previewEvent && !isEditingEvent && (
        <ResponsiveDialogDrawer
          title=""
          handleClose={() => setPreviewEvent(null)}
          content={
            <div className="space-y-5 pt-1 pb-2">
              {/* Theme Ambient Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-ambient p-5 border border-border/80 shadow-lg">
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary border-primary/30 font-semibold"
                    >
                      <RepeatIcon className="w-3 h-3 mr-1" />
                      {previewEvent.repeat || "One-time"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingEvent(true)}
                      className="h-8 gap-1.5 rounded-xl bg-background/80 hover:bg-background"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    {previewEvent.title}
                  </h2>
                  {previewEvent.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {previewEvent.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Date & Time
                  </span>
                  <p className="font-semibold text-foreground">
                    <EventNextOccurance
                      event={previewEvent}
                      format="ddd, MMM D • h:mm A"
                    />
                  </p>
                </div>

                {previewEvent.location && (
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Location
                    </span>
                    <p className="font-semibold text-foreground truncate">
                      {previewEvent.location}
                    </p>
                  </div>
                )}
              </div>

              {/* Participants */}
              {previewEvent.participants &&
                previewEvent.participants.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary" />{" "}
                      Participants
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {previewEvent.participants.map((p, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {p.label || p.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          }
        />
      )}

      {/* Edit Form Modal */}
      {previewEvent && isEditingEvent && (
        <ResponsiveDialogDrawer
          title="Edit Event"
          handleClose={() => {
            setIsEditingEvent(false);
            setPreviewEvent(null);
          }}
          content={
            <EventForm
              eventData={previewEvent}
              onClose={() => {
                setIsEditingEvent(false);
                setPreviewEvent(null);
              }}
            />
          }
        />
      )}
    </>
  );
}
