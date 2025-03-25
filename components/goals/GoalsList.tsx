import { useGoals } from "@/lib/hooks/useGoals";
import Empty from "../Empty";
import { Goal } from "lucide-react";
import GoalForm from "./GoalForm";
import usePlanner from "@/lib/hooks/usePlanner";
import GoalCard from "./GoalCard";
import { Skeleton } from "../ui/skeleton";
import ResponsiveDialogDrawer from "../ui/ResponsiveDialogDrawer";

const GoalsList = () => {
  const { data: goals, isLoading } = useGoals();
  const { selectedGoalId, setSelectedGoalId } = usePlanner();

  const isDialogOpen = (dialogId: string) => selectedGoalId === dialogId;
  const toggleDialog = (dialogId: string | null) => {
    setSelectedGoalId(selectedGoalId === dialogId ? null : dialogId);
  };

  const handleClose = () => {
    setSelectedGoalId(null);
  };

  return (
    <div className="space-y-4 mb-8">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))
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
              <ResponsiveDialogDrawer
                content={<GoalForm onClose={handleClose} goalData={goal} />}
                title={goal.title}
                handleClose={handleClose}
              />
            )}
          </div>
        ))
      )}

      {/* Add Goal Dialog */}
      {isDialogOpen("new") && (
        <ResponsiveDialogDrawer
          content={<GoalForm onClose={handleClose} />}
          title="New Goal"
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default GoalsList;
