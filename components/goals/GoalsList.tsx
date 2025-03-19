import { useGoals } from "@/lib/hooks/useGoals";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import Empty from "../Empty";
import { Goal } from "lucide-react";

const GoalsList = () => {
  const { data: goals, isLoading } = useGoals();

  if (isLoading) return <div>Loading...</div>;
  if (!goals?.length)
    return (
      <Empty
        icon={<Goal className="emptyIcon" />}
        title="No goals yet"
        subtitle="Add goals to keep track of important things to achieve"
        buttonTitle="Create First Goal"
        handleCreateClick={() => {}}
      />
    );

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <Card key={goal.id} className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{goal.title}</h3>
          </div>
          <div className="space-y-2">
            <Progress value={(goal.progress / goal.objective) * 100} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Current: {goal.progress}</span>
              <span>Remaining: {goal.objective - goal.progress}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GoalsList;
