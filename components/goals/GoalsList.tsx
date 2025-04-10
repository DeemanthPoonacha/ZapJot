import { useGoals } from "@/lib/hooks/useGoals";
import Empty from "../Empty";
import { Goal } from "lucide-react";
import GoalForm from "./GoalForm";
import usePlanner from "@/lib/hooks/usePlanner";
import GoalCard from "./GoalCard";
import { Skeleton } from "../ui/skeleton";
import ResponsiveDialogDrawer from "../ui/ResponsiveDialogDrawer";
import { getPluralWord } from "@/lib/utils";

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

  const [completedGoals, inProgressGoals] = goals?.reduce(
    ([completed, inProgress], goal) =>
      goal.progress >= goal.objective
        ? [[...completed, goal], inProgress]
        : [completed, [...inProgress, goal]],
    [[], []] as [typeof goals, typeof goals]
  ) || [[], []];

  return (
    <div className="space-y-4 mb-8">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      ) : !goals?.length ? (
        <Empty
          icon={<Goal className="emptyIcon" />}
          title="No goals yet"
          subtitle="Add goals to keep track of important things to achieve"
          buttonTitle="Create First Goal"
          handleCreateClick={() => toggleDialog("new")}
        />
      ) : (
        <>
          {/* In-Progress Goals */}
          <div className="pb-12">
            <div className="flex justify-between items-center pb-4">
              <span className="text-lg font-semibold">In-Progress</span>
              {`${inProgressGoals?.length} ${getPluralWord(
                "Goal",
                inProgressGoals?.length
              )}`}
            </div>
            {inProgressGoals?.length === 0 ? (
              <Empty
                icon={<Goal className="emptyIcon" />}
                title="No goals in progress"
                subtitle="Add goals to keep track of important things to achieve"
                buttonTitle="Create New Goal"
                handleCreateClick={() => toggleDialog("new")}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
                {inProgressGoals?.map((goal) => (
                  <div key={goal.id}>
                    <GoalCard
                      goal={goal}
                      onEditClick={() => toggleDialog(goal.id)}
                    />
                    {isDialogOpen(goal.id) && (
                      <ResponsiveDialogDrawer
                        content={
                          <GoalForm onClose={handleClose} goalData={goal} />
                        }
                        title={goal.title}
                        handleClose={handleClose}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Goals */}
          <div className="pb-12">
            <div className="flex justify-between items-center pb-4">
              <span className="text-lg font-semibold">Completed</span>
              {`${completedGoals?.length} ${getPluralWord(
                "Goal",
                completedGoals?.length
              )}`}
            </div>
            {completedGoals?.length === 0 ? (
              <p className="text-muted-foreground mb-6 text-center py-4 md:py-12">
                No Goals completed yet
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
                {completedGoals?.map((goal) => (
                  <div key={goal.id}>
                    <GoalCard
                      goal={goal}
                      onEditClick={() => toggleDialog(goal.id)}
                    />
                    {isDialogOpen(goal.id) && (
                      <ResponsiveDialogDrawer
                        content={
                          <GoalForm onClose={handleClose} goalData={goal} />
                        }
                        title={goal.title}
                        handleClose={handleClose}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
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
