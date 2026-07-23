import { useInfiniteTasks } from "@/lib/hooks/useTasks";
import {
  useTodayItineraryTasks,
  useItineraryMutations,
} from "@/lib/hooks/useItineraries";
import { ListChecks, MapPin, CheckSquare, Square, Clock } from "lucide-react";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../../Empty";
import { Skeleton } from "../../ui/skeleton";
import TaskForm from "./TaskForm";
import { TaskCard } from "./TaskCard";
import ResponsiveDialogDrawer from "../../ui/ResponsiveDialogDrawer";
import { getPluralWord } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  ListCard,
  ListCardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

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

const TasksList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteTasks(undefined, 15);
  const { data: todayItineraryTasks, isLoading: isItineraryLoading } =
    useTodayItineraryTasks();
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
  };

  const tasks = data?.pages.flatMap((page) => page.tasks) || [];

  const [completedTasks, pendingTasks] = tasks.reduce(
    ([completed, pending], task) =>
      task.status === "completed"
        ? [[...completed, task], pending]
        : [completed, [...pending, task]],
    [[], []] as [typeof tasks, typeof tasks],
  ) || [[], []];

  return (
    <div className="space-y-4 mb-8">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !tasks?.length ? (
        <Empty
          title="No tasks yet"
          subtitle="Add tasks to keep track of important things to do"
          buttonTitle="Create First Task"
          handleCreateClick={() => toggleDialog("new")}
          icon={<ListChecks className="emptyIcon" />}
        />
      ) : (
        <>
          {/* Today's Itinerary Activities */}
          {todayItineraryTasks && todayItineraryTasks.length > 0 && (
            <div className="pb-8">
              <SectionHeader
                icon={
                  <MapPin className="h-4 w-4 text-primary dark:text-primary" />
                }
                label="Trip Activities Today"
                count={todayItineraryTasks.length}
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 items-start">
                {todayItineraryTasks.map((item) => (
                  <ListCard
                    key={`${item.itineraryId}-${item.dayId}-${item.task.id}`}
                  >
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
                    <ListCardFooter>
                      <span className="font-semibold text-primary dark:text-primary">
                        {item.itineraryTitle}
                      </span>
                      <span>{item.dayTitle}</span>
                    </ListCardFooter>
                  </ListCard>
                ))}
              </div>
            </div>
          )}

          {/* Pending Tasks */}
          <div className="pb-8">
            <SectionHeader
              icon={
                <ListChecks className="h-4 w-4 text-primary dark:text-primary" />
              }
              label="Pending"
              count={pendingTasks?.length ?? 0}
            />
            {pendingTasks?.length === 0 ? (
              <Empty
                title="No tasks in progress"
                subtitle="Add tasks to keep track of important things to do"
                buttonTitle="Create New Task"
                handleCreateClick={() => toggleDialog("new")}
                icon={<ListChecks className="emptyIcon" />}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
                {pendingTasks?.map((task) => (
                  <div key={task.id}>
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

          {/* Completed Tasks */}
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
                {completedTasks?.map((task) => (
                  <div key={task.id}>
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
          content={<TaskForm onClose={handleClose} />}
          title="New Task"
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default TasksList;
