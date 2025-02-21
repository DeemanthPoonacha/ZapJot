import { useItineraries } from "@/lib/hooks/useItineraries";

const ItineraryList = () => {
  const { data: itineraries, isLoading } = useItineraries();
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Goals</h2>
      <ul className="grid gap-4">
        {itineraries?.map((itinerary) => (
          <li key={itinerary.id}>
            <h3 className="text-lg font-semibold">{itinerary.title}</h3>
            <p className="text-sm text-gray-600">
              {itinerary.startDate} - {itinerary.endDate}
            </p>
            <p className="text-gray-800">{itinerary.budget}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryList;
