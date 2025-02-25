import { cn } from "@/lib/utils";
import { MapPin, Users } from "lucide-react";
import { Card } from "../ui/card";
import { Event } from "@/types/events";

export function EventCard({ event }: { event: Event }) {
  const date = new Date(`${event.date}`).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = new Date(`${"2020-01-01"}T${event.time}:00`).toLocaleString(
    "en-IN",
    {
      hour: "numeric",
      minute: "numeric",
    }
  );
  return (
    <Card className="p-4 gap-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl truncate">{event.title}</h3>
        <span>
          {event.date && <span className="text-sm truncate">{date}</span>}
          {event.date && event.time && <span className="mx-2">|</span>}
          {event.time && <span className="text-sm truncate">{time}</span>}
        </span>
      </div>
      {event.notes && (
        <span className="text-sm text-muted-foreground truncate">
          {event.notes}
        </span>
      )}
      {(event.location || event.participants) && (
        <div
          className={cn(
            "flex justify-between items-center",
            !event.location ? "justify-end" : ""
          )}
        >
          {event.location && (
            <p className="text-sm text-muted-foreground flex gap-1 items-center">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-32">{event.location}</span>
            </p>
          )}
          {event.participants && (
            <p className="text-sm text-muted-foreground flex gap-1 items-center">
              <Users className="h-4 w-4" />
              <span className="truncate max-w-32">{event.participants}</span>
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
