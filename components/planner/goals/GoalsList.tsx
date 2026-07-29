import { useGoals } from "@/lib/hooks/useGoals";
import Empty from "../../Empty";
import { Goal as GoalIcon, Filter } from "lucide-react";
import GoalForm from "./GoalForm";
import usePlanner from "@/lib/hooks/usePlanner";
import GoalCard from "./GoalCard";
import { Skeleton } from "../../ui/skeleton";
import ResponsiveDialogDrawer from "../../ui/ResponsiveDialogDrawer";
import { getPluralWord } from "@/lib/utils";
import { useState } from "react";
import { Goal, GoalCreate, GOAL_CATEGORIES } from "@/types/goals";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between pb-3 mb-4 border-b border-border/60">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </h2>
      <span className="text-sm text-muted-foreground font-medium">
        {count} {getPluralWord("Goal", count)}
      </span>
    </div>
  );
}

const GoalsList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [tempGoal, setTempGoal] = useState<GoalCreate>();
  const { data: goals, isLoading } = useGoals();
  const { selectedGoalId, setSelectedGoalId } = usePlanner();

  const isDialogOpen = (dialogId: string) => selectedGoalId === dialogId;
  const toggleDialog = (dialogId: string | null) => {
    setSelectedGoalId(selectedGoalId === dialogId ? null : dialogId);
  };

  const handleClose = () => {
    setSelectedGoalId(null);
    setTempGoal(undefined);
  };

  // Filter goals by selectedCategory
  const filteredGoals = goals?.filter((goal) => {
    if (selectedCategory === "all") return true;
    return goal.category === selectedCategory;
  }) || [];

  const [completedGoals, inProgressGoals] = filteredGoals.reduce(
    ([completed, inProgress], goal) =>
      goal.progress >= goal.objective
        ? [[...completed, goal], inProgress]
        : [completed, [...inProgress, goal]],
    [[], []] as [typeof filteredGoals, typeof filteredGoals],
  ) || [[], []];

  return (
    <div className="space-y-4 mb-8">
      {/* 1-Tap Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar text-xs font-semibold">
        <Badge
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          className="cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full shadow-sm gap-1 flex items-center transition-all"
        >
          <Filter className="h-3.5 w-3.5" /> All ({goals?.length || 0})
        </Badge>
        {GOAL_CATEGORIES.map((cat) => {
          const count = goals?.filter((g) => (g.category || "personal") === cat.id).length || 0;
          return (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className="cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full shadow-sm gap-1 flex items-center transition-all"
            >
              {cat.label} ({count})
            </Badge>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      ) : !goals?.length ? (
        <Empty
          icon={<GoalIcon className="emptyIcon" />}
          title="No goals yet"
          subtitle="Add goals to keep track of important things to achieve"
          buttonTitle="Create First Goal"
          handleCreateClick={() => toggleDialog("new")}
          templates={[
            {
              label: "Run 50 km",
              action: () => {
                setTempGoal({
                  title: "Monthly Fitness Goal",
                  category: "fitness",
                  objective: 50,
                  unit: "km",
                  priority: "low",
                  progress: 0,
                  createdAt: new Date().toISOString(),
                  deadline: dayjs().add(30, "day").format("YYYY-MM-DD"),
                  updatedAt: new Date().toISOString(),
                });
                toggleDialog("new");
              },
            },
            {
              label: "Read 20 Books",
              action: () => {
                setTempGoal({
                  title: "Annual Reading Goal",
                  category: "learning",
                  objective: 20,
                  unit: "books",
                  priority: "low",
                  progress: 0,
                  createdAt: new Date().toISOString(),
                  deadline: dayjs().add(1, "year").format("YYYY-MM-DD"),
                  updatedAt: new Date().toISOString(),
                });
                toggleDialog("new");
              },
            },
            {
              label: "Save $500",
              action: () => {
                setTempGoal({
                  title: "Emergency Savings",
                  category: "finance",
                  objective: 500,
                  unit: "$",
                  priority: "medium",
                  progress: 0,
                  createdAt: new Date().toISOString(),
                  deadline: dayjs().add(90, "day").format("YYYY-MM-DD"),
                  updatedAt: new Date().toISOString(),
                });
                toggleDialog("new");
              },
            },
          ]}
        />
      ) : (
        <>
          {/* In Progress Goals */}
          <div className="pb-4">
            <SectionHeader
              label="In Progress"
              count={inProgressGoals?.length ?? 0}
            />

            {inProgressGoals?.length === 0 ? (
              <p className="text-muted-foreground mb-6 text-center py-4 text-sm italic">
                No active goals matching this category
              </p>
            ) : (
              <div className="columns-1 md:columns-2 gap-4 space-y-4">
                {inProgressGoals?.map((goal) => (
                  <div key={goal.id} className="break-inside-avoid">
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
          {completedGoals?.length > 0 && (
            <div className="pb-4">
              <SectionHeader
                label="Achieved / Completed"
                count={completedGoals?.length ?? 0}
              />
              <div className="columns-1 md:columns-2 gap-4 space-y-4">
                {completedGoals?.map((goal) => (
                  <div key={goal.id} className="break-inside-avoid">
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
            </div>
          )}
        </>
      )}

      {/* Add Goal Dialog */}
      {isDialogOpen("new") && (
        <ResponsiveDialogDrawer
          content={
            <GoalForm onClose={handleClose} goalData={tempGoal as Goal} />
          }
          title="New Goal"
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default GoalsList;
