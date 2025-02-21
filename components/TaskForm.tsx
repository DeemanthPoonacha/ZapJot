import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskMutations } from "@/lib/hooks/useTasks";
import { taskSchema, TaskCreate, createTaskSchema } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TaskForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskCreate>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { addMutation } = useTaskMutations();

  const onSubmit = async (data: TaskCreate) => {
    await addMutation.mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("title")} placeholder="Task Title" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Textarea {...register("description")} placeholder="Task Description" />

      <Button type="submit" disabled={isSubmitting}>
        Add Task
      </Button>
    </form>
  );
};

export default TaskForm;
