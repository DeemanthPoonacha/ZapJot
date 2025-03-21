import { useGoals } from "@/lib/hooks/useGoals";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import Empty from "../Empty";
import { Goal } from "lucide-react";
import GoalForm from "./GoalForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import usePlanner from "@/lib/hooks/usePlanner";
import { Goal as GoalType } from "@/types/goals";
import GoalCard from "./GoalCard";

const GoalsList = () => {
  const { data: goals, isLoading } = useGoals();
  const { selectedGoalId, setSelectedGoalId } = usePlanner();

  // Helper to determine if a specific dialog is open
  const isDialogOpen = (dialogId: string) => selectedGoalId === dialogId;

  // Helper to open/close a specific dialog
  const toggleDialog = (dialogId: string | null) => {
    setSelectedGoalId(selectedGoalId === dialogId ? null : dialogId);
  };

  return (
    <div className="space-y-4">
      {/* Add/Edit Goal Dialog */}
      <Dialog
        open={selectedGoalId !== null}
        onOpenChange={(open) => toggleDialog(open ? selectedGoalId : null)}
      >
        {isDialogOpen("new") && (
          <GoalDialogContent handleClose={() => setSelectedGoalId(null)} />
        )}

        {isLoading ? (
          <div>Loading...</div>
        ) : !goals?.length ? (
          <Empty
            icon={<Goal className="emptyIcon" />}
            title="No goals yet"
            subtitle="Add goals to keep track of important things to achieve"
            buttonTitle="Create First Goal"
            handleCreateClick={() => toggleDialog("new")}
          />
        ) : (
          goals.map((goal) => (
            <div key={goal.id}>
              <GoalCard
                key={goal.id}
                goal={goal}
                onEditClick={() => toggleDialog(goal.id)}
              />
              {isDialogOpen(goal.id) && (
                <GoalDialogContent
                  handleClose={() => setSelectedGoalId(null)}
                  goal={goal}
                />
              )}
            </div>
          ))
        )}
      </Dialog>
    </div>
  );
};

function GoalDialogContent({
  goal,
  handleClose,
}: {
  goal?: GoalType;
  handleClose: () => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{goal?.title || "New Goal"}</DialogTitle>
      </DialogHeader>
      <GoalForm onClose={handleClose} goalData={goal} />
    </DialogContent>
  );
}

export default GoalsList;
