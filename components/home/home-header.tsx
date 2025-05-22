"use client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/AuthProvider";
import { Skeleton } from "../ui/skeleton";
import { useTasks } from "@/lib/hooks/useTasks";
import { useGoals } from "@/lib/hooks/useGoals";
import { useEvents } from "@/lib/hooks/useEvents";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { getPluralWord } from "@/lib/utils";
import Image from "next/image";

export function HomeHeader() {
  const { user, loading } = useAuth();
  const { data: tasks, isLoading: taskLoading } = useTasks();
  const { data: goals, isLoading: goalLoading } = useGoals();
  const { data: events, isLoading: eventLoading } = useEvents({
    onlyUpcoming: true,
  });

  const todayEvents = events?.filter((event) =>
    dayjs((event.nextOccurrence as Timestamp).toDate()).isSame(dayjs(), "day")
  );
  const greet = () =>
    user
      ? `Hello, ${user.displayName || user.email?.split("@")[0]}!`
      : "Hello!";

  if (loading) return <Skeleton className="h-44 rounded-md" />;
  return (
    <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-primary to-primary/60 text-primary-foreground gap-4">
      <h1 className="text-2xl font-semibold">{greet()}</h1>
      <p className="text-sm opacity-90">
        {`Here's what's happening at a glance.`}
      </p>
      <div className="space-y-2">
        {taskLoading ? (
          <Skeleton className="h-5 w-1/2" />
        ) : (
          !!tasks?.length && (
            <p className="text-sm">
              📝{" "}
              {`${tasks.length} ${getPluralWord("task", tasks.length)} pending`}
            </p>
          )
        )}

        {goalLoading ? (
          <Skeleton className="h-5 w-1/2" />
        ) : (
          !!goals?.length && (
            <p className="text-sm">
              🎯{" "}
              {`${goals.length} ${getPluralWord("goal", goals.length)} pending`}
            </p>
          )
        )}

        {eventLoading ? (
          <Skeleton className="h-5 w-1/2" />
        ) : (
          !!todayEvents?.length && (
            <p className="text-sm">
              📅{" "}
              {`${todayEvents.length} ${getPluralWord(
                "event",
                todayEvents.length
              )} upcoming today`}
            </p>
          )
        )}
      </div>
      <Image
        className="absolute opacity-10 right-0 sm:right-10 top-1/2 -translate-y-1/2 rotate-[10deg] w-1/2 sm:w-1/3"
        src="/z_icon.webp"
        alt="logo"
        width={300}
        height={300}
      />
    </Card>
  );
}
