import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Calendar,
  Target,
  CircleCheckBig,
  Hourglass,
  Minus,
  Plus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Goal } from "@/types/goals";
import { useGoalMutations } from "@/lib/hooks/useGoals";
import { useState } from "react";

export default function QuickEdit({ goal }: { goal: Goal }) {
  const { updateMutation } = useGoalMutations();
  const { mutateAsync: updateGoal, isPending } = updateMutation;

  const [objective, setObjective] = useState(goal.objective);
  const [progress, setProgress] = useState(goal.progress);

  const handleSave = () => {
    updateGoal({
      id: goal.id,
      data: {
        ...goal,
        objective,
        progress,
      },
    });
  };
  const delta = Math.floor(goal.objective / 20);
  const remaining = objective - progress;

  const handleObjectiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setObjective(value);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setProgress(value);
    }
  };

  const incrementObjective = () => setObjective(objective + delta);
  const decrementObjective = () => {
    if (objective - delta > 1) setObjective(objective - delta);
  };

  const incrementProgress = () => setProgress(progress + delta);
  const decrementProgress = () => {
    if (progress - delta > 0) setProgress(progress - delta);
  };

  return (
    <div className="space-y-3">
      <h5 className="font-semibold text-sm">Quick edit</h5>
      {/* {!!goal.deadline && (
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="flex gap-1">
            <Calendar className="w-4 h-4" />
            Deadline
          </span>
          <span className="font-semibold">{formatDate(goal.deadline)}</span>
        </div>
      )} */}
      <div className="flex items-center justify-between gap-2 w-full">
        <span className="flex gap-1">
          <Target className="w-4 h-4" />
          Objective
        </span>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={decrementObjective}
            disabled={isPending || objective - delta <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={objective}
            onChange={handleObjectiveChange}
            className="p-0 text-sm h-8 w-16 rounded-none text-center"
            disabled={isPending}
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            disabled={isPending}
            onClick={incrementObjective}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <span className="ml-2">{goal.unit}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 w-full">
        <span className="flex gap-1">
          <CircleCheckBig className="w-4 h-4" />
          Current Progress
        </span>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={decrementProgress}
            disabled={isPending || progress - delta <= 0}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={progress}
            onChange={handleProgressChange}
            className="p-0 text-sm h-8 w-16 rounded-none text-center"
            disabled={isPending}
            min="0"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            disabled={isPending}
            onClick={incrementProgress}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <span className="ml-2">{goal.unit}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 w-full border-t pt-2">
        <span className="flex gap-1">
          <Hourglass className="w-4 h-4" />
          Remaining
        </span>
        <span className="font-semibold text-sm">
          {remaining} {goal.unit}
        </span>
      </div>
      <div className="flex items-center justify-end gap-2 w-full mb-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setObjective(goal.objective);
            setProgress(goal.progress);
          }}
          disabled={isPending}
        >
          Reset
        </Button>
        <Button
          onClick={handleSave}
          size="sm"
          className=""
          disabled={isPending}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
