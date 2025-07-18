import { cn } from "@/lib/utils";
import { Calendar1, Clock, MapPin, RepeatIcon, Users } from "lucide-react";
import { CardContent, ListCard, ListCardFooter } from "../../ui/card";
import { getNextOccurrence } from "@/lib/utils/events";
import { Event, RepeatType } from "@/types/events";
import dayjs from "dayjs";
import { ALL_MONTHS, WEEK_DAYS } from "@/lib/constants";
import { Timestamp } from "firebase/firestore";
import { Link } from "@/components/layout/link/CustomLink";

export function EventCard({
  event,
  onClick,
}: {
  event: Event;
  onClick: () => void;
}) {
  const time = new Date(`${"2020-01-01"}T${event.time}:00`).toLocaleString(
    "en-IN",
    {
      hour: "numeric",
      minute: "numeric",
    }
  );

  return (
    <ListCard onClick={onClick} className="cursor-pointer">
      <CardContent className="px-4 py-2 gap-1">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-primary truncate">
            {event.title}
          </h3>

          {event.time && (
            <p
              className={cn(
                "font-medium flex gap-1 items-center",
                dayjs(event.nextOccurrence as Date).isBefore()
                  ? "line-through"
                  : ""
              )}
            >
              <Clock className="h-4 w-4" />
              <span className="truncate max-w-32">{time}</span>
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex justify-between items-center"
            //   !event.notes ? "justify-end" : ""
          )}
        >
          <div className="flex items-center text-sm font-medium justify-end text-muted-foreground">
            <RepeatIcon size={18} />
            <span className={`ml-1 max-w-64 truncate`}>
              {event.repeat === "none"
                ? "One-time"
                : formatRepeatText(event.repeat, event.repeatDays as string[])}
            </span>
          </div>
          <EventNextOccurance event={event} />
        </div>
        {event.notes && (
          <p className="text-sm text-muted-foreground flex gap-1 items-center">
            <span className="truncate text-sm italic">{event.notes}</span>
          </p>
        )}
      </CardContent>
      {(event.location || !!event.participants?.length) && (
        <ListCardFooter className="flex-col w-full">
          <div
            className={cn(
              "flex justify-between items-center w-full",
              !event.location ? "justify-end" : ""
            )}
          >
            {event.location && (
              <p className="text-sm text-muted-foreground flex gap-1 items-center">
                <MapPin className="h-4 w-4" />
                <span className="truncate max-w-32">
                  {event.location || "N/A"}
                </span>
              </p>
            )}
            {!!event.participants?.length && (
              <p className="text-sm text-muted-foreground flex gap-1 items-center">
                <Users className="h-4 w-4" />
                <span className="truncate max-w-32">
                  {event.participants.map((p, i, arr) =>
                    p.value ? (
                      <Link
                        key={p.value}
                        href={`/characters/${p.value}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                      >
                        {p.label}
                        {i < arr.length - 1 && ", "}
                      </Link>
                    ) : (
                      p.label
                    )
                  )}
                </span>
              </p>
            )}
          </div>
        </ListCardFooter>
      )}
    </ListCard>
  );
}

export const EventNextOccurance = ({
  event,
  format = "ddd, MMM D, YYYY",
  text = "",
}: {
  event: Event;
  format?: string;
  text?: string;
}) => {
  const nextOccurance = !(event.nextOccurrence as Timestamp).seconds
    ? dayjs(event.nextOccurrence as Date)
    : getNextOccurrence(event);
  return (
    <p
      className="text-sm text-muted-foreground text-Bold flex gap-1 items-center"
      title={nextOccurance?.format("ddd, MMM D, YYYY HH:mm")}
    >
      <Calendar1 className="h-4 w-4" />
      {text}
      <span
        className={cn(
          "truncate max-w-32"
          // nextOccurance?.isBefore() ? "line-through" : ""
        )}
      >
        {nextOccurance?.format(format)}
      </span>
    </p>
  );
};

const formatRepeatText = (repeat: RepeatType, repeatDays: string[]) => {
  switch (repeat) {
    case "daily":
      return "Every day";
    case "weekly":
      return `Every ${repeatDays
        .map((d) => WEEK_DAYS[parseInt(d)])
        .join(", ")}`;
    case "monthly":
      const day = repeatDays[0];
      return `Every month on the ${day}${getDaySuffix(day)}`;
    case "yearly":
      if (repeatDays[0]) {
        const [month, day] = repeatDays[0].split("-");
        return `Every year on ${
          ALL_MONTHS[parseInt(month) - 1]
        } ${day}${getDaySuffix(day)}`;
      }
      return "Yearly";
    default:
      return "";
  }
};

const getDaySuffix = (day: string) => {
  const d = parseInt(day);
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
