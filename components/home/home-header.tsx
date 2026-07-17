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
import { ListChecks, Target, CalendarDays } from "lucide-react";

function StatChip({
  icon,
  loading,
  count,
  label,
}: {
  icon: React.ReactNode;
  loading: boolean;
  count?: number;
  label: string;
}) {
  if (loading)
    return (
      <Skeleton className="h-7 w-28 rounded-full bg-primary-foreground/15" />
    );
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
      {icon}
      {count} {getPluralWord(label, count)}
    </span>
  );
}

export function HomeHeader() {
  const { user, loading } = useAuth();
  const { data: tasks, isLoading: taskLoading } = useTasks();
  const { data: goals, isLoading: goalLoading } = useGoals();
  const { data: events, isLoading: eventLoading } = useEvents({
    onlyUpcoming: true,
  });

  const today = dayjs();
  const todayEvents = events?.filter((event) =>
    dayjs((event.nextOccurrence as Timestamp).toDate()).isSame(today, "day"),
  );
  const greet = () =>
    user
      ? `Hello, ${user.displayName || user.email?.split("@")[0]}!`
      : "Hello!";

  if (loading) return <Skeleton className="h-44 rounded-md" />;

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif italic font-medium tracking-tight">
            {greet()}
          </h1>
          <p className="text-sm opacity-80 mt-1">
            Here&apos;s what&apos;s happening at a glance.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <StatChip
          icon={<ListChecks className="h-3.5 w-3.5" />}
          loading={taskLoading}
          count={tasks?.length}
          label="task"
        />
        <StatChip
          icon={<Target className="h-3.5 w-3.5" />}
          loading={goalLoading}
          count={goals?.length}
          label="goal"
        />
        <StatChip
          icon={<CalendarDays className="h-3.5 w-3.5" />}
          loading={eventLoading}
          count={todayEvents?.length}
          label="event"
        />
      </div>

      <Image
        className="absolute opacity-10 right-0 sm:right-10 top-1/2 -translate-y-1/2 w-1/2 sm:w-1/3 pointer-events-none"
        src="/z_icon.webp"
        alt="logo"
        width={300}
        height={300}
      />
    </Card>
  );
}
