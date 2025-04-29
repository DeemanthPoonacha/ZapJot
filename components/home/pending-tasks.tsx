"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "@/components/layout/link/CustomLink";
import { useTasks } from "@/lib/hooks/useTasks";
import { Skeleton } from "../ui/skeleton";
import usePlanner from "@/lib/hooks/usePlanner";
import { formatDate } from "@/lib/utils";

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
        <p className="text-sm text-muted-foreground text center">
          No tasks found
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex justify-between items-center">
              <span className="line-clamp-1 max-w-2/3">{task.title}</span>
              <span className="text-sm text-muted-foreground text-right">
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
