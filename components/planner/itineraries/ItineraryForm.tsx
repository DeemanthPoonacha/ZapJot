import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../../ui/sonner";
import { useItineraryMutations } from "@/lib/hooks/useItineraries";

// UI Components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Save,
  PlusCircle,
  Ban,
  GripVertical,
} from "lucide-react";
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
import DeleteConfirm from "../../ui/delete-confirm";
import { useState } from "react";
import UploadImage from "../../ui/upload-image";
import { Reorder } from "framer-motion";

interface ItineraryFormProps {
  itineraryData?: Itinerary;
  onClose?: () => void;
  onSave?: () => void;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({
  itineraryData,
  onClose,
  onSave,
}) => {
  const { addMutation, updateMutation, deleteMutation } =
    useItineraryMutations();
  const isEditing = !!itineraryData?.id;
  const [isImageUploading, setIsImageUploading] = useState(false);

  const form = useForm<ItineraryCreate>({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: itineraryData
      ? {
          title: itineraryData.title || "",
          destination: itineraryData.destination || "",
          coverImage: itineraryData.coverImage || "",
          startDate: itineraryData.startDate || "",
          endDate: itineraryData.endDate || "",
          totalDays: itineraryData.totalDays || 0,
          budget: itineraryData.budget || 0,
          actualCost: itineraryData.actualCost || 0,
          days: itineraryData.days || [],
          notes: itineraryData.notes || "",
        }
      : {
          title: "",
          destination: "",
          coverImage: "",
          startDate: "",
          endDate: "",
          totalDays: 0,
          budget: 0,
          actualCost: 0,
          days: [],
          notes: "",
        },
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control: form.control,
    name: "days",
  });

  const onSubmit = async (data: ItineraryCreate) => {
    try {
      if (isEditing && itineraryData?.id) {
        await updateMutation.mutateAsync({ id: itineraryData.id, data });
        toast.success("Itinerary updated successfully!");
      } else {
        await addMutation.mutateAsync(data);
        toast.success("Itinerary created successfully!");
      }
      onSave?.();
      onClose?.();
    } catch (error) {
      console.error("Failed to save itinerary:", error);
      toast.error("Failed to save itinerary.");
    }
  };

  const handleDelete = async () => {
    if (!itineraryData?.id) return;
    try {
      await deleteMutation.mutateAsync(itineraryData.id);
      toast.success("Itinerary deleted successfully!");
      onSave?.();
      onClose?.();
    } catch (error) {
      console.error("Failed to delete itinerary:", error);
      toast.error("Failed to delete itinerary.");
    }
  };

  const handleAddDay = () => {
    const dayNumber = dayFields.length + 1;
    appendDay({
      id: Date.now().toString(),
      title: `Day ${dayNumber}`,
      budget: 0,
      tasks: [],
    });

    form.setValue("totalDays", dayFields.length + 1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Cover Image Upload */}
        <div className="space-y-2">
          <UploadImage
            form={form}
            fieldName="coverImage"
            isImageUploading={isImageUploading}
            setIsImageUploading={setIsImageUploading}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer in Tokyo 2026" {...field} />
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
                <Input placeholder="e.g. Tokyo, Japan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="totalDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
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
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Budget</FormLabel>
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

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add flight numbers, hotel confirmation codes, packing list, or emergency contacts..."
                  className="min-h-24 resize-y"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              {`No days added yet. Click "Add Day" to get started.`}
            </div>
          ) : (
            <Accordion
              type="multiple"
              className="w-full overflow-auto max-h-[500px]"
            >
              {dayFields.map((day, dayIndex) => (
                <AccordionItem key={day.id} value={day.id}>
                  <div className="flex items-center justify-between sticky top-0 z-10 bg-background/90">
                    <AccordionTrigger className="flex-1 text-left sticky top-0">
                      <span className="font-medium">
                        {form.watch(`days.${dayIndex}.title`) ||
                          `Day ${dayIndex + 1}`}
                      </span>
                    </AccordionTrigger>
                    <div className="space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Budget: ${form.watch(`days.${dayIndex}.budget`) || 0}
                      </span>
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
                                      parseFloat(e.target.value) || 0,
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

                      {/* Day Tasks with Drag & Drop Reordering */}
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
            isEditing ? "justify-between" : "justify-end",
          )}
        >
          {isEditing && (
            <DeleteConfirm itemName="Itinerary" handleDelete={handleDelete} />
          )}
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              <Ban />
              Cancel
            </Button>
            <Button type="submit" disabled={isImageUploading}>
              <Save />
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

// Tasks subcomponent with drag-and-drop sortability for itinerary day activities
const TasksList = ({
  dayIndex,
  form,
}: {
  dayIndex: number;
  form: UseFormReturn<ItineraryCreate>;
}) => {
  const { fields, append, remove, replace } = useFieldArray({
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

  const handleReorderTasks = (newTasks: typeof fields) => {
    replace(newTasks);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FormLabel>Activities / Tasks</FormLabel>
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
        <Reorder.Group
          axis="y"
          values={fields}
          onReorder={handleReorderTasks}
          className="space-y-2"
        >
          {fields.map((task, taskIndex) => (
            <Reorder.Item
              key={task.id}
              value={task}
              className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg group cursor-grab active:cursor-grabbing border border-transparent hover:border-border transition-all"
            >
              <div className="mt-2 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 cursor-grab">
                <GripVertical className="h-4 w-4" />
              </div>
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
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default ItineraryForm;
