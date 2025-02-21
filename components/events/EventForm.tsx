import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, EventCreate } from "@/types/events";
import { useEventMutations } from "@/lib/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EventForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: { title: "", date: "", description: "" },
  });

  const { addMutation } = useEventMutations();

  const onSubmit = async (data: EventCreate) => {
    await addMutation.mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-bold">Add Event</h2>
      <Input {...register("title")} placeholder="Event Title" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Input type="date" {...register("date")} placeholder="Event Date" />
      {errors.date && <p className="text-red-500">{errors.date.message}</p>}

      <Input {...register("description")} placeholder="Event Description" />
      <Button type="submit" disabled={isSubmitting}>
        Create Event
      </Button>
    </form>
  );
};

export default EventForm;
