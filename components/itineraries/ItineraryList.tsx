import { useItineraries } from "@/lib/hooks/useItineraries";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../Empty";
import { NotepadText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ItineraryForm from "./ItineraryForm";
import { Itinerary } from "@/types/itineraries";
import ItineraryDetailCard from "./ItineraryDetailCard";
import { Skeleton } from "../ui/skeleton";

const ItineraryList = () => {
  const { data: itineraries, isLoading } = useItineraries();
  const { editingItineraryId, setEditingItineraryId } = usePlanner();

  // Helper to determine if a specific dialog is open
  const isDialogOpen = (dialogId: string) => editingItineraryId === dialogId;

  // Helper to open/close a specific dialog
  const toggleDialog = (dialogId: string | null) => {
    setEditingItineraryId(editingItineraryId === dialogId ? null : dialogId);
  };

  return (
    <div className="space-y-4">
      {/* View Itinerary Dialog */}
      <Dialog
        open={editingItineraryId !== null}
        onOpenChange={(open) => toggleDialog(open ? editingItineraryId : null)}
      >
        {isDialogOpen("new") && (
          <ItineraryDialogContent
            handleClose={() => setEditingItineraryId(null)}
          />
        )}
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
                <ItineraryDialogContent
                  handleClose={() => setEditingItineraryId(null)}
                  itinerary={itinerary}
                />
              )}
            </div>
          ))
        )}
      </Dialog>
    </div>
  );
};

function ItineraryDialogContent({
  itinerary,
  handleClose,
}: {
  itinerary?: Itinerary;
  handleClose: () => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{itinerary?.title || "New Itinerary"}</DialogTitle>
      </DialogHeader>
      <ItineraryForm onClose={handleClose} itineraryData={itinerary} />
    </DialogContent>
  );
}

export default ItineraryList;
