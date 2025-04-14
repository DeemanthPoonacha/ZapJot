import { useTasks } from "@/lib/hooks/useTasks";
import { ListChecks } from "lucide-react";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../../Empty";
import { Skeleton } from "../../ui/skeleton";
import TaskForm from "./TaskForm";
import { TaskCard } from "./TaskCard";
import ResponsiveDialogDrawer from "../../ui/ResponsiveDialogDrawer";
import { getPluralWord } from "@/lib/utils";

const TasksList = () => {
  const { data: tasks, isLoading } = useTasks();
  const { selectedTaskId, setSelectedTaskId } = usePlanner();

  const isDialogOpen = (dialogId: string) => selectedTaskId === dialogId;
  const toggleDialog = (dialogId: string | null) => {
    setSelectedTaskId(selectedTaskId === dialogId ? null : dialogId);
  };

  const handleClose = () => {
    setSelectedTaskId(null);
  };

  const [completedTasks, pendingTasks] = tasks?.reduce(
    ([completed, pending], task) =>
      task.status === "completed"
        ? [[...completed, task], pending]
        : [completed, [...pending, task]],
    [[], []] as [typeof tasks, typeof tasks]
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
          {/* In-Progress Tasks */}
          <div className="pb-12">
            <div className="flex justify-between items-center pb-4">
              <span className="text-lg font-semibold">Pending</span>
              {`${pendingTasks?.length} ${getPluralWord(
                "Task",
                pendingTasks?.length
              )}`}
            </div>
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
          <div className="pb-12">
            <div className="flex justify-between items-center pb-4">
              <span className="text-lg font-semibold">Completed</span>
              {`${completedTasks?.length} ${getPluralWord(
                "Task",
                completedTasks?.length
              )}`}
            </div>
            {completedTasks?.length === 0 ? (
              <p className="text-muted-foreground mb-6 text-center py-4 md:py-12">
                No Tasks completed yet
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
