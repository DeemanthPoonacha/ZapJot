"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  Clock,
  RepeatIcon,
  Sparkles,
} from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";
import { useEvents } from "@/lib/hooks/useEvents";
import { Skeleton } from "../ui/skeleton";
import { EventNextOccurance } from "../planner/events/EventCard";
import usePlanner from "@/lib/hooks/usePlanner";
import ResponsiveDialogDrawer from "@/components/ui/ResponsiveDialogDrawer";
import EventForm from "../planner/events/EventForm";
import { Event } from "@/types/events";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex items-center justify-between mb-4">
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
                      className="bg-primary/15 text-primary border-primary/30 uppercase tracking-widest text-[10px] font-bold px-2.5 py-0.5"
                    >
                      Event Details
                    </Badge>
                    {previewEvent.repeat && previewEvent.repeat !== "none" && (
                      <Badge
                        variant="outline"
                        className="bg-primary/20 text-primary border-primary/40 font-bold text-[10px] px-2.5 py-0.5 flex items-center gap-1"
                      >
                        <RepeatIcon className="w-3 h-3" /> Repeating ({previewEvent.repeat})
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
                    {previewEvent.title}
                  </h3>

                  <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-primary">
                    <Clock className="h-4 w-4 shrink-0" />
                    <EventNextOccurance
                      text="Next occurrence: "
                      event={previewEvent}
                      format="ddd, MMM D, YYYY at hh:mma"
                    />
                  </div>
                </div>
              </div>

              {/* Event Notes Card */}
              {previewEvent.notes && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Notes & Information
                  </span>
                  <div className="text-sm text-foreground bg-card p-4 rounded-xl border border-border leading-relaxed whitespace-pre-wrap">
                    {previewEvent.notes}
                  </div>
                </div>
              )}

              {/* Location Card */}
              {previewEvent.location && (
                <div className="flex items-center gap-3 text-sm bg-card p-3 rounded-xl border border-border">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">Location</span>
                    <strong className="text-foreground font-semibold">{previewEvent.location}</strong>
                  </div>
                </div>
              )}

              {/* Participants */}
              {!!previewEvent.participants?.length && (
                <div className="space-y-2 bg-card p-4 rounded-2xl border border-border">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" /> Participants ({previewEvent.participants.length})
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {previewEvent.participants.map((participant) => (
                      <Badge
                        key={participant.value || participant.label}
                        variant="secondary"
                        className="bg-muted text-foreground border border-border/60 px-3 py-1 rounded-xl text-xs font-semibold"
                      >
                        {participant.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setIsEditingEvent(true)}
                  className="gap-2 text-xs font-semibold rounded-xl border-border hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" /> Edit Event
                </Button>

                <Button
                  variant="default"
                  size="default"
                  onClick={() => setPreviewEvent(null)}
                  className="text-xs font-bold rounded-xl bg-gradient-primary text-primary-foreground px-6 shadow-md"
                >
                  Close
                </Button>
              </div>
            </div>
          }
        />
      )}

      {/* Event Edit Form Dialog */}
      {previewEvent && isEditingEvent && (
        <ResponsiveDialogDrawer
          title={`Edit Event: ${previewEvent.title}`}
          handleClose={() => {
            setIsEditingEvent(false);
            setPreviewEvent(null);
          }}
          content={
            <EventForm
              onClose={() => {
                setIsEditingEvent(false);
                setPreviewEvent(null);
              }}
              eventData={previewEvent}
            />
          }
        />
      )}
    </>
  );
}
