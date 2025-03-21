"use client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthProvider";
import { Skeleton } from "../ui/skeleton";
import { useTasks } from "@/lib/hooks/useTasks";
import { useGoals } from "@/lib/hooks/useGoals";

export function HomeHeader() {
  const { user, loading } = useAuth();
  const { data: tasks, isLoading: taskLoading } = useTasks();
  const { data: goals, isLoading: goalLoading } = useGoals();

  if (loading) return <Skeleton className="h-44 rounded-md" />;
  return (
    <Card className="p-6 bg-gradient-to-br from-primary to-primary/60 text-primary-foreground gap-4">
      <h1 className="text-2xl font-semibold">
        Good morning, {user?.displayName?.split(" ")[0]}
      </h1>
      <p className="text-sm opacity-90">
        Here's what's happening today at a glance.
      </p>
      <div className="space-y-2">
        {taskLoading ? (
          <Skeleton className="h-5 w-1/2" />
        ) : (
          !!tasks?.length && (
            <p className="text-sm">📝 {tasks.length} tasks pending</p>
          )
        )}

        {goalLoading ? (
          <Skeleton className="h-5 w-1/2" />
        ) : (
          !!goals?.length && (
            <p className="text-sm">🎯 {goals.length} goals in progress</p>
          )
        )}
        <p className="text-sm">🎉 It's Paulo's Birthday today!</p>
      </div>
    </Card>
  );
}
