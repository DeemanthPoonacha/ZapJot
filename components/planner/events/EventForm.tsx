import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { cn, getDates, getNextOccurrence } from "@/lib/utils";
import { useEventMutations } from "@/lib/hooks/useEvents";
import {
  createEventSchema,
  Event,
  EventCreate,
  RepeatType,
} from "@/types/events";
import dayjs from "dayjs";
import { Label } from "../../ui/label";
import { toast } from "../../ui/sonner";
import { WEEK_DAYS, MONTH_DAYS, ALL_MONTHS } from "../../../lib/constants";
import MultipleSelector from "../../ui/multi-select";
import { searchByName } from "@/lib/services/characters";
import { useAuth } from "@/lib/context/AuthProvider";
import DeleteConfirm from "../../ui/delete-confirm";

type EventFormProps = {
  eventData?: Event;
  onClose?: () => void;
};

export default function EventForm({ eventData, onClose }: EventFormProps) {
  const [repeatType, setRepeatType] = useState(eventData?.repeat || "none");

  const { user } = useAuth();
  const userId = user?.uid;

  const defaultValues = {
    title: eventData?.title || "",
    notes: eventData?.notes || "",
    date: eventData?.date || dayjs().format("YYYY-MM-DD"),
    time: eventData?.time || dayjs().format("HH:mm"),
    location: eventData?.location || "",
    repeat: eventData?.repeat || "none",
    repeatDays: eventData?.repeatDays || [],
    participants: eventData?.participants || [],
    nextOccurrence: (eventData?.nextOccurrence as Date) || new Date(),
    nextNotificationAt: (eventData?.nextNotificationAt as Date) || null,
  };

  const form = useForm<EventCreate>({
    resolver: zodResolver(createEventSchema),
    defaultValues: defaultValues,
  });

  console.log("part", form.watch("nextOccurrence"), form.formState.errors);

  const { addMutation, updateMutation, deleteMutation } = useEventMutations();

  const handleDelete = async () => {
    if (eventData?.id) {
      try {
        await deleteMutation.mutateAsync({
          id: eventData.id,
          participants: eventData.participants?.map((p) => p.value),
        });
        toast.success("Event deleted successfully");
        onClose?.();
      } catch (error) {
        console.error("Error deleting event", error);
        toast.error("Error deleting event");
      }
    }
  };

  const onSubmit = async (data: EventCreate) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    try {
      if (repeatType !== "none") {
        delete data.date;
      }
      data.nextOccurrence = getNextOccurrence(data)?.toDate() || new Date();

      if (eventData?.id) {
        await updateMutation.mutateAsync({
          id: eventData?.id,
          data,
        });
        toast.success("Event updated successfully");
      } else {
        await addMutation.mutateAsync(data);
        toast.success("Event created successfully");
      }
      onClose?.();
    } catch (error) {
      toast.error("Error saving event");
      console.error("Error saving event", error);
    }
  };

  // eslint-disable-next-line
  const renderWeeklySelector = (field: any) => (
    <FormItem>
      <FormLabel>Select Days</FormLabel>
      <div className="grid grid-cols-7 gap-2">
        {WEEK_DAYS.map((day, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-10 p-1 rounded-md cursor-pointer border ${
              field.value.includes(index.toString())
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted border-input"
            }`}
            onClick={() => {
              const checked = !field.value.includes(index.toString());
              let newDays = checked
                ? [...field.value, index.toString()]
                : field.value.filter((d: string) => d !== index.toString());
              if (newDays.length === 0) {
                newDays = [index.toString()]; // Ensure at least one day is selected
              }
              field.onChange(newDays);
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </FormItem>
  );

  // eslint-disable-next-line
  const renderMonthlySelector = (field: any) => (
    <FormItem>
      <FormLabel>Day</FormLabel>
      <div className="flex gap-2">
        <Select
          onValueChange={(value) => {
            field.onChange([value]);
          }}
          defaultValue={field.value[0]}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {MONTH_DAYS.map((day, index) => (
              <SelectItem key={index} value={(index + 1).toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormItem>
  );

  // eslint-disable-next-line
  const renderYearlySelector = (field: any) => {
    const monthValue = field.value[0]?.split("-")[0] || "";
    const dayValue = field.value[0]?.split("-")[1] || "";

    const handleMonthChange = (value: string) => {
      field.onChange([`${value}-${dayValue || "1"}`]);
    };

    const handleDayChange = (value: string) => {
      field.onChange([`${monthValue}-${value}`]);
    };

    return (
      <FormItem className="grid-cols-2">
        <span className="grid gap-2">
          <Label>Month</Label>
          <Select onValueChange={handleMonthChange} value={monthValue}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {ALL_MONTHS.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
        <span className="grid gap-2">
          <Label>Day</Label>
          <Select
            disabled={!monthValue}
            onValueChange={handleDayChange}
            value={dayValue}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {getDates(parseInt(monthValue) || 1).map((day, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </FormItem>
    );
  };

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
                <Input {...field} placeholder="Event title" />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat</FormLabel>
              <Select
                value={repeatType}
                onValueChange={(value) => {
                  setRepeatType(value as RepeatType);
                  field.onChange(value);
                  const repeat =
                    value === "weekly"
                      ? [`${dayjs().day()}`]
                      : value === "monthly"
                      ? [`${dayjs().date()}`]
                      : value === "yearly"
                      ? [`${dayjs().month() + 1}-${dayjs().date()}`]
                      : [];
                  form.setValue("repeatDays", repeat);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Does not repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="flex gap-2 items-end">
          {repeatType === "weekly" && (
            <FormField
              control={form.control}
              name="repeatDays"
              render={({ field }) => renderWeeklySelector(field)}
            />
          )}

          {repeatType === "monthly" && (
            <FormField
              control={form.control}
              name="repeatDays"
              render={({ field }) => renderMonthlySelector(field)}
            />
          )}

          {repeatType === "yearly" && (
            <FormField
              control={form.control}
              name="repeatDays"
              render={({ field }) => renderYearlySelector(field)}
            />
          )}

          {repeatType === "none" && (
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
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
                <Textarea {...field} placeholder="Notes" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participants</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  onSearch={async (value) => {
                    const res = await searchByName(userId!, value);
                    return res.map((option) => ({
                      label: option.name,
                      value: option.id,
                    }));
                  }}
                  creatable
                  groupBy="group"
                  placeholder="trying to search 'a' to get more options..."
                  loadingIndicator={
                    <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                      loading...
                    </p>
                  }
                  emptyIndicator={
                    <p className="w-full text-center text-lg leading-10 text-muted-foreground">
                      no results found.
                    </p>
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter location" />
              </FormControl>
            </FormItem>
          )}
        />
        <div
          className={cn(
            "flex w-full",
            eventData?.id ? "justify-between" : "justify-end"
          )}
        >
          {eventData?.id && (
            <DeleteConfirm itemName="Event" handleDelete={handleDelete} />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
