import { useTasks, useTaskMutations } from "@/lib/hooks/useTasks";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks } from "lucide-react";
import Empty from "../Empty";

const TasksList = () => {
  const { data: tasks, isLoading } = useTasks();
  const { deleteMutation } = useTaskMutations();

  if (isLoading) return <p>Loading tasks...</p>;

  if (!tasks?.length)
    return (
      <Empty
        title="No tasks yet"
        subtitle="Add tasks to keep track of important things to do"
        buttonTitle="Create First Task"
        handleCreateClick={() => {}}
        icon={<ListChecks className="emptyIcon" />}
      />
    );

  return (
    <div className="space-y-3">
      {tasks?.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-center space-x-2">
            <Checkbox checked={task.status === "completed"} />
            <span
              className={
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : ""
              }
            >
              {task.title}
            </span>
          </div>
          {task.subtasks && (
            <div className="ml-6 mt-2 space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-2">
                  <Checkbox checked={subtask.status === "completed"} />
                  <span
                    className={
                      subtask.status === "completed"
                        ? "line-through text-muted-foreground"
                        : ""
                    }
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default TasksList;
