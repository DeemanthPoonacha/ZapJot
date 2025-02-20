import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { addJournal, updateJournal } from "@/lib/services/journals";
import { useUser } from "@/lib/hooks/useUser";
import { useChapters } from "@/lib/hooks/useChapters";
import { createJournalSchema, Journal, JournalCreate } from "@/types/journals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateTitle } from "@/lib/utils";

interface JournalFormProps {
  journal?: Journal;
  onSuccess?: () => void;
}

const JournalForm: React.FC<JournalFormProps> = ({ journal, onSuccess }) => {
  const { user } = useUser();
  const { data: chapters, isLoading: chaptersLoading } = useChapters();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JournalCreate>({
    resolver: zodResolver(createJournalSchema),
    defaultValues: {
      title: journal?.title || formatDateTitle(),
      description: journal?.description || "",
      chapterId: journal?.chapterId || `${user?.uid}_others`,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: JournalCreate) =>
      journal
        ? updateJournal(journal.chapterId, journal.id, {
            ...data,
            updatedAt: new Date().toISOString(),
          })
        : addJournal(
            user!.uid,
            data.chapterId,
            data.title || new Date().toDateString(),
            data.description
          ),
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = async (data: JournalCreate) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("title")} placeholder="Title (optional)" />
      <Textarea
        {...register("description")}
        placeholder="Write your journal..."
      />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}

      <Select
        onValueChange={(value) => setValue("chapterId", value)}
        defaultValue={watch("chapterId")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a chapter" />
        </SelectTrigger>
        <SelectContent>
          {chaptersLoading ? (
            <SelectItem value="loading" disabled>
              Loading chapters...
            </SelectItem>
          ) : (
            chapters?.map((ch) => (
              <SelectItem key={ch.id} value={ch.id}>
                {ch.title}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending
          ? "Saving..."
          : journal
          ? "Update Journal"
          : "Add Journal"}
      </Button>
    </form>
  );
};

export default JournalForm;
