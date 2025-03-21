import { Task } from "@/types/tasks";
import { CardContent, ListCard, ListCardFooter } from "../ui/card";
import { Calendar1, Edit, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useTaskMutations } from "@/lib/hooks/useTasks";
import { cn, formatDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function TaskCard({
  task,
  onEditClick,
}: {
  task: Task;
  onEditClick: () => void;
}) {
  const { toggleTaskCompletion, toggleSubtaskCompletion } = useTaskMutations();

  const { mutateAsync: toggleTask, isPending } = toggleTaskCompletion;
  const { mutateAsync: toggleSubtask, isPending: isSubtaskPending } =
    toggleSubtaskCompletion;

  const toggleCompletion = (subtaskId?: string) => {
    try {
      if (subtaskId) {
        toggleSubtask({ task, subtaskId });
      } else toggleTask(task);
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  return (
    <ListCard key={task.id}>
      <CardContent className="px-4 py-2 gap-1">
        <div className="w-full flex justify-between items-center space-x-2">
          <span className="flex items-center space-x-2">
            <Checkbox
              disabled={isPending}
              id={task.id + "-checkbox"}
              className="cursor-pointer"
              checked={task.status === "completed"}
              onCheckedChange={() => toggleCompletion()}
            />

            <label
              htmlFor={task.id + "-checkbox"}
              className={cn(
                "font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer max-w-72 line-clamp-2",
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : ""
              )}
            >
              {task.title}
            </label>
          </span>
          <span className="flex gap-2 items-center">
            {task.highPriority && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Star className=" w-5 h-5" fill="currentColor" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>High Priority</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Button
              className="cursor-pointer"
              variant={"ghost"}
              size={"icon"}
              onClick={onEditClick}
            >
              <Edit className="w-5 h-5" />
            </Button>
          </span>
        </div>
        {!!task.subtasks.length && (
          <div className="ml-6 mt-2 space-y-2">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center space-x-2">
                <Checkbox
                  disabled={isSubtaskPending}
                  id={subtask.id + "-checkbox"}
                  className="cursor-pointer"
                  checked={subtask.status === "completed"}
                  onCheckedChange={() => toggleCompletion(subtask.id)}
                />

                <label
                  htmlFor={subtask.id + "-checkbox"}
                  className={cn(
                    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer max-w-72 line-clamp-2 text-sm",
                    subtask.status === "completed"
                      ? "line-through text-muted-foreground"
                      : ""
                  )}
                >
                  {subtask.title}
                </label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {(task.description || task.dueDate) && (
        <ListCardFooter>
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">
              {task.description}
            </span>
            {task.dueDate && (
              <span className="text-xs text-muted-foreground flex gap-1 items-center">
                <Calendar1 className="h-4 w-4" />
                <span>Due: {formatDate(task.dueDate)}</span>
              </span>
            )}
          </div>
        </ListCardFooter>
      )}
    </ListCard>
  );
}
