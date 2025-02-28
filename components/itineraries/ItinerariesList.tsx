import { useItineraries } from "@/lib/hooks/useItineraries";
import { Card } from "../ui/card";
import { useState } from "react";
import { Itinerary } from "@/types/itineraries";
import ItineraryDetailPage from "./ItineraryDetail";

const ItineraryList = ({ selectedId }: { selectedId?: string }) => {
  const { data: itineraries, isLoading } = useItineraries();
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(
    null
  );
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-3">
      {!selectedItinerary ? (
        itineraries?.map((itinerary) => (
          <Card
            key={itinerary.id}
            className="p-4"
            onClick={() => setSelectedItinerary(itinerary)}
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
        <ItineraryDetailPage />
      )}
    </div>
  );
};

export default ItineraryList;
