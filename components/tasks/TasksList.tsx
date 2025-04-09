import { useTasks } from "@/lib/hooks/useTasks";
import { ListChecks } from "lucide-react";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../Empty";
import { Skeleton } from "../ui/skeleton";
import TaskForm from "./TaskForm";
import { TaskCard } from "./TaskCard";
import ResponsiveDialogDrawer from "../ui/ResponsiveDialogDrawer";

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

  return (
    <div className="space-y-4 mb-8">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))
      ) : !tasks?.length ? (
        <Empty
          title="No tasks yet"
          subtitle="Add tasks to keep track of important things to do"
          buttonTitle="Create First Task"
          handleCreateClick={() => toggleDialog("new")}
          icon={<ListChecks className="emptyIcon" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tasks?.map((task) => (
            <div key={task.id}>
              <TaskCard task={task} onEditClick={() => toggleDialog(task.id)} />
              {isDialogOpen(task.id) && (
                <ResponsiveDialogDrawer
                  content={<TaskForm onClose={handleClose} taskData={task} />}
                  title={task.title}
                  handleClose={handleClose}
                />
              )}
            </div>
          ))}
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
