"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ListChecks, Circle } from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";
import { useTasks } from "@/lib/hooks/useTasks";
import { Skeleton } from "../ui/skeleton";
import usePlanner from "@/lib/hooks/usePlanner";
import { formatDate } from "@/lib/utils/date-time";

export function PendingTasks() {
  const { data: tasks, isLoading } = useTasks({
    limit: 3,
    status: "pending",
  });
  const { setSelectedTab } = usePlanner();

  if (isLoading) {
    return <Skeleton className="h-40" />;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Pending Tasks</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/planner"
            onClick={() => setSelectedTab("tasks")}
            className="flex items-center !gap-1"
          >
            All Tasks <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
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
              className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0"
            >
              <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              <span className="line-clamp-1 flex-1 text-sm">{task.title}</span>
              <span className="text-xs text-muted-foreground text-right shrink-0">
                {task.highPriority
                  ? "High Priority"
                  : task.dueDate
                    ? `Due: ${task.dueDate}`
                    : task.subtasks.length > 0
                      ? `Subtasks: ${task.subtasks.length}`
                      : task.createdAt
                        ? `Created: ${formatDate(task.createdAt)}`
                        : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
