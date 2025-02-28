import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJournalSchema, Journal, JournalCreate } from "@/types/journals";
import { useUser } from "@/lib/hooks/useUser";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useJournalMutations } from "@/lib/hooks/useJournals";
import { GetDateTime } from "@/lib/utils";
import ImageUploader from "@/components/ui/image-uploader"; // Import ImageUploader component
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "../ui/sonner";

interface JournalFormProps {
  chapterId: string;
  journal?: Journal;
  onAdd?: (id: string) => void;
  onUpdate?: () => void;
}

const JournalForm: React.FC<JournalFormProps> = ({
  chapterId,
  journal,
  onUpdate,
  onAdd,
}) => {
  const { user } = useUser();
  const { addMutation, updateMutation } = useJournalMutations(chapterId);

  const defaultValues = {
    title: journal?.title || `New Journal - ${GetDateTime()}`,
    description: journal?.description || "",
    chapterId,
    coverImage: journal?.coverImage || "",
  };
  const form = useForm({
    resolver: zodResolver(createJournalSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const isSubmitting =
    form.formState.isSubmitting ||
    addMutation.isPending ||
    updateMutation.isPending;
  const onSubmit = async (data: JournalCreate) => {
    try {
      if (journal?.id) {
        await updateMutation.mutateAsync({ journalId: journal.id, data });
        toast.success("Journal updated successfully");
        onUpdate?.();
      } else {
        const result = await addMutation.mutateAsync(data);
        toast.success("Journal created successfully");
        onAdd?.(result.id);
      }
    } catch (error) {
      console.error("Error saving journal", error);
      toast.error("Failed to save journal");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Journal title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Journal description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUploader
                  imageUrl={field.value}
                  onImageUpload={(url) => field.onChange(url)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={() => form.reset(defaultValues)}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1"
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {journal ? "Updating..." : "Creating..."}
              </>
            ) : journal ? (
              "Update Journal"
            ) : (
              "Create Journal"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JournalForm;
