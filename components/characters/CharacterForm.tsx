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
import { Plus, Upload, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import EventsList from "../events/EventsList";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CharacterFormProps {
  character?: Character | null;
  onUpdate?: () => void;
  onAdd?: (id: string) => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onUpdate,
  onAdd,
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
        onAdd?.(result.id);
      }
    } catch (error) {
      console.error("Error saving character", error);
      toast.error("Failed to save character");
    }
  };

  // Mock function for image upload - replace with your actual implementation
  const handleImageUpload = () => {
    setIsImageUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      form.setValue(
        "image",
        "https://api.dicebear.com/7.x/personas/svg?seed=" + Math.random()
      );
      setIsImageUploading(false);
      toast.success("Image uploaded successfully");
    }, 1000);
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
        <Card className="overflow-hidden">
          <CardContent className="p-6 text-center flex flex-col items-center">
            <div className="relative mb-6 mt-2">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={form.watch("image") || "/placeholder.svg"}
                  alt="Profile picture"
                />
                <AvatarFallback className="bg-muted">
                  <User className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>

              <Button
                type="button"
                size="icon"
                onClick={handleImageUpload}
                disabled={isImageUploading}
                className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90 h-10 w-10 shadow-md"
              >
                {isImageUploading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Image URL"
                      className="text-sm text-center"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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

        {!!character && (
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

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={() => form.reset()}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1"
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {character ? "Updating..." : "Creating..."}
              </>
            ) : character ? (
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
