import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, ChapterCreate } from "@/types/chapters";
import { createChapterSchema } from "@/types/chapters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/hooks/useUser";
import { useChapterMutations } from "@/lib/hooks/useChapters";

interface ChapterFormProps {
  chapter?: Chapter;
  onSuccess?: () => void;
}

const ChapterForm: React.FC<ChapterFormProps> = ({ chapter, onSuccess }) => {
  const { user } = useUser();
  const userId = user?.uid;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChapterCreate>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      title: chapter?.title || "New Chapter",
    },
  });

  const { addMutation, updateMutation } = useChapterMutations();

  const onSubmit = async (data: ChapterCreate) => {
    if (!userId) return;
    try {
      chapter
        ? await updateMutation.mutateAsync({ chapterId: chapter.id, data })
        : await addMutation.mutateAsync(data);

      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving chapter", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form
      key={chapter?.id || "new"}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Input {...register("title")} placeholder="Chapter Title" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {chapter ? "Update Chapter" : "Create Chapter"}
      </Button>
    </form>
  );
};

export default ChapterForm;
