import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoalSchema, Goal, GoalCreate } from "@/types/goals";
import { useGoalMutations } from "@/lib/hooks/useGoals";
import { toast } from "../../ui/sonner";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import DeleteConfirm from "../../ui/delete-confirm";
import { Save } from "lucide-react";

const GoalForm = ({
  onClose,
  goalData,
}: {
  onClose: () => void;
  goalData?: Goal;
}) => {
  const { addMutation, updateMutation, deleteMutation } = useGoalMutations();

  // Form setup
  const form = useForm<GoalCreate>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      title: goalData?.title || "",
      description: goalData?.description || "",
      deadline: goalData?.deadline || "",
      objective: goalData?.objective || 100,
      progress: goalData?.progress || 0,
      unit: goalData?.unit || "%",
    },
  });

  const isEditing = !!goalData?.id;

  const handleDelete = async () => {
    if (!isEditing) return;

    try {
      await deleteMutation.mutateAsync(goalData.id);
      toast.success("Goal deleted successfully");
      onClose?.();
    } catch (error) {
      console.error("Error deleting goal", error);
      toast.error("Failed to delete goal");
    }
  };

  const onSubmit = async (data: GoalCreate) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: goalData.id, data });
        toast.success("Goal updated successfully");
      } else {
        await addMutation.mutateAsync(data);
        toast.success("Goal created successfully");
      }
      form.reset();
      onClose?.();
    } catch (error) {
      console.error("Error saving goal", error);
      toast.error("Failed to save goal");
    }
  };

  const UnitInput = (
    <FormField
      control={form.control}
      name="unit"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              className="rounded-l-none w-20"
              {...field}
              placeholder="units"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Goal Title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} placeholder="Deadline" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="progress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Progress</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      {...field}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      min={0}
                      placeholder="Progress"
                      className="rounded-r-none"
                    />
                    {UnitInput}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="objective"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objective</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      {...field}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      min={0}
                      placeholder="Objective"
                      className="rounded-r-none"
                    />
                    {UnitInput}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Goal Description" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            "flex w-full pt-4 border-t mt-6",
            isEditing ? "justify-between" : "justify-end"
          )}
        >
          {isEditing && (
            <DeleteConfirm itemName="Goal" handleDelete={handleDelete} />
          )}
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-1" />
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default GoalForm;
