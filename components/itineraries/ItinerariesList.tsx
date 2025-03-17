import { useItineraries } from "@/lib/hooks/useItineraries";
import { Card } from "../ui/card";
import ItineraryDetailPage from "./ItineraryDetail";
import usePlanner from "@/lib/hooks/usePlanner";

const ItineraryList = () => {
  const { data: itineraries, isLoading } = useItineraries();
  const { selectedItineraryId, setSelectedItineraryId } = usePlanner();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-3">
      {!selectedItineraryId ? (
        itineraries?.map((itinerary) => (
          <Card
            key={itinerary.id}
            className="p-4"
            onClick={() => setSelectedItineraryId(itinerary.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{itinerary.title}</h3>
              <span className="text-sm text-muted-foreground">
                {itinerary.startDate}
              </span>
            </div>
          </Card>
        ))
      ) : (
        <ItineraryDetailPage id={selectedItineraryId} />
      )}
    </div>
  );
};

export default ItineraryList;
