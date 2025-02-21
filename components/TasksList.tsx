import { useTasks, useTaskMutations } from "@/lib/hooks/useTasks";
import TaskForm from "./TaskForm";
import { Button } from "@/components/ui/button";

const TasksList = () => {
  const { data: tasks, isLoading } = useTasks();
  const { deleteMutation } = useTaskMutations();

  if (isLoading) return <p>Loading tasks...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tasks</h2>
      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteMutation.mutate(task.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <TaskForm />
    </div>
  );
};

export default TasksList;
