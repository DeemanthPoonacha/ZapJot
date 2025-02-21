import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Character,
  CharacterCreate,
  createCharacterSchema,
} from "@/types/characters";
import { useCharacterMutations } from "@/lib/hooks/useCharacters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/lib/hooks/useUser";

interface CharacterFormProps {
  character?: Character;
  onSuccess?: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSuccess,
}) => {
  const { user } = useUser();
  const userId = user?.uid;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CharacterCreate>({
    resolver: zodResolver(createCharacterSchema),
    defaultValues: {
      userId,
      name: character?.name || "",
      title: character?.title || "",
      reminders: character?.reminders || [],
      notes: character?.notes || "",
    },
  });
  console.log("🚀 ~ errors:", errors);

  const { addMutation, updateMutation } = useCharacterMutations();

  const onSubmit = async (data: CharacterCreate) => {
    try {
      if (character?.id) {
        await updateMutation.mutateAsync({ id: character.id, data });
      } else {
        await addMutation.mutateAsync(data);
      }
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving character", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name")} placeholder="Name" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <Input {...register("title")} placeholder="Title/Relationship" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Textarea {...register("notes")} placeholder="Notes" />

      <Button type="submit" disabled={isSubmitting}>
        {character?.id ? "Update Character" : "Add Character"}
      </Button>
    </form>
  );
};

export default CharacterForm;
