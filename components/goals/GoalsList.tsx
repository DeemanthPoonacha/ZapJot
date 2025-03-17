import { useGoals } from "@/lib/hooks/useGoals";
import GoalForm from "./GoalForm";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";

const GoalsList = () => {
  const { data: goals, isLoading } = useGoals();

  if (isLoading) return <div>Loading...</div>;
  if (!goals || goals.length === 0) return <div>No goals found.</div>;

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
