"use client";

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
import { User, Briefcase, Mail, Phone, FileText } from "lucide-react";

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
      email: character?.email || "",
      phone: character?.phone || "",
      reminders: character?.reminders || [],
      notes: character?.notes || "",
      source: character?.source || "manual",
      googleContactId: character?.googleContactId || undefined,
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
          data: {
            ...data,
            source: character.source || data.source || "manual",
            googleContactId: character.googleContactId || data.googleContactId,
            lowercaseName: data.name.toLowerCase(),
          },
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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload Container */}
        <div className="flex justify-center pb-2">
          <UploadAvatar
            form={form}
            fieldName="image"
            isImageUploading={isImageUploading}
            setIsImageUploading={setIsImageUploading}
          />
        </div>

        {/* Input Fields Section */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter character name..."
                    className="bg-card/70 border-border/80 rounded-xl"
                  />
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
                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Title / Relationship
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Friend, Colleague, Manager, Client"
                    className="bg-card/70 border-border/80 rounded-xl"
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  Specify how you know or interact with this person.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="e.g. name@example.com"
                      className="bg-card/70 border-border/80 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="e.g. +1 (555) 000-0000"
                      className="bg-card/70 border-border/80 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Personal Notes
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add personal notes, context, or important details about this character..."
                    className="min-h-32 resize-none bg-card/70 border-border/80 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/60">
          <Button
            type="button"
            onClick={() => {
              form.reset();
              onCancel?.();
            }}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1 rounded-xl"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl font-semibold">
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
