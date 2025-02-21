import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJournalSchema, Journal, JournalCreate } from "@/types/journals";
import { useUser } from "@/lib/hooks/useUser";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useJournalMutations } from "@/lib/hooks/useJournals";
import { GetDateTime } from "@/lib/utils";

interface JournalFormProps {
  chapterId: string;
  journal?: Journal;
  onSuccess?: () => void;
}

const JournalForm: React.FC<JournalFormProps> = ({
  chapterId,
  journal,
  onSuccess,
}) => {
  const { user } = useUser();
  const { addMutation, updateMutation } = useJournalMutations(
    chapterId,
    onSuccess
  );

  const defaultValues = {
    title: journal?.title || `New Journal - ${GetDateTime()}`,
    description: journal?.description || "",
    chapterId,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createJournalSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = async (data: JournalCreate) => {
    journal
      ? await updateMutation.mutateAsync({ journalId: journal.id, data })
      : await addMutation.mutateAsync(data);
    reset(defaultValues);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("title")} placeholder="Title (Optional)" />
      <Textarea
        {...register("description")}
        placeholder="Write your journal..."
      />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {journal ? "Update Journal" : "Add Journal"}
      </Button>
    </form>
  );
};

export default JournalForm;
