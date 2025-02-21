import { useGoals } from "@/lib/hooks/useGoals";
import GoalForm from "./GoalForm";
import { Button } from "@/components/ui/button";

const GoalsList = () => {
  const { data: goals, isLoading } = useGoals();

  if (isLoading) return <div>Loading...</div>;
  if (!goals || goals.length === 0) return <div>No goals found.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Goals</h2>
      <ul className="grid gap-4">
        {goals.map((goal) => (
          <li key={goal.id} className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">{goal.title}</h3>
            <p className="text-sm text-gray-600">
              {goal.deadline || "No deadline"}
            </p>
            <p className="text-gray-800">{goal.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalsList;
