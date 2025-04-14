"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
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
        <p className="text-sm text-muted-foreground text center">
          No events found
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex justify-between items-center">
              <span>{event.title}</span>
              <span className="text-sm text-muted-foreground">
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
