import { z } from "zod";

// Character Schema
export const createCharacterSchema = z.object({
  userId: z.string(),
  image: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  lowercaseName: z.string().optional(),
  title: z.string().optional(), // Relationship or nickname
  reminders: z.array(z.string()).default([]), // Special dates like birthdays
  notes: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateCharacterSchema = createCharacterSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const characterSchema = createCharacterSchema.extend({
  id: z.string(),
});

// Type Inference
export type Character = z.infer<typeof characterSchema>;
export type CharacterCreate = z.infer<typeof createCharacterSchema>;
export type CharacterUpdate = z.infer<typeof updateCharacterSchema>;

export interface CharactersFilter {
  characterIds?: string[];
}
