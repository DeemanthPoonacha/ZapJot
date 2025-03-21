import { Goal } from "@/types/goals";
import { Progress } from "@radix-ui/react-progress";
import { Card, ListCard } from "../ui/card";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";

export default function GoalCard({
  goal,
  onEditClick,
}: {
  goal: Goal;
  onEditClick: () => void;
}) {
  return (
    <ListCard className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{goal.title}</h3>

        <Button
          className="cursor-pointer"
          variant={"ghost"}
          size={"icon"}
          onClick={onEditClick}
        >
          <Edit className="w-5 h-5" />
        </Button>
      </div>
      <div className="space-y-2">
        <Progress value={(goal.progress / goal.objective) * 100} />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Current: {goal.progress}</span>
          <span>Remaining: {goal.objective - goal.progress}</span>
        </div>
      </div>
    </ListCard>
  );
}
