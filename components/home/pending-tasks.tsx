"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ListChecks,
  CheckCircle2,
  Circle,
  Calendar1,
  Star,
  Pencil,
  Check,
  Sparkles,
  Clock,
  Plus,
  LoaderCircle,
  Calendar,
} from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";
import { useTasks, useTaskMutations } from "@/lib/hooks/useTasks";
import { Skeleton } from "../ui/skeleton";
import usePlanner from "@/lib/hooks/usePlanner";
import { formatDate } from "@/lib/utils/date-time";
import { toast } from "@/components/ui/sonner";
import ResponsiveDialogDrawer from "@/components/ui/ResponsiveDialogDrawer";
import TaskForm from "../planner/tasks/TaskForm";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Task, TaskCreate } from "@/types/tasks";
import { cn } from "@/lib/utils";

// Inline Quick-Add Task Input Bar for Home Dashboard
function HomeQuickAddTaskBar() {
  const [title, setTitle] = useState("");
  const [highPriority, setHighPriority] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { addMutation } = useTaskMutations();

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const payload: TaskCreate = {
        title: title.trim(),
        highPriority,
        status: "pending",
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(dueDate ? { dueDate } : {}),
      };
      await addMutation.mutateAsync(payload);
      toast.success(`Task "${title.trim()}" added!`);
      setTitle("");
      setHighPriority(false);
      setDueDate("");
      setShowDatePicker(false);
    } catch (error) {
      console.error("Failed to add task", error);
      toast.error("Failed to add task");
    }
  };

  return (
    <form
      onSubmit={handleQuickAdd}
      className="flex items-center gap-2 p-1.5 bg-muted/40 border border-border/80 rounded-xl focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all mb-4"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quick add a task..."
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-xs sm:text-sm h-8 flex-1 px-2.5"
      />

      {showDatePicker && (
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-7 w-28 text-xs bg-background border-border px-1.5"
        />
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShowDatePicker(!showDatePicker)}
        title={dueDate ? `Due: ${dueDate}` : "Set due date"}
        className={cn(
          "h-7 w-7 rounded-lg shrink-0 transition-colors",
          dueDate
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Calendar className="h-3.5 w-3.5" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setHighPriority(!highPriority)}
        title={highPriority ? "High Priority enabled" : "Mark High Priority"}
        className={cn(
          "h-7 w-7 rounded-lg shrink-0 transition-colors",
          highPriority
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Star
          className={cn("h-3.5 w-3.5", highPriority ? "fill-primary" : "")}
        />
      </Button>

      <Button
        type="submit"
        disabled={!title.trim() || addMutation.isPending}
        size="sm"
        className="h-7 px-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-xs shrink-0 gap-1 shadow-sm"
      >
        {addMutation.isPending ? (
          <LoaderCircle className="h-3 w-3 animate-spin" />
        ) : (
          <Plus className="h-3 w-3" />
        )}
        <span className="hidden sm:inline">Add</span>
      </Button>
    </form>
  );
}

export function PendingTasks() {
  const { data: tasks, isLoading } = useTasks({
    limit: 5,
    status: "pending",
  });
  const { updateMutation, toggleSubtaskCompletion } = useTaskMutations();
  const { setSelectedTab } = usePlanner();

  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const { mutateAsync: toggleSubtask, isPending: isSubtaskPending } =
    toggleSubtaskCompletion;

  const handleToggleComplete = (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    updateMutation.mutate(
      {
        id: task.id,
        data: {
          ...task,
          status: newStatus,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "completed"
              ? `Task "${task.title}" completed!`
              : `Task "${task.title}" marked pending`,
          );
          setPreviewTask(null);
        },
        onError: () => {
          toast.error("Failed to update task");
        },
      },
    );
  };

  const handleSubtaskComplete = (subtaskId: string) => {
    try {
      if (previewTask && subtaskId) {
        toggleSubtask({ task: previewTask, subtaskId });
        setPreviewTask({
          ...previewTask,
          subtasks: previewTask.subtasks?.map((subtask) =>
            subtask.id === subtaskId
              ? {
                  ...subtask,
                  status:
                    subtask.status === "completed" ? "pending" : "completed",
                }
              : subtask,
          ),
        });
      } else throw new Error("Task or subtask not found");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to update task");
    }
  };

  if (isLoading) {
    return <Skeleton className="h-40" />;
  }

  const completedSubtasksCount =
    previewTask?.subtasks?.filter((s) => s.status === "completed").length || 0;
  const totalSubtasksCount = previewTask?.subtasks?.length || 0;
  const subtasksPercent =
    totalSubtasksCount > 0
      ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100)
      : 0;

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm sm:text-base flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" /> Pending Tasks
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/planner"
              onClick={() => setSelectedTab("tasks")}
              className="flex items-center !gap-1 text-xs"
            >
              All Tasks <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Quick Add Bar on Home Screen */}
        <HomeQuickAddTaskBar />

        {!tasks?.length ? (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
            <ListChecks className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Nothing pending — you&apos;re all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0 cursor-pointer hover:bg-muted/50 px-2.5 rounded-xl transition-all duration-150 group"
                onClick={() => setPreviewTask(task)}
              >
                <Circle className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                <span className="line-clamp-1 flex-1 text-sm font-medium group-hover:text-foreground">
                  {task.title}
                </span>
                <span className="text-xs text-muted-foreground text-right shrink-0">
                  {task.highPriority
                    ? "High Priority"
                    : task.dueDate
                      ? `Due: ${task.dueDate}`
                      : task.subtasks?.length > 0
                        ? `Subtasks: ${task.subtasks?.length}`
                        : task.createdAt
                          ? `Created: ${formatDate(task.createdAt)}`
                          : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Task Preview Card Modal using strict theme colors */}
      {previewTask && !isEditingTask && (
        <ResponsiveDialogDrawer
          title=""
          handleClose={() => setPreviewTask(null)}
          content={
            <div className="space-y-5 pt-1 pb-2">
              {/* Theme Ambient Header Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-ambient p-5 border border-border/80 shadow-lg">
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/15 text-primary border-primary/30 uppercase tracking-widest text-[10px] font-bold px-2.5 py-0.5"
                      >
                        Task Overview
                      </Badge>
                      {previewTask.highPriority && (
                        <Badge
                          variant="outline"
                          className="bg-primary/20 text-primary border-primary/40 font-bold text-[10px] px-2.5 py-0.5 flex items-center gap-1"
                        >
                          <Star className="w-3 h-3 fill-primary" /> High
                          Priority
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
                      {previewTask.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground relative z-10">
                  {previewTask.dueDate && (
                    <div className="flex items-center gap-1.5 font-medium text-foreground bg-card px-3 py-1 rounded-full border border-border">
                      <Calendar1 className="h-3.5 w-3.5 text-primary" />
                      <span>Due: {formatDate(previewTask.dueDate)}</span>
                    </div>
                  )}
                  {previewTask.createdAt && (
                    <div className="flex items-center gap-1.5 font-medium text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Created: {formatDate(previewTask.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Task Description Card */}
              {previewTask.description && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />{" "}
                    Description
                  </span>
                  <div className="text-sm text-foreground bg-card p-4 rounded-xl border border-border leading-relaxed whitespace-pre-wrap">
                    {previewTask.description}
                  </div>
                </div>
              )}

              {/* Subtasks Section */}
              {!!previewTask.subtasks?.length && (
                <div className="space-y-3 bg-card p-4 rounded-2xl border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                      Subtasks Checklist
                    </span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {completedSubtasksCount} of {totalSubtasksCount} completed
                      ({subtasksPercent}%)
                    </span>
                  </div>

                  <Progress
                    value={subtasksPercent}
                    className="h-2 rounded-full bg-muted"
                  />

                  <div className="space-y-2 pt-1 max-h-52 overflow-y-auto pr-1">
                    {previewTask.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center gap-3 text-sm bg-muted/40 p-3 rounded-xl border border-border/50"
                      >
                        <Checkbox
                          disabled={isSubtaskPending}
                          id={subtask.id + "-checkbox"}
                          className="cursor-pointer"
                          checked={subtask.status === "completed"}
                          onCheckedChange={() =>
                            handleSubtaskComplete(subtask.id)
                          }
                        />
                        <label
                          htmlFor={subtask.id + "-checkbox"}
                          className={
                            subtask.status === "completed"
                              ? "line-through text-muted-foreground font-normal cursor-pointer"
                              : "text-foreground font-medium cursor-pointer"
                          }
                        >
                          {subtask.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setIsEditingTask(true)}
                  className="gap-2 text-xs font-semibold rounded-xl border-border hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" /> Edit Task
                </Button>

                <Button
                  variant="default"
                  size="default"
                  onClick={() => handleToggleComplete(previewTask)}
                  className="gap-2 text-xs font-bold rounded-xl bg-gradient-primary text-primary-foreground shadow-md"
                >
                  <Check className="h-4 w-4" /> Mark Completed
                </Button>
              </div>
            </div>
          }
        />
      )}

      {/* Task Edit Form Dialog */}
      {previewTask && isEditingTask && (
        <ResponsiveDialogDrawer
          title={`Edit Task: ${previewTask.title}`}
          handleClose={() => {
            setIsEditingTask(false);
            setPreviewTask(null);
          }}
          content={
            <TaskForm
              taskData={previewTask}
              onClose={() => {
                setIsEditingTask(false);
                setPreviewTask(null);
              }}
            />
          }
        />
      )}
    </>
  );
}
