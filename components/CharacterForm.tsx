import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useCharacter } from "@/lib/hooks/useCharacters";
import { addCharacter, updateCharacter } from "@/lib/services/characters";
import {
  Character,
  CharacterCreate,
  createCharacterSchema,
} from "@/types/characters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CharacterFormProps {
  character?: Character;
  onSuccess?: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSuccess,
}) => {
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CharacterCreate>({
    resolver: zodResolver(createCharacterSchema),
    defaultValues: {
      name: character?.name || "",
      title: character?.title || "",
      // reminders: character?.reminders || [],
      notes: character?.notes || "",
      userId: character?.userId || user?.uid || "",
    },
  });
  console.log("Errors:", errors);

  // useEffect(() => {
  //   if (character) reset(character);
  // }, [character, reset]);

  const onSubmit = async (data: CharacterCreate) => {
    console.log("🚀 ~ onSubmit ~ user:", user);
    console.log("🚀 ~ onSubmit ~ Character:", data);
    if (!user) return;
    try {
      character?.id
        ? await updateCharacter(character?.id, data)
        : await addCharacter(data);
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
