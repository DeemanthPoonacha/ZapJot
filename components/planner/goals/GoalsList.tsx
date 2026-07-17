import { useGoals } from "@/lib/hooks/useGoals";
import Empty from "../../Empty";
import { Goal } from "lucide-react";
import GoalForm from "./GoalForm";
import usePlanner from "@/lib/hooks/usePlanner";
import GoalCard from "./GoalCard";
import { Skeleton } from "../../ui/skeleton";
import ResponsiveDialogDrawer from "../../ui/ResponsiveDialogDrawer";
import { getPluralWord } from "@/lib/utils";

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between pb-3 mb-4 border-b border-border/60">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </h2>
      <span className="text-sm text-muted-foreground">
        {count} {getPluralWord("Goal", count)}
      </span>
    </div>
  );
}

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
    [[], []] as [typeof goals, typeof goals],
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
            <SectionHeader
              label="In Progress"
              count={inProgressGoals?.length ?? 0}
            />
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
            <SectionHeader
              label="Completed"
              count={completedGoals?.length ?? 0}
            />
            {completedGoals?.length === 0 ? (
              <p className="text-muted-foreground mb-6 text-center py-4 md:py-12 text-sm">
                No goals completed yet
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
