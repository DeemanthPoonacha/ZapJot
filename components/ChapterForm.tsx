import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChapterSchema, Chapter, ChapterCreate } from "@/types/journals";
import { useMutation } from "@tanstack/react-query";
import { addChapter, updateChapter } from "@/lib/services/journals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useUser } from "@/lib/hooks/useUser";

interface ChapterFormProps {
  chapter?: Chapter;
  onSuccess?: () => void;
}

const ChapterForm: React.FC<ChapterFormProps> = ({ chapter, onSuccess }) => {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      title: chapter?.title || `Chapter-${Date.now()}`,
      userId: chapter?.userId || user?.uid || "",
    },
  });
  const mutation = useMutation({
    mutationFn: async (data: ChapterCreate) =>
      chapter
        ? updateChapter(chapter.id, data)
        : addChapter(data.userId, data.title),
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = async (data: ChapterCreate) => {
    await mutation.mutateAsync(data);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("title")} placeholder="Chapter Title" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {chapter ? "Update Chapter" : "Create Chapter"}
      </Button>
    </form>
  );
};

export default ChapterForm;
