import { useItineraries } from "@/lib/hooks/useItineraries";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../../Empty";
import { NotepadText } from "lucide-react";
import ItineraryForm from "./ItineraryForm";
import ItineraryDetailCard from "./ItineraryDetailCard";
import { Skeleton } from "../../ui/skeleton";
import ResponsiveDialogDrawer from "../../ui/ResponsiveDialogDrawer";

const ItineraryList = () => {
  const { data: itineraries, isLoading } = useItineraries();
  const { editingItineraryId, setEditingItineraryId } = usePlanner();

  const isDialogOpen = (dialogId: string) => editingItineraryId === dialogId;
  const toggleDialog = (dialogId: string | null) => {
    setEditingItineraryId(editingItineraryId === dialogId ? null : dialogId);
  };

  const handleClose = () => {
    setEditingItineraryId(null);
  };

  return (
    <div className="space-y-4 mb-8 pb-4">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))
      ) : !itineraries?.length ? (
        <Empty
          icon={<NotepadText className="emptyIcon" />}
          title="No itineraries yet"
          subtitle="Add itineraries to keep track of important dates and activities"
          buttonTitle="Create First Itinerary"
          handleCreateClick={() => toggleDialog("new")}
        />
      ) : (
        itineraries?.map((itinerary) => (
          <div key={itinerary.id}>
            <ItineraryDetailCard
              itinerary={itinerary}
              onEditClick={() => toggleDialog(itinerary.id)}
              onDelete={() => {
                setEditingItineraryId(null);
              }}
            />
            {isDialogOpen(itinerary.id) && (
              <ResponsiveDialogDrawer
                content={
                  <ItineraryForm
                    onClose={handleClose}
                    itineraryData={itinerary}
                  />
                }
                title={itinerary.title}
                handleClose={handleClose}
              />
            )}
          </div>
        ))
      )}

      {/* Add Itinerary Dialog */}
      {isDialogOpen("new") && (
        <ResponsiveDialogDrawer
          content={<ItineraryForm onClose={handleClose} />}
          title="New Itinerary"
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default ItineraryList;
