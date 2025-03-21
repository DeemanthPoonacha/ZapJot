import { useTasks } from "@/lib/hooks/useTasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListChecks } from "lucide-react";
import usePlanner from "@/lib/hooks/usePlanner";
import Empty from "../Empty";
import { Skeleton } from "../ui/skeleton";
import TaskForm from "./TaskForm";
import { TaskCard } from "./TaskCard";

const TasksList = () => {
  const { data: tasks, isLoading } = useTasks();
  console.log("🚀 ~ TasksList ~ tasks:", tasks);
  const { selectedTaskId, setSelectedTaskId } = usePlanner();

  // Helper to determine if a specific dialog is open
  const isDialogOpen = (dialogId: string) => selectedTaskId === dialogId;

  // Helper to open/close a specific dialog
  const toggleDialog = (dialogId: string | null) => {
    setSelectedTaskId(selectedTaskId === dialogId ? null : dialogId);
  };

  return (
    <div className="space-y-4">
      {/* Add/Edit Task Dialog */}
      <Dialog
        open={selectedTaskId !== null}
        onOpenChange={(open) => toggleDialog(open ? selectedTaskId : null)}
      >
        {isDialogOpen("new") && (
          <TaskDialogContent
            handleClose={() => setSelectedTaskId(null)}
            task={null}
          />
        )}

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
          tasks?.map((task) => (
            <div key={task.id}>
              <TaskCard task={task} onEditClick={() => toggleDialog(task.id)} />
              {isDialogOpen(task.id) && (
                <TaskDialogContent
                  handleClose={() => setSelectedTaskId(null)}
                  task={task}
                />
              )}
            </div>
          ))
        )}
      </Dialog>
    </div>
  );
};

function TaskDialogContent({
  task,
  handleClose,
}: {
  task: any; // Replace `any` with the appropriate Task type
  handleClose: () => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{task?.title || "New Task"}</DialogTitle>
      </DialogHeader>
      <TaskForm onClose={handleClose} taskData={task} />
    </DialogContent>
  );
}

export default TasksList;
