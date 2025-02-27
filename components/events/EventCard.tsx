import { cn } from "@/lib/utils";
import {
  Calendar,
  Calendar1,
  CalendarDays,
  CalendarIcon,
  Clock,
  MapPin,
  Notebook,
  RepeatIcon,
  Users,
} from "lucide-react";
import { Card } from "../ui/card";
import { getNextOccurrence } from "@/lib/utils"; // Adjust the import path as necessary
import { Event, RepeatType } from "@/types/events";
import dayjs from "dayjs";
import { ALL_MONTHS, WEEK_DAYS } from "@/lib/constants";
import { useCharacter } from "@/lib/hooks/useCharacters";

export function EventCard({
  event,
  onClick,
}: {
  event: Event;
  onClick: () => void;
}) {
  const nextOccurance = getNextOccurrence(event);
  const time = new Date(`${"2020-01-01"}T${event.time}:00`).toLocaleString(
    "en-IN",
    {
      hour: "numeric",
      minute: "numeric",
    }
  );
  return (
    <Card onClick={onClick} className="p-4 gap-2 cursor-pointer">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary truncate">
          {event.title}
        </h3>
        {nextOccurance && (
          <p className="text-sm text-Bold flex gap-1 items-center">
            <Calendar1 className="h-4 w-4" />
            <span
              className={cn(
                "truncate max-w-32",
                dayjs(nextOccurance).isBefore(dayjs()) ? "line-through" : ""
              )}
            >
              {nextOccurance?.format("ddd, MMM D, YYYY")}
            </span>
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

        {event.time && (
          <p className="text-sm text-muted-foreground font-medium flex gap-1 items-center">
            <Clock className="h-4 w-4" />
            <span className="truncate max-w-32">{time}</span>
          </p>
        )}
      </div>
      {(event.location || !!event.participants?.length) && (
        <div
          className={cn(
            "flex justify-between items-center"
            // !event.location ? "justify-end" : ""
          )}
        >
          {
            <p className="text-sm text-muted-foreground flex gap-1 items-center">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-32">
                {event.location || "N/A"}
              </span>
            </p>
          }
          {!!event.participants?.length && (
            <p className="text-sm text-muted-foreground flex gap-1 items-center">
              <Users className="h-4 w-4" />
              <span className="truncate max-w-32">
                {event.participants.map((participant, index, array) => (
                  <span key={participant.value}>
                    <Participant participant={participant} />
                    {index < array.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </p>
          )}
        </div>
      )}

      {event.notes && (
        <p className="text-sm text-muted-foreground flex gap-1 items-center">
          <span className="truncate text-sm italic">{event.notes}</span>
        </p>
      )}
    </Card>
  );
}

export const Participant = ({
  participant,
}: {
  participant: {
    label: string;
    value: string;
  };
}) => {
  const { data: character } = useCharacter(participant.value);
  return character?.name || participant.label;
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
