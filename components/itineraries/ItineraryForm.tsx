import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ItineraryCreate,
  Itinerary,
  createItinerarySchema,
} from "@/types/itineraries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/hooks/useUser";
import { useItineraryMutations } from "@/lib/hooks/useItineraries";
import { toast } from "../ui/sonner";

interface ItineraryFormProps {
  itinerary?: Itinerary;
  onSuccess?: () => void;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({
  itinerary,
  onSuccess,
}) => {
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: itinerary || {},
  });

  console.log("🚀 ~ errors:", errors);
  const { addMutation } = useItineraryMutations();

  const onSubmit = async (data: ItineraryCreate) => {
    try {
      await addMutation.mutateAsync(data);
      reset();
      toast.success("Itinerary created successfully");
    } catch (error) {
      console.error("Error saving itinerary", error);
      toast.error("Failed to save itinerary");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form
      key={itinerary?.id || "new"}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Input {...register("title")} placeholder="Itinerary Title" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Input {...register("destination")} placeholder="Destination" />
      {errors.destination && (
        <p className="text-red-500">{errors.destination.message}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {itinerary ? "Update Itinerary" : "Create Itinerary"}
      </Button>
    </form>
  );
};

export default ItineraryForm;
