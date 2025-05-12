import { useEffect, useState } from "react";
import { DEFAULT_CHAPTER_ID } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useChapters } from "@/lib/hooks/useChapters";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJournalSchema, Journal, JournalCreate } from "@/types/journals";

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

interface JournalFormProps {
  chapterId: string;
  journal?: Journal;
  onFinish?: (id: string, chId?: string) => void;
  onCancel?: () => void;
  defaultCamOpen?: boolean;
}

const JournalForm: React.FC<JournalFormProps> = ({
  chapterId,
  journal,
  onFinish,
  onCancel,
  defaultCamOpen,
}) => {
  const { addMutation, updateMutation } = useJournalMutations(chapterId);
  const { data: chapters, isLoading } = useChapters();
  const [chapterOptions, setChapterOptions] = useState<
    { id: string; title: string }[]
  >([]);

  useEffect(() => {
    if (chapters) {
      const options = chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
      }));
      if (!options.some((chapter) => chapter.id === DEFAULT_CHAPTER_ID)) {
        options?.push({
          id: DEFAULT_CHAPTER_ID,
          title: "Others",
        });
      }
      setChapterOptions(options);
    }
  }, [chapters]);

  const defaultValues = {
    title: journal?.title || `New Journal - ${GetDateTime()}`,
    content: journal?.content || "",
    chapterId: chapterId || DEFAULT_CHAPTER_ID,
    coverImage: journal?.coverImage || "",
    date: journal?.date || new Date().toISOString(), // Add default value for date
    location: journal?.location || "",
    iv: journal?.iv || "",
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
    console.log("🚀 ~ onSubmit ~ data:", data);
    try {
      let jId = journal?.id;
      const chId = data.chapterId || chapterId;

      if (journal?.id) {
        await updateMutation.mutateAsync({ journalId: journal.id, data });
        toast.success("Journal updated successfully");
      } else {
        const result = await addMutation.mutateAsync(data);
        jId = result.id;
        toast.success("Journal created successfully");
      }

      onFinish?.(jId!, chId);
    } catch (error) {
      console.error("Error saving journal", error);
      toast.error("Failed to save journal");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 space-y-6">
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
          defaultCamOpen={defaultCamOpen}
          form={form}
          fieldName="coverImage"
          isImageUploading={isImageUploading}
          setIsImageUploading={setIsImageUploading}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            disabled={isLoading}
            control={form.control}
            name="chapterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chapter</FormLabel>
                <FormControl>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapterOptions?.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="flex max-md:flex-col gap-4 pt-4">
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
