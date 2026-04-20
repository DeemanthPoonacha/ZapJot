"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
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
    <Card className="p-5 glass-panel shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-lg tracking-tight">Upcoming Events</h2>
        <Button variant="ghost" size="sm" asChild className="group text-muted-foreground hover:text-foreground">
          <Link
            href="/planner"
            onClick={() => setSelectedTab("events")}
            className="flex items-center !gap-1"
          >
            All <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
      {!events?.length ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No events found
        </p>
      ) : (
        <div className="space-y-1">
          {events.map((event) => (
            <div key={event.id} className="group flex justify-between items-center p-3 -mx-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer">
              <span className="line-clamp-1 max-w-2/3 font-medium text-sm text-foreground/90">{event.title}</span>
              <span className="text-xs font-medium text-muted-foreground shrink-0 pl-4">
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
