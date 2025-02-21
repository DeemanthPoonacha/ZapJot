import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoalSchema, GoalCreate } from "@/types/goals";
import { useGoalMutations } from "@/lib/hooks/useGoals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GoalForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createGoalSchema),
    defaultValues: { title: "", deadline: "", description: "" },
  });

  const { addMutation } = useGoalMutations();

  const onSubmit = async (data: GoalCreate) => {
    await addMutation.mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-bold">Add Goal</h2>
      <Input {...register("title")} placeholder="Goal Title" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Input type="date" {...register("deadline")} placeholder="Deadline" />
      {errors.deadline && (
        <p className="text-red-500">{errors.deadline.message}</p>
      )}

      <Input {...register("description")} placeholder="Goal Description" />
      <Button type="submit" disabled={isSubmitting}>
        Create Goal
      </Button>
    </form>
  );
};

export default GoalForm;
