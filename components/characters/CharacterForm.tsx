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
import { useAuth } from "@/lib/context/AuthProvider";

import { useState } from "react";
import { Plus } from "lucide-react";
import EventsList from "../planner/events/EventsList";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import UploadAvatar from "../ui/upload-avatar";

interface CharacterFormProps {
  character?: Character | null;
  onUpdate?: () => void;
  onAdd?: (id: string, name?: string) => void;
  onCancel?: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onUpdate,
  onAdd,
  onCancel,
}) => {
  const { user } = useAuth();
  const userId = user?.uid;
  const [isImageUploading, setIsImageUploading] = useState(false);

  const form = useForm<CharacterCreate>({
    resolver: zodResolver(createCharacterSchema),
    defaultValues: {
      userId,
      image: character?.image || "",
      name: character?.name || "",
      title: character?.title || "",
      reminders: character?.reminders || [],
      notes: character?.notes || "",
    },
  });

  const { addMutation, updateMutation } = useCharacterMutations();
  const isSubmitting =
    form.formState.isSubmitting ||
    addMutation.isPending ||
    updateMutation.isPending;

  const onSubmit = async (data: CharacterCreate) => {
    try {
      if (character?.id) {
        await updateMutation.mutateAsync({
          id: character.id,
          data: { ...data, lowercaseName: data.name.toLowerCase() },
        });
        toast.success("Character updated successfully");
        onUpdate?.();
      } else {
        const result = await addMutation.mutateAsync({
          ...data,
          lowercaseName: data.name.toLowerCase(),
        });
        toast.success("Character created successfully");
        onAdd?.(result.id, result.name);
      }
    } catch (error) {
      console.error("Error saving character", error);
      toast.error("Failed to save character");
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UploadAvatar
          form={form}
          fieldName="image"
          isImageUploading={isImageUploading}
          setIsImageUploading={setIsImageUploading}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter character name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title/Relationship</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Friend, Colleague, Family member"
                  />
                </FormControl>
                <FormDescription>
                  Define your relationship with this character
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add any personal notes about this character"
                    className="min-h-32 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!!character?.id && (
          <div className="space-y-2">
            <FormLabel className="block mb-2">Events/Reminders</FormLabel>
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
          </div>
        )}

        <div className="flex @max-md:flex-col gap-4 pt-4">
          <Button
            type="button"
            onClick={() => {
              form.reset();
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
                {character?.id ? "Updating..." : "Creating..."}
              </>
            ) : character?.id ? (
              "Update Character"
            ) : (
              "Create Character"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CharacterForm;
