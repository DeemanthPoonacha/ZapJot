import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/sonner";
import { useItineraryMutations } from "@/lib/hooks/useItineraries";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, PlusCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Itinerary,
  ItineraryCreate,
  createItinerarySchema,
} from "@/types/itineraries";
import { cn } from "@/lib/utils";
import DeleteConfirm from "../ui/delete-confirm";

interface ItineraryFormProps {
  itineraryData?: Itinerary;
  onClose?: () => void;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({
  itineraryData,
  onClose,
}) => {
  const { addMutation, updateMutation, deleteMutation } =
    useItineraryMutations();
  const isEditing = !!itineraryData?.id;

  // Form setup
  const form = useForm<ItineraryCreate>({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: {
      title: itineraryData?.title || "",
      destination: itineraryData?.destination || "",
      startDate: itineraryData?.startDate || "",
      endDate: itineraryData?.endDate || "",
      totalDays: itineraryData?.totalDays || 0,
      budget: itineraryData?.budget || 0,
      actualCost: itineraryData?.actualCost || 0,
      days: itineraryData?.days || [
        {
          id: Date.now().toString(),
          title: "Day 1",
          budget: 0,
          tasks: [],
        },
      ],
    },
  });

  const {
    fields: dayFields,
    append: addDay,
    remove: removeDay,
  } = useFieldArray({
    control: form.control,
    name: "days",
  });

  // Form handlers
  const handleAddDay = () => {
    addDay({
      id: Date.now().toString(),
      title: `Day ${dayFields.length + 1}`,
      budget: 0,
      tasks: [],
    });
  };

  const handleDelete = async () => {
    if (!isEditing) return;

    try {
      await deleteMutation.mutateAsync(itineraryData.id);
      toast.success("Itinerary deleted successfully");
      onClose?.();
    } catch (error) {
      toast.error("Error deleting itinerary");
      console.error(error);
    }
  };

  const onSubmit = async (data: ItineraryCreate) => {
    try {
      if (isEditing && itineraryData) {
        await updateMutation.mutateAsync({ id: itineraryData.id, data });
        toast.success("Itinerary updated successfully");
      } else {
        await addMutation.mutateAsync(data);
        toast.success("Itinerary created successfully");
        form.reset();
      }
      onClose?.();
    } catch (error) {
      console.error("Error saving itinerary", error);
      toast.error("Failed to save itinerary");
    }
  };

  // Calculate date range and update totalDays
  const updateTotalDays = () => {
    const startDate = form.getValues("startDate");
    const endDate = form.getValues("endDate");

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      form.setValue("totalDays", diffDays);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Itinerary Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Itinerary Title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Destination" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      updateTotalDays();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      updateTotalDays();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actualCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Days Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <FormLabel className="text-lg">
              Days ({form.watch("totalDays") || 0})
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDay}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Day
            </Button>
          </div>

          {dayFields.length === 0 ? (
            <div className="text-sm text-muted-foreground italic p-4 text-center border rounded-md">
              No days added yet. Click "Add Day" to get started.
            </div>
          ) : (
            <Accordion
              type="multiple"
              // defaultValue={dayFields.map((day) => day.id)}
              className="w-full overflow-auto max-h-96"
            >
              {dayFields.map((day, dayIndex) => (
                <AccordionItem key={day.id} value={day.id}>
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="flex-1 text-left">
                      <span className="font-medium">
                        {form.watch(`days.${dayIndex}.title`) ||
                          `Day ${dayIndex + 1}`}
                      </span>
                    </AccordionTrigger>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDay(dayIndex);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <AccordionContent>
                    <div className="p-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`days.${dayIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day Title</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Day Title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`days.${dayIndex}.budget`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day Budget</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  value={field.value}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Day Tasks */}
                      <TasksList dayIndex={dayIndex} form={form} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <div
          className={cn(
            "flex w-full pt-4 border-t mt-6",
            isEditing ? "justify-between" : "justify-end"
          )}
        >
          {isEditing && (
            <DeleteConfirm itemName="Itinerary" handleDelete={handleDelete} />
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

// Tasks subcomponent for better organization
const TasksList = ({
  dayIndex,
  form,
}: {
  dayIndex: number;
  form: UseFormReturn<ItineraryCreate>;
}) => {
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: `days.${dayIndex}.tasks`,
  });

  const handleAddTask = () => {
    append({
      id: Date.now().toString(),
      title: "",
      time: "",
      completed: false,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FormLabel>Tasks</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddTask}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-sm text-muted-foreground italic p-2 text-center border rounded-md">
          No tasks added yet
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((task, taskIndex) => (
            <div
              key={task.id}
              className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg"
            >
              <FormField
                control={form.control}
                name={`days.${dayIndex}.tasks.${taskIndex}.completed`}
                render={({ field }) => (
                  <FormItem className="flex-none mt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name={`days.${dayIndex}.tasks.${taskIndex}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-1 mb-0">
                        <FormControl>
                          <Input {...field} placeholder="Task Description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-1">
                  <FormField
                    control={form.control}
                    name={`days.${dayIndex}.tasks.${taskIndex}.time`}
                    render={({ field }) => (
                      <FormItem className="flex-1 mb-0">
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            placeholder="Time (e.g. 2:00 PM)"
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
                onClick={() => remove(taskIndex)}
                className="h-8 w-8 flex-none"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryForm;
