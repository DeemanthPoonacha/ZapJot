import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../../ui/sonner";
import { cn } from "@/lib/utils";
import { useTaskMutations } from "@/lib/hooks/useTasks";
import { createTaskSchema, Task, TaskCreate } from "@/types/tasks";
import { Reorder, useDragControls } from "framer-motion";

function TaskFormSubtaskItem({
  subtask,
  index,
  form,
  removeSubtask,
}: {
  subtask: any;
  index: number;
  form: any;
  removeSubtask: (index: number) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={subtask.id}
      value={subtask}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg group border border-transparent hover:border-border transition-all"
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing p-1 touch-none flex items-center justify-center text-muted-foreground/40 group-hover:text-muted-foreground shrink-0"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <FormField
        control={form.control}
        name={`subtasks.${index}.title`}
        render={({ field }) => (
          <FormItem className="flex-1 mb-0">
            <FormControl>
              <Input {...field} placeholder="Subtask Title" />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => removeSubtask(index)}
        className="h-8 w-8"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </Reorder.Item>
  );
}

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DeleteConfirm from "../../ui/delete-confirm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Trash2, Plus, Save, Ban, GripVertical } from "lucide-react";

const TaskForm = ({
  taskData,
  onClose,
  onSave,
}: {
  taskData?: Task;
  onClose?: () => void;
  onSave?: () => void;
}) => {
  const { addMutation, updateMutation, deleteMutation } = useTaskMutations();
  const isEditing = !!taskData?.id;

  // Form setup
  const form = useForm<TaskCreate>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: taskData?.title || "",
      description: taskData?.description || "",
      dueDate: taskData?.dueDate || "",
      highPriority: taskData?.highPriority || false,
      status: taskData?.status || "pending",
      subtasks: taskData?.subtasks || [],
    },
  });

  const {
    fields: subtaskFields,
    append: addSubtask,
    remove: removeSubtask,
    replace: replaceSubtasks,
  } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  // Form handlers
  const handleAddSubtask = () => {
    addSubtask({ title: "", status: "pending", id: Date.now().toString() });
  };

  const handleDelete = async () => {
    if (!isEditing) return;

    try {
      await deleteMutation.mutateAsync(taskData.id);
      toast.success("Task deleted successfully");
      onClose?.();
    } catch (error) {
      toast.error("Error deleting task");
      console.error(error);
    }
  };

  const onSubmit = async (data: TaskCreate) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: taskData.id, data });
        toast.success("Task updated successfully");
      } else {
        await addMutation.mutateAsync(data);
        toast.success("Task created successfully");
      }
      form.reset();
      onSave?.();
      onClose?.();
    } catch (error) {
      console.error("Error saving task", error);
      toast.error("Failed to save task");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add details about this task..."
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* High Priority Switch */}
        <FormField
          control={form.control}
          name="highPriority"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="cursor-pointer">High Priority</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Mark this task as high priority
                </div>
              </div>
              <FormControl>
                <Switch
                  className="cursor-pointer"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Subtasks Section with Drag & Drop Reordering */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel>Subtasks (Drag to reorder)</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSubtask}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {subtaskFields.length === 0 ? (
            <div className="text-sm text-muted-foreground italic p-2 text-center border rounded-md">
              No subtasks added yet
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={subtaskFields}
              onReorder={(newFields) => replaceSubtasks(newFields)}
              className="space-y-2"
            >
              {subtaskFields.map((subtask, index) => (
                <TaskFormSubtaskItem
                  key={subtask.id}
                  subtask={subtask}
                  index={index}
                  form={form}
                  removeSubtask={removeSubtask}
                />
              ))}
            </Reorder.Group>
          )}
        </div>

        <div
          className={cn(
            "flex w-full pt-4 border-t mt-6",
            isEditing ? "justify-between" : "justify-end"
          )}
        >
          {isEditing && (
            <DeleteConfirm itemName="Task" handleDelete={handleDelete} />
          )}
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              <Ban />
              Cancel
            </Button>
            <Button type="submit">
              <Save />
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
