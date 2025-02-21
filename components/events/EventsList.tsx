import { useEvents } from "@/lib/hooks/useEvents";
import { Card } from "../ui/card";
import { Calendar } from "../ui/calendar";

const EventsList = () => {
  const { data: events, isLoading } = useEvents();

  if (isLoading) return <div>Loading...</div>;
  if (!events || events.length === 0) return <div>No events found.</div>;

  return (
    <div className="space-y-4 p-4">
      <Card className="p-4">
        <Calendar mode="single" className="rounded-md border" />
      </Card>
      <div className="space-y-3">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{event.title}</h3>
              <span className="text-sm text-muted-foreground">
                {event.date}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsList;
