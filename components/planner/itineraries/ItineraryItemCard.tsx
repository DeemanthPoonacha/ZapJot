import { useState } from "react";
import {
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Banknote,
  Pencil,
  X,
  Trash2,
  PlusCircle,
  GripVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  itineraryDaySchema,
  ItineraryDayType,
  ItineraryDayUpdate,
  ItineraryTask,
} from "@/types/itineraries";
import { Checkbox } from "../../ui/checkbox";
import { cn } from "@/lib/utils";
import { useItineraryMutations } from "@/lib/hooks/useItineraries";
import { toast } from "../../ui/sonner";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import DeleteConfirm from "../../ui/delete-confirm";
import { Reorder, useDragControls } from "framer-motion";

function EditModeItineraryTaskItem({
  task,
  taskIndex,
  form,
  handleDeleteTask,
}: {
  task: any;
  taskIndex: number;
  form: any;
  handleDeleteTask: (e: React.MouseEvent, index: number) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={task.id}
      value={task}
      dragListener={false}
      dragControls={controls}
      className="flex items-start gap-1 bg-muted/20 hover:bg-muted/40 p-2 rounded-lg group border border-transparent hover:border-border transition-all"
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing mt-2 shrink-0 p-0.5 touch-none text-muted-foreground/40 group-hover:text-muted-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <FormField
        control={form.control}
        name={`tasks.${taskIndex}.completed`}
        render={({ field }) => (
          <FormItem className="flex-none mt-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                onClick={(e) => e.stopPropagation()}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex gap-1 flex-1">
        <div className="md:col-span-3 flex-1">
          <FormField
            control={form.control}
            name={`tasks.${taskIndex}.title`}
            render={({ field }) => (
              <FormItem className="flex-1 mb-0">
                <FormControl>
                  <Input
                    {...field}
                    className="h-8 p-1"
                    placeholder="Task Description"
                    onClick={(e) => e.stopPropagation()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-1">
          <FormField
            control={form.control}
            name={`tasks.${taskIndex}.time`}
            render={({ field }) => (
              <FormItem className="flex-1 mb-0">
                <FormControl>
                  <Input
                    className="h-8 w-20 p-1"
                    type="time"
                    {...field}
                    placeholder="Time"
                    onClick={(e) => e.stopPropagation()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => handleDeleteTask(e, taskIndex)}
        className="h-8 w-8 flex-none"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </Reorder.Item>
  );
}

function ViewModeItineraryTaskItem({
  task,
  isLoading,
  handleTaskCompletion,
}: {
  task: ItineraryTask;
  isLoading: boolean;
  handleTaskCompletion: (task: ItineraryTask) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={task.id}
      value={task}
      dragListener={false}
      dragControls={controls}
      className="flex rounded-md justify-between items-center px-2 py-1.5 hover:bg-muted/40 transition-colors group select-none"
    >
      <span className="flex items-center space-x-2 flex-1 min-w-0">
        <div
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab active:cursor-grabbing p-0.5 touch-none text-muted-foreground/30 group-hover:text-muted-foreground/80 shrink-0"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>
        <Checkbox
          disabled={isLoading}
          id={task.id + "-checkbox"}
          className="cursor-pointer shrink-0"
          checked={task.completed}
          onCheckedChange={() => handleTaskCompletion(task)}
          onClick={(e) => e.stopPropagation()}
        />
        <label
          htmlFor={task.id + "-checkbox"}
          className={cn(
            "text-sm cursor-pointer truncate flex-1",
            task.completed
              ? "line-through text-muted-foreground"
              : "text-foreground font-medium",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {task.title}
        </label>
      </span>
      {task.time && (
        <Badge variant="secondary" className="text-xs font-normal shrink-0 ml-2">
          <Clock className="h-3 w-3 mr-1" />
          {task.time}
        </Badge>
      )}
    </Reorder.Item>
  );
}

export const ItineraryDay = ({
  itineraryId,
  day,
  index,
  isExpanded,
  toggleExpandDay,
}: {
  itineraryId: string;
  day: ItineraryDayType;
  index: number;
  isExpanded: boolean;
  toggleExpandDay: (dayId: string, value?: boolean) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateDayMutation, deleteDayMutation } = useItineraryMutations();

  const isDayComplete =
    day.tasks.length > 0 && day.tasks.every((task) => task.completed);
  const completedTasksCount = day.tasks.filter((t) => t.completed).length;

  const defaultValues: ItineraryDayUpdate = {
    title: day.title,
    budget: day.budget,
    tasks: day.tasks,
  };

  const formKey = `${day.id}-${JSON.stringify(day)}`;

  const form = useForm<ItineraryDayUpdate>({
    resolver: zodResolver(itineraryDaySchema.partial()),
    defaultValues,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  const updateTask = async (
    dayId: string,
    taskId: string,
    data: Partial<ItineraryTask>,
  ) => {
    try {
      const updatedTasks = day.tasks.map((task) =>
        task.id === taskId ? { ...task, ...data } : task,
      );
      await updateDayMutation.mutateAsync({
        id: itineraryId,
        dayId,
        data: { tasks: updatedTasks },
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const onSubmit = async (data: ItineraryDayUpdate) => {
    try {
      await updateDayMutation.mutateAsync({
        id: itineraryId,
        dayId: day.id,
        data,
      });
      setIsEditing(false);
      toast.success("Day updated successfully");
    } catch (error) {
      console.error("Error updating day:", error);
      toast.error("Failed to update day");
    }
  };

  const handleDeleteDay = async () => {
    try {
      await deleteDayMutation.mutateAsync({
        id: itineraryId,
        dayId: day.id,
      });
      toast.success("Day deleted successfully");
    } catch (error) {
      console.error("Error deleting day:", error);
      toast.error("Failed to delete day");
    }
  };

  const isLoading =
    updateDayMutation.isPending || deleteDayMutation.isPending;

  const handleHeaderClick = () => {
    if (!isEditing) {
      toggleExpandDay(day.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.reset(defaultValues);
    setIsEditing(true);
    toggleExpandDay(day.id, true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
  };

  const handleAddTask = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    append({
      id: `new-task-${Date.now()}`,
      title: "",
      time: "",
      completed: false,
    });
  };

  const handleDeleteTask = (e: React.MouseEvent, taskIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    remove(taskIndex);
  };

  const handleTaskCompletion = async (task: ItineraryTask) => {
    await updateTask(day.id, task.id, {
      ...task,
      completed: !task.completed,
    });
  };

  const handleReorderViewMode = async (newTasks: ItineraryTask[]) => {
    await updateDayMutation.mutateAsync({
      id: itineraryId,
      dayId: day.id,
      data: { tasks: newTasks },
    });
  };

  return (
    <Form key={formKey} {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card
          className="border-l-4 gap-0"
          style={{
            borderLeftColor: isDayComplete ? "var(--primary)" : "var(--muted)",
          }}
        >
          <CardHeader
            className="p-4 flex flex-row justify-between items-start cursor-pointer"
            onClick={handleHeaderClick}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors",
                  isDayComplete
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-foreground",
                )}
              >
                {isDayComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div>
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="mb-0">
                        <FormControl>
                          <Input
                            {...field}
                            className="h-8 text-base font-semibold"
                            placeholder="Day Title"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <h3 className="font-semibold text-base">{day.title}</h3>
                )}
                <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-2">
                  <span>
                    {completedTasksCount}/{day.tasks.length} tasks completed
                  </span>
                  {day.budget > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Banknote className="h-3 w-3" />${day.budget}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Save
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <DeleteConfirm
                    itemName="Day"
                    handleDelete={handleDeleteDay}
                  />
                </>
              ) : (
                <div className="flex gap-1 items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEditClick}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          {isExpanded && (
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    {fields.length === 0 ? (
                      <div className="text-sm text-muted-foreground italic p-2 text-center border rounded-md">
                        No tasks added yet
                      </div>
                    ) : (
                      <Reorder.Group
                        axis="y"
                        values={fields}
                        onReorder={(newFields) => replace(newFields)}
                        className="space-y-2"
                      >
                        {fields.map((task, taskIndex) => (
                          <EditModeItineraryTaskItem
                            key={task.id}
                            task={task}
                            taskIndex={taskIndex}
                            form={form}
                            handleDeleteTask={handleDeleteTask}
                          />
                        ))}
                      </Reorder.Group>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTask}
                      className="mt-2 w-full border-dashed text-xs gap-1"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {day.tasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        No tasks scheduled for this day
                      </p>
                    ) : (
                      <Reorder.Group
                        axis="y"
                        values={day.tasks}
                        onReorder={handleReorderViewMode}
                        className="space-y-1"
                      >
                        {day.tasks.map((task: ItineraryTask) => (
                          <ViewModeItineraryTaskItem
                            key={task.id}
                            task={task}
                            isLoading={isLoading}
                            handleTaskCompletion={handleTaskCompletion}
                          />
                        ))}
                      </Reorder.Group>
                    )}
                  </div>
                )}
                {isEditing && (
                  <div className="flex justify-end gap-2 pt-2 border-t mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={form.formState.isSubmitting}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </form>
    </Form>
  );
};
