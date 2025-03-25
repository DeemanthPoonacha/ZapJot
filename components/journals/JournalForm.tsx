import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJournalSchema, Journal, JournalCreate } from "@/types/journals";
import { useAuth } from "@/lib/context/AuthProvider";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useJournalMutations } from "@/lib/hooks/useJournals";
import { GetDateTime } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "../ui/sonner";
import DatePicker from "../ui/date-picker";
import UploadImage from "../ui/upload-image";
import { useState } from "react";

interface JournalFormProps {
  chapterId: string;
  journal?: Journal;
  onAdd?: (id: string) => void;
  onUpdate?: () => void;
  onCancel?: () => void;
}

const JournalForm: React.FC<JournalFormProps> = ({
  chapterId,
  journal,
  onUpdate,
  onAdd,
  onCancel,
}) => {
  const { user } = useAuth();
  const { addMutation, updateMutation } = useJournalMutations(chapterId);

  const defaultValues = {
    title: journal?.title || `New Journal - ${GetDateTime()}`,
    content: journal?.content || "",
    chapterId,
    coverImage: journal?.coverImage || "",
    date: journal?.date || new Date().toISOString(), // Add default value for date
    location: journal?.location || "",
  };
  const form = useForm({
    resolver: zodResolver(createJournalSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const [isImageUploading, setIsImageUploading] = useState(false);
  const isSubmitting =
    isImageUploading ||
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

        <UploadImage
          form={form}
          fieldName="coverImage"
          isImageUploading={isImageUploading}
          setIsImageUploading={setIsImageUploading}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  mode="single"
                  selected={new Date(field.value ?? "")}
                  onSelect={(date) => field.onChange(date?.toISOString())}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </FormControl>
              <FormMessage />
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
                <Input {...field} placeholder="Journal location" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Journal content" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={() => {
              form.reset(defaultValues);
              onCancel?.();
            }}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
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
