import { useItineraries } from "@/lib/hooks/useItineraries";
import { Card } from "../ui/card";

const ItineraryList = () => {
  const { data: itineraries, isLoading } = useItineraries();
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-3">
      {itineraries?.map((itinerary) => (
        <Card key={itinerary.id} className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{itinerary.title}</h3>
            <span className="text-sm text-muted-foreground">
              {itinerary.startDate}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ItineraryList;
