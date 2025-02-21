import { useEvents } from "@/lib/hooks/useEvents";

const EventsList = () => {
  const { data: events, isLoading } = useEvents();

  if (isLoading) return <div>Loading...</div>;
  if (!events || events.length === 0) return <div>No events found.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Events</h2>
      <ul className="grid gap-4">
        {events.map((event) => (
          <li key={event.id} className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.date}</p>
            <p className="text-gray-800">{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsList;
