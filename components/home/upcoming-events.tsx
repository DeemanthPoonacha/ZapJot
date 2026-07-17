"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, CalendarDays } from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";
import { useEvents } from "@/lib/hooks/useEvents";
import { Skeleton } from "../ui/skeleton";
import { EventNextOccurance } from "../planner/events/EventCard";
import usePlanner from "@/lib/hooks/usePlanner";

export function UpcomingEvents() {
  const { data: events, isLoading } = useEvents({
    limit: 3,
    onlyUpcoming: true,
  });
  const { setSelectedTab } = usePlanner();

  if (isLoading) {
    return <Skeleton className="h-40" />;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Upcoming Events</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/planner"
            onClick={() => setSelectedTab("events")}
            className="flex items-center !gap-1"
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
              className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0"
            >
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              <span className="line-clamp-1 flex-1 text-sm">{event.title}</span>
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
  );
}
