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
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { useItineraryMutations } from "@/lib/hooks/useItineraries";
import { toast } from "../ui/sonner";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import DeleteConfirm from "../ui/delete-confirm";

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
  const { editTaskMutation, updateDayMutation, deleteDayMutation } =
    useItineraryMutations();
  const { mutateAsync: deleteDayMutate, isPending: deletePending } =
    deleteDayMutation;
  const { mutateAsync: dayMutate, isPending: dayPending } = updateDayMutation;
  const { mutateAsync: taskMutate, isPending: taskPending } = editTaskMutation;
  const [isEditing, setIsEditing] = useState(false);

  // Combined loading state
  const isLoading = taskPending || dayPending || deletePending;

  // Calculate task completion stats
  const dayTasksCompleted = day.tasks.filter((task) => task.completed).length;
  const dayTasksTotal = day.tasks.length;
  const dayCompletionPercent =
    dayTasksTotal > 0
      ? Math.round((dayTasksCompleted / dayTasksTotal) * 100)
      : 0;

  // Create a key for the form to force re-rendering when day changes
  const formKey = `day-form-${day.id}-${dayTasksCompleted}`;
  const defaultValues = {
    id: day.id,
    title: day.title,
    budget: day.budget,
    tasks: day.tasks,
  };

  // Initialize form with day data
  const form = useForm({
    resolver: zodResolver(itineraryDaySchema),
    defaultValues,
  });

  // Set up field array for tasks
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  // Handle task update
  const updateTask = async (
    dayId: string,
    taskId: string,
    data: Partial<ItineraryTask>
  ) => {
    try {
      await taskMutate({ id: itineraryId, dayId, taskId, data });
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  // Handle day update
  const updateDay = async (dayId: string, data: Partial<ItineraryDayType>) => {
    try {
      await dayMutate({ id: itineraryId, dayId, data });
      toast.success("Day updated successfully");
    } catch (error) {
      console.error("Error updating day:", error);
      toast.error("Failed to update day");
    }
  };

  const handleDeleteDay = async () => {
    try {
      await deleteDayMutate({ id: itineraryId, dayId: day.id });
      toast.success("Day deleted successfully");
    } catch (error) {
      console.error("Error deleting day:", error);
      toast.error("Failed to delete day");
    }
  };

  // Form submission handler
  const onSubmit = async (data: ItineraryDayUpdate) => {
    try {
      await updateDay(day.id, data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating day or tasks:", error);
      toast.error("Failed to update day or tasks");
    }
  };

  // HANDLERS WITH PROPER EVENT PREVENTION

  // Card header click handler (toggles expanded state)
  const handleHeaderClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      toggleExpandDay(day.id);
    }
  };

  // Edit button click handler
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Reset form with current day data before entering edit mode
    form.reset(defaultValues);
    setIsEditing(true);
    toggleExpandDay(day.id, true);
  };

  // Cancel edit click handler
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
  };

  // Toggle expand/collapse click handler
  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleExpandDay(day.id);
  };

  // Add task handler
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

  // Delete task handler
  const handleDeleteTask = (e: React.MouseEvent, taskIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    remove(taskIndex);
  };

  // Toggle task completion handler
  const handleTaskCompletion = async (task: ItineraryTask) => {
    await updateTask(day.id, task.id, {
      ...task,
      completed: !task.completed,
    });
  };

  return (
    <Form key={formKey} {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card
          className="border-l-4 gap-0"
          style={{
            borderLeftColor:
              dayCompletionPercent === 100 ? "var(--success)" : "var(--muted)",
          }}
        >
          <CardHeader
            className="p-4 flex flex-row justify-between items-start cursor-pointer"
            onClick={handleHeaderClick}
          >
            <div className="flex items-center">
              <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="font-semibold text-sm">{index + 1}</span>
              </div>
              <div>
                {isEditing ? (
                  <FormField
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Title</FormLabel>
                        <FormControl>
                          <Input
                            className="p-1"
                            disabled={isLoading}
                            {...field}
                            placeholder="Day Title"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <h4 className="font-medium">{day.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {dayTasksCompleted} of {dayTasksTotal} tasks completed
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {isEditing ? (
                <FormField
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Budget</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          {...field}
                          type="number"
                          placeholder="Budget"
                          className="w-12 p-1 text-center"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <Badge variant="outline" className="mr-2 hidden md:flex">
                  <Banknote className="h-3 w-3 mr-1" />${day.budget}
                </Badge>
              )}
              {isEditing ? (
                <div className="flex">
                  <DeleteConfirm
                    buttonVariant={"ghost"}
                    itemName="day"
                    handleDelete={handleDeleteDay}
                  />
                  <Button
                    disabled={isLoading}
                    type="button"
                    variant="ghost"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    disabled={isLoading}
                    type="submit"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex">
                  <Button
                    disabled={isLoading}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEditClick}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={handleToggleClick}
                    disabled={isLoading}
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
                  // EDITING MODE TASKS
                  <>
                    {fields.length === 0 ? (
                      <div className="text-sm text-muted-foreground italic p-2 text-center border rounded-md">
                        No tasks added yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {fields.map((task, taskIndex) => (
                          <div key={task.id} className="flex items-start gap-1">
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
                            <div className="flex gap-1">
                              <div className="md:col-span-3">
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
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTask}
                      className="w-full"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </>
                ) : // VIEW MODE TASKS
                day.tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No tasks scheduled for this day
                  </p>
                ) : (
                  day.tasks.map((task: ItineraryTask) => (
                    <div
                      key={task.id}
                      className="flex rounded-md justify-between items-center px-2 py-1"
                    >
                      <span className="flex items-center space-x-2">
                        <Checkbox
                          disabled={isLoading}
                          id={task.id + "-checkbox"}
                          className="cursor-pointer"
                          checked={task.completed}
                          onCheckedChange={() => handleTaskCompletion(task)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor={task.id + "-checkbox"}
                          className={cn(
                            "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer max-w-72 line-clamp-2",
                            task.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          )}
                        >
                          {task.title}
                        </label>
                      </span>
                      {task.time && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {task.time}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </form>
    </Form>
  );
};
