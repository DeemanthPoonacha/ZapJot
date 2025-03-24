import { useState } from "react";
import {
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Banknote,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ItineraryDayType, ItineraryTask } from "@/types/itineraries";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

export function ItineraryDay({
  day,
  index,
  isExpanded,
  toggleExpandDay,
  isPending,
  updateTask,
}: {
  day: ItineraryDayType;
  index: number;
  isExpanded: boolean;
  toggleExpandDay: (dayId: string, value?: boolean) => void;
  isPending: boolean;
  updateTask: (
    dayId: string,
    taskId: string,
    data: Partial<ItineraryTask>
  ) => void;
}) {
  const dayTasksCompleted = day.tasks.filter(
    (task: any) => task.completed
  ).length;
  const dayTasksTotal = day.tasks.length;
  const dayCompletionPercent =
    dayTasksTotal > 0
      ? Math.round((dayTasksCompleted / dayTasksTotal) * 100)
      : 0;

  return (
    <Card
      key={day.id}
      className="border-l-4 gap-0"
      style={{
        borderLeftColor:
          dayCompletionPercent === 100 ? "var(--success)" : "var(--muted)",
      }}
    >
      <CardHeader
        className="p-4 flex flex-row justify-between items-center cursor-pointer"
        onClick={() => toggleExpandDay(day.id)}
      >
        <div className="flex items-center">
          <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center mr-3">
            <span className="font-semibold text-sm">{index + 1}</span>
          </div>
          <div>
            <h4 className="font-medium">{day.title}</h4>
            <p className="text-sm text-muted-foreground">
              {dayTasksCompleted} of {dayTasksTotal} tasks completed
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2 hidden md:flex">
            <Banknote className="h-3 w-3 mr-1" />${day.budget}
          </Badge>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {day.tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No tasks scheduled for this day
              </p>
            ) : (
              day.tasks.map((task: any) => (
                <div
                  key={task.id}
                  className="flex rounded-md justify-between items-center px-2 py-1"
                >
                  <span className="flex items-center space-x-2">
                    <Checkbox
                      disabled={isPending}
                      id={task.id + "-checkbox"}
                      className="cursor-pointer"
                      checked={task.completed}
                      onCheckedChange={() =>
                        updateTask(day.id, task.id, {
                          ...task,
                          completed: !task.completed,
                        })
                      }
                    />
                    <label
                      htmlFor={task.id + "-checkbox"}
                      className={cn(
                        "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer max-w-72 line-clamp-2",
                        task.status === "completed"
                          ? "line-through text-muted-foreground"
                          : ""
                      )}
                    >
                      {task.title}
                    </label>
                  </span>
                  {task.time && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {task.time}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
