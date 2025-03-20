import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, ChapterCreate, createChapterSchema } from "@/types/chapters";
import { useChapterMutations } from "@/lib/hooks/useChapters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/context/AuthProvider";

import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatePicker from "@/components/ui/date-picker"; // Import DatePicker component
import ImageUploader from "@/components/ui/image-uploader"; // Import ImageUploader component
import UploadImage from "../ui/upload-image";
import { useState } from "react";

interface ChapterFormProps {
  chapter?: Chapter;
  onAdd?: (id: string) => void;
  onUpdate?: () => void;
  onCancel?: () => void;
}

const ChapterForm: React.FC<ChapterFormProps> = ({
  chapter,
  onAdd,
  onUpdate,
  onCancel,
}) => {
  const { user } = useAuth();
  const userId = user?.uid;

  const defaultValues = {
    userId: userId || "",
    image: chapter?.image || "",
    title: chapter?.title || "New Chapter",
    subtitle: chapter?.subtitle || "",
    description: chapter?.description || "",
    journals: chapter?.journals || [],
    date: chapter?.date || new Date().toISOString(), // Add default value for date
  };
  const form = useForm<ChapterCreate>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: defaultValues,
  });

  const { addMutation, updateMutation } = useChapterMutations();

  const [isImageUploading, setIsImageUploading] = useState(false);
  const isSubmitting =
    isImageUploading ||
    form.formState.isSubmitting ||
    addMutation.isPending ||
    updateMutation.isPending;

  const onSubmit = async (data: ChapterCreate) => {
    try {
      if (chapter?.id) {
        await updateMutation.mutateAsync({
          chapterId: chapter.id,
          data,
        });
        toast.success("Chapter updated successfully");
        onUpdate?.();
      } else {
        const result = await addMutation.mutateAsync(data);
        console.log("🚀 ~ onSubmit ~ result:", result);
        toast.success("Chapter created successfully");
        onAdd?.(result.id);
      }
    } catch (error) {
      console.error("Error saving chapter", error);
      toast.error("Failed to save chapter");
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

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
                <Input {...field} placeholder="Chapter title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Chapter subtitle" />
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
                <Textarea {...field} placeholder="Chapter description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
                  selected={new Date(field.value || "")}
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

        <UploadImage
          form={form}
          fieldName="image"
          isImageUploading={isImageUploading}
          setIsImageUploading={setIsImageUploading}
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
                {chapter ? "Updating..." : "Creating..."}
              </>
            ) : chapter ? (
              "Update Chapter"
            ) : (
              "Create Chapter"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChapterForm;
