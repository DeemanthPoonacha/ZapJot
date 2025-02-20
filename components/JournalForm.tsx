import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { addJournal, updateJournal } from "@/lib/services/journals";
import { useUser } from "@/lib/hooks/useUser";
import { Journal } from "@/types/journals";
import { useChapters } from "@/lib/hooks/useChapters";

const journalSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  chapterId: z.string(),
});

type JournalFormValues = z.infer<typeof journalSchema>;

const JournalForm = ({ journal }: { journal?: Journal }) => {
  const { user } = useUser();
  const { data: chapters, isLoading: chaptersLoading } = useChapters();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: journal || { chapterId: `${user?.uid}_others` },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: JournalFormValues) => {
    if (!user) return;
    setLoading(true);
    try {
      if (journal) {
        await updateJournal(journal.chapterId, journal.id, {
          ...data,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await addJournal(
          user.uid,
          data.chapterId,
          data.title || new Date().toDateString(),
          data.description
        );
      }
    } catch (error) {
      console.error("Error saving journal", error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("title")}
        placeholder="Title (optional)"
        className="input"
      />
      <textarea
        {...register("description")}
        placeholder="Write your journal..."
        className="textarea"
      />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}
      <select {...register("chapterId")} className="select">
        {chapters?.map((ch) => (
          <option key={ch.id} value={ch.id}>
            {ch.title}
          </option>
        ))}
      </select>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Saving..." : journal ? "Update Journal" : "Add Journal"}
      </button>
    </form>
  );
};

export default JournalForm;
