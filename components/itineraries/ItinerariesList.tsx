import { useItineraries } from "@/lib/hooks/useItineraries";
import { Card } from "../ui/card";
import ItineraryDetailPage from "./ItineraryDetail";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../Empty";
import { Notebook, NotepadText } from "lucide-react";

const ItineraryList = () => {
  const { data: itineraries, isLoading } = useItineraries();
  const { selectedItineraryId, setSelectedItineraryId } = usePlanner();

  if (isLoading) return <p>Loading...</p>;

  if (!itineraries?.length)
    return (
      <Empty
        icon={<NotepadText className="emptyIcon" />}
        title="No itineraries yet"
        subtitle="Add itineraries to keep track of important dates and activities"
        buttonTitle="Create First Itinerary"
        handleCreateClick={() => {}}
      />
    );

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
