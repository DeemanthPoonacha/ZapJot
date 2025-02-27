import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Character,
  CharacterCreate,
  createCharacterSchema,
} from "@/types/characters";
import { useCharacter, useCharacterMutations } from "@/lib/hooks/useCharacters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/lib/hooks/useUser";
import { useState } from "react";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { Plus, Calendar } from "lucide-react";
import { Card } from "../ui/card";
import { useEvent } from "@/lib/hooks/useEvents";
import EventsList from "../events/EventsList";

interface CharacterFormProps {
  character?: Character | null;
  onSuccess?: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSuccess,
}) => {
  const { user } = useUser();
  const userId = user?.uid;

  const defaultValues = {
    userId,
    image: character?.image || "",
    name: character?.name || "",
    title: character?.title || "",
    reminders: character?.reminders || [],
    notes: character?.notes || "",
  };
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CharacterCreate>({
    resolver: zodResolver(createCharacterSchema),
    defaultValues,
  });
  console.log("🚀 ~ register:", watch("image"));
  console.log("🚀 ~ errors:", errors);

  const { addMutation, updateMutation } = useCharacterMutations();

  const onSubmit = async (data: CharacterCreate) => {
    try {
      if (character?.id) {
        await updateMutation.mutateAsync({
          id: character.id,
          data: { ...data, lowercaseName: data.name.toLowerCase() },
        });
      } else {
        await addMutation.mutateAsync({
          ...data,
          lowercaseName: data.name.toLowerCase(),
        });
      }
      reset(defaultValues);
      console.log("🚀 ~ onSubmit ~ data:", data);

      onSuccess?.();
    } catch (error) {
      console.error("Error saving character", error);
    }
  };

  const onReset = () => {
    console.log("🚀 ~ onReset ~ defaultValues:", defaultValues);
    reset(defaultValues);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
      <Card className="p-4 text-center">
        <div className="relative mx-auto h-32 w-32 mb-4">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src={watch("image") || "/placeholder.svg"}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            size="icon"
            className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input {...register("name")} placeholder="Name" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">Title/Relationship</Label>
          <Input {...register("title")} placeholder="Title/Relationship" />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea {...register("notes")} placeholder="Notes" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Events/Reminders</Label>

        {!!character && (
          <EventsList
            query={{ eventIds: character?.reminders || [] }}
            addNewButton={
              <>
                <Plus className="mr-2 h-4 w-4" /> Add Event/Reminder
              </>
            }
            defaultNewEvent={{
              participants: [{ label: character.name, value: character.id }],
            }}
          />
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="reset"
          onClick={onReset}
          variant="outline"
          disabled={isSubmitting}
          className="w-full"
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          Save
        </Button>
      </div>
    </form>
  );
};

export default CharacterForm;
