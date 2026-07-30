import { useState, useEffect } from "react";
import { Task } from "@/types/tasks";
import { CardContent, ListCard, ListCardFooter } from "../../ui/card";
import { Calendar1, Edit, Star, GripVertical } from "lucide-react";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { useTaskMutations } from "@/lib/hooks/useTasks";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/date-time";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import dayjs from "dayjs";
import { Reorder, useDragControls } from "framer-motion";

function TaskSubtaskItem({
  subtask,
  isSubtaskPending,
  toggleCompletion,
}: {
  subtask: any;
  isSubtaskPending: boolean;
  toggleCompletion: (id: string) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={subtask.id}
      value={subtask}
      dragListener={false}
      dragControls={controls}
      className="flex items-center space-x-2 bg-muted/20 hover:bg-muted/40 p-1.5 rounded-lg transition-colors group select-none"
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing p-0.5 touch-none flex items-center justify-center shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>
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
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer max-w-72 line-clamp-2 text-sm flex-1",
          subtask.status === "completed"
            ? "line-through text-muted-foreground"
            : ""
        )}
      >
        {subtask.title}
      </label>
    </Reorder.Item>
  );
}

export function TaskCard({
  task,
  onEditClick,
}: {
  task: Task;
  onEditClick: () => void;
}) {
  const { toggleTaskCompletion, toggleSubtaskCompletion, updateMutation } =
    useTaskMutations();

  const { mutateAsync: toggleTask, isPending } = toggleTaskCompletion;
  const { mutateAsync: toggleSubtask, isPending: isSubtaskPending } =
    toggleSubtaskCompletion;

  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  useEffect(() => {
    setSubtasks(task.subtasks || []);
  }, [task.subtasks]);

  const toggleCompletion = (subtaskId?: string) => {
    try {
      if (subtaskId) {
        toggleSubtask({ task, subtaskId });
      } else toggleTask(task);
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleSubtasksReorder = (newSubtasks: typeof subtasks) => {
    setSubtasks(newSubtasks);
    const { id, ...taskData } = task;
    updateMutation.mutate({
      id: task.id,
      data: {
        ...taskData,
        subtasks: newSubtasks,
      },
    });
  };

  return (
    <ListCard
      key={task.id}
      className={cn(
        task.highPriority
          ? "bg-gradient-to-r from-primary/20 via-card to-card border-l-primary"
          : ""
      )}
    >
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

          <span className="flex items-center gap-1">
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
              className="cursor-pointer h-7 w-7"
              variant="ghost"
              size="icon"
              onClick={onEditClick}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </span>
        </div>

        {/* Drag & Drop Reorderable Subtasks List */}
        {!!subtasks?.length && (
          <Reorder.Group
            axis="y"
            values={subtasks}
            onReorder={handleSubtasksReorder}
            className="ml-2 mt-2 space-y-1.5"
          >
            {subtasks.map((subtask) => (
              <TaskSubtaskItem
                key={subtask.id}
                subtask={subtask}
                isSubtaskPending={isSubtaskPending}
                toggleCompletion={toggleCompletion}
              />
            ))}
          </Reorder.Group>
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
                Due:
                <span
                  className={cn(
                    "font-medium flex gap-1 items-center",
                    dayjs(task.dueDate).isBefore() ? "line-through" : ""
                  )}
                >
                  {formatDate(task.dueDate)}
                </span>
              </span>
            )}
          </div>
        </ListCardFooter>
      )}
    </ListCard>
  );
}
