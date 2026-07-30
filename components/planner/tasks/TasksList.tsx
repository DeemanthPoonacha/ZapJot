import { useState, useEffect } from "react";
import { useInfiniteTasks, useTaskMutations } from "@/lib/hooks/useTasks";
import {
  useTodayItineraryTasks,
  useItineraryMutations,
} from "@/lib/hooks/useItineraries";
import {
  ListChecks,
  MapPin,
  CheckSquare,
  Clock,
  Star,
  Calendar,
  CheckCircle,
  Filter,
} from "lucide-react";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../../Empty";
import { Skeleton } from "../../ui/skeleton";
import TaskForm from "./TaskForm";
import { TaskCard } from "./TaskCard";
import ResponsiveDialogDrawer from "../../ui/ResponsiveDialogDrawer";
import { getPluralWord } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { CardContent, ListCard, ListCardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Task, TaskCreate } from "@/types/tasks";
import dayjs from "dayjs";

type FilterType =
  | "all"
  | "high-priority"
  | "due-today"
  | "pending"
  | "completed";

function SectionHeader({
  label,
  count,
  icon,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-baseline justify-between pb-3 mb-4 border-b border-primary/30">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xs font-semibold uppercase tracking-widest text-primary dark:text-primary">
          {label}
        </h2>
      </div>
      <span className="text-sm text-primary dark:text-primary font-medium">
        {count} {getPluralWord("Task", count)}
      </span>
    </div>
  );
}

// Automatic Task Sorting: High Priority -> Earliest Due Date -> Created At / Updated At
const sortTasks = (tasksList: Task[]): Task[] => {
  return [...tasksList].sort((a, b) => {
    if (a.highPriority && !b.highPriority) return -1;
    if (!a.highPriority && b.highPriority) return 1;

    if (a.dueDate && b.dueDate) {
      if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    } else if (a.dueDate && !b.dueDate) {
      return -1;
    } else if (!a.dueDate && b.dueDate) {
      return 1;
    }

    const dateA = a.createdAt || "";
    const dateB = b.createdAt || "";
    return dateB.localeCompare(dateA);
  });
};

const TasksList = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [tempTask, setTempTask] = useState<TaskCreate>();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteTasks(undefined, 25);
  const { data: todayItineraryTasks } = useTodayItineraryTasks();
  const { editTaskMutation } = useItineraryMutations();
  const { selectedTaskId, setSelectedTaskId } = usePlanner();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const isDialogOpen = (dialogId: string) => selectedTaskId === dialogId;
  const toggleDialog = (dialogId: string | null) => {
    setSelectedTaskId(selectedTaskId === dialogId ? null : dialogId);
  };

  const handleClose = () => {
    setSelectedTaskId(null);
    setTempTask(undefined);
  };

  const fetchedTasks = data?.pages.flatMap((page) => page.tasks) || [];
  const itineraryTasks = todayItineraryTasks || [];

  // Total Counts including Itinerary Tasks
  const totalAllCount = fetchedTasks.length + itineraryTasks.length;
  const totalHighPriorityCount = fetchedTasks.filter(
    (t) => t.highPriority,
  ).length;
  const totalDueTodayCount =
    fetchedTasks.filter(
      (t) => t.dueDate && dayjs(t.dueDate).isSame(dayjs(), "day"),
    ).length + itineraryTasks.length;
  const totalPendingCount =
    fetchedTasks.filter((t) => t.status !== "completed").length +
    itineraryTasks.filter((item) => !item.task.completed).length;
  const totalCompletedCount =
    fetchedTasks.filter((t) => t.status === "completed").length +
    itineraryTasks.filter((item) => item.task.completed).length;

  // Filter main tasks based on activeFilter
  const filteredTasks = fetchedTasks.filter((task) => {
    if (activeFilter === "high-priority") return task.highPriority;
    if (activeFilter === "due-today") {
      return task.dueDate && dayjs(task.dueDate).isSame(dayjs(), "day");
    }
    if (activeFilter === "pending") return task.status !== "completed";
    if (activeFilter === "completed") return task.status === "completed";
    return true;
  });

  // Filter itinerary tasks based on activeFilter
  const filteredItineraryTasks = itineraryTasks.filter((item) => {
    if (activeFilter === "high-priority") return false;
    if (activeFilter === "pending") return !item.task.completed;
    if (activeFilter === "completed") return item.task.completed;
    return true;
  });

  const [completedTasksRaw, pendingTasksRaw] = filteredTasks.reduce(
    ([completed, pending], task) =>
      task.status === "completed"
        ? [[...completed, task], pending]
        : [completed, [...pending, task]],
    [[], []] as [Task[], Task[]],
  ) || [[], []];

  const pendingTasks = sortTasks(pendingTasksRaw);
  const completedTasks = sortTasks(completedTasksRaw);

  return (
    <div className="space-y-4 mb-8">
      {/* 1-Tap Mobile Quick Filter Chips with Combined Counts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar text-xs font-semibold">
        <Badge
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => setActiveFilter("all")}
          className="cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full shadow-sm gap-1 flex items-center transition-all"
        >
          <Filter className="h-3.5 w-3.5" />
          <span>All</span>({totalAllCount})
        </Badge>
        <Badge
          variant={activeFilter === "high-priority" ? "default" : "outline"}
          onClick={() => setActiveFilter("high-priority")}
          className="cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full shadow-sm gap-1 flex items-center transition-all"
        >
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>High Priority</span>({totalHighPriorityCount})
        </Badge>
        <Badge
          variant={activeFilter === "due-today" ? "default" : "outline"}
          onClick={() => setActiveFilter("due-today")}
          className="cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full shadow-sm gap-1 flex items-center transition-all"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Due Today</span>({totalDueTodayCount})
        </Badge>
        <Badge
          variant={activeFilter === "pending" ? "default" : "outline"}
          onClick={() => setActiveFilter("pending")}
          className="cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full shadow-sm gap-1 flex items-center transition-all"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Pending</span>({totalPendingCount})
        </Badge>
        <Badge
          variant={activeFilter === "completed" ? "default" : "outline"}
          onClick={() => setActiveFilter("completed")}
          className="cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full shadow-sm gap-1 flex items-center transition-all"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Completed</span>({totalCompletedCount})
        </Badge>
      </div>

      {isLoading ? (
        <div className="columns-1 md:columns-2 gap-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full break-inside-avoid" />
          ))}
        </div>
      ) : !fetchedTasks?.length && !itineraryTasks?.length ? (
        <Empty
          title="No tasks yet"
          subtitle="Add tasks to keep track of important things to do"
          buttonTitle="Create First Task"
          handleCreateClick={() => toggleDialog("new")}
          icon={<ListChecks className="emptyIcon" />}
          templates={[
            {
              label: "Buy Groceries",
              action: () => {
                setTempTask({
                  title: "Buy Groceries",
                  description: "",
                  highPriority: false,
                  status: "pending",
                  subtasks: [
                    { id: "1", title: "Milk", status: "pending" },
                    { id: "2", title: "Eggs", status: "pending" },
                    { id: "3", title: "Bread", status: "pending" },
                  ],
                  createdAt: dayjs().toISOString(),
                  updatedAt: dayjs().toISOString(),
                });
                toggleDialog("new");
              },
            },
            {
              label: "Pay Rent",
              action: () => {
                setTempTask({
                  title: "Pay Rent",
                  description: "Pay monthly rent",
                  highPriority: true,
                  dueDate: dayjs().date(30).format("YYYY-MM-DD"),
                  status: "pending",
                  subtasks: [],
                  createdAt: dayjs().toISOString(),
                  updatedAt: dayjs().toISOString(),
                });
                toggleDialog("new");
              },
            },
            {
              label: "Prepare Presentation",
              action: () => {
                setTempTask({
                  title: "Prepare Presentation",
                  description: "Prepare presentation",
                  highPriority: true,
                  status: "pending",
                  subtasks: [
                    { id: "1", title: "Outline", status: "pending" },
                    { id: "2", title: "Design Slides", status: "pending" },
                    { id: "3", title: "Practice", status: "pending" },
                  ],
                  createdAt: dayjs().toISOString(),
                  updatedAt: dayjs().toISOString(),
                });
                toggleDialog("new");
              },
            },
          ]}
        />
      ) : (
        <>
          {/* Today's Itinerary Activities (Filtered & Counted) */}
          {filteredItineraryTasks.length > 0 && (
            <div className="pb-8">
              <SectionHeader
                icon={
                  <MapPin className="h-4 w-4 text-primary dark:text-primary" />
                }
                label="Trip Activities Today"
                count={filteredItineraryTasks.length}
              />

              <div className="columns-1 md:columns-2 gap-4 space-y-4">
                {filteredItineraryTasks.map((item) => (
                  <div
                    key={`${item.itineraryId}-${item.dayId}-${item.task.id}`}
                    className="break-inside-avoid"
                  >
                    <ListCard>
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={item.task.completed}
                            onCheckedChange={() =>
                              editTaskMutation.mutate({
                                id: item.itineraryId,
                                dayId: item.dayId,
                                taskId: item.task.id,
                                data: { completed: !item.task.completed },
                              })
                            }
                            className="mt-1"
                          />
                          <div>
                            <p
                              className={`text-sm font-medium ${item.task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                            >
                              {item.task.title}
                            </p>
                          </div>
                        </div>
                        {item.task.time && (
                          <div className="flex items-center gap-1 text-xs text-primary dark:text-primary bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded shrink-0">
                            <Clock className="h-3 w-3" />
                            <span>{item.task.time}</span>
                          </div>
                        )}
                      </CardContent>
                      <ListCardFooter className="gap-2">
                        <span className="font-semibold text-primary dark:text-primary truncate">
                          {item.itineraryTitle}
                        </span>
                        <span className="truncate">{item.dayTitle}</span>
                      </ListCardFooter>
                    </ListCard>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Tasks (Masonry Columns Layout) */}
          {activeFilter !== "completed" && (
            <div className="pb-8">
              <SectionHeader
                icon={
                  <ListChecks className="h-4 w-4 text-primary dark:text-primary" />
                }
                label="Pending"
                count={pendingTasks?.length ?? 0}
              />
              {pendingTasks?.length === 0 ? (
                activeFilter === "all" ? (
                  <Empty
                    title="No tasks in progress"
                    subtitle="Add tasks to keep track of important things to do"
                    buttonTitle="Create New Task"
                    handleCreateClick={() => toggleDialog("new")}
                    icon={<ListChecks className="emptyIcon" />}
                  />
                ) : (
                  <p className="text-muted-foreground mb-6 text-center py-4 text-sm italic">
                    {activeFilter === "high-priority"
                      ? "No pending high priority tasks"
                      : activeFilter === "due-today"
                        ? "No tasks due today"
                        : "No pending tasks"}
                  </p>
                )
              ) : (
                <div className="columns-1 md:columns-2 gap-4 space-y-4">
                  {pendingTasks?.map((task) => (
                    <div key={task.id} className="break-inside-avoid">
                      <TaskCard
                        task={task}
                        onEditClick={() => toggleDialog(task.id)}
                      />
                      {isDialogOpen(task.id) && (
                        <ResponsiveDialogDrawer
                          content={
                            <TaskForm onClose={handleClose} taskData={task} />
                          }
                          title={task.title}
                          handleClose={handleClose}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Completed Tasks (Masonry Columns Layout) */}
          {activeFilter !== "pending" && (
            <div className="pb-8">
              <SectionHeader
                icon={
                  <CheckSquare className="h-4 w-4 text-primary dark:text-primary" />
                }
                label="Completed"
                count={completedTasks?.length ?? 0}
              />
              {completedTasks?.length === 0 ? (
                <p className="text-muted-foreground mb-6 text-center py-4 md:py-12 text-sm">
                  No tasks completed yet
                </p>
              ) : (
                <div className="columns-1 md:columns-2 gap-4 space-y-4">
                  {completedTasks?.map((task) => (
                    <div key={task.id} className="break-inside-avoid">
                      <TaskCard
                        task={task}
                        onEditClick={() => toggleDialog(task.id)}
                      />
                      {isDialogOpen(task.id) && (
                        <ResponsiveDialogDrawer
                          content={
                            <TaskForm onClose={handleClose} taskData={task} />
                          }
                          title={task.title}
                          handleClose={handleClose}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Infinite Scroll loading marker */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-6">
          {isFetchingNextPage ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <span className="text-xs text-muted-foreground">Load more</span>
          )}
        </div>
      )}

      {/* Add Task Dialog */}
      {isDialogOpen("new") && (
        <ResponsiveDialogDrawer
          content={
            <TaskForm onClose={handleClose} taskData={tempTask as Task} />
          }
          title="New Task"
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default TasksList;
