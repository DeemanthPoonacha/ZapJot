import { z } from "zod";

// Character Schema
export const createCharacterSchema = z.object({
  userId: z.string().describe("User ID of the Auth user, not the character"),
  image: z.string().optional().describe("Image URL of the character"),
  name: z.string().min(1, "Name is required").describe("Name of the character"),
  lowercaseName: z
    .string()
    .optional()
    .describe("Lowercase name of the character for searching"),
  title: z
    .string()
    .optional()
    .describe("Title or nickname or relationship of the character"),
  reminders: z
    .array(z.string())
    .default([])
    .describe(
      "Array of IDs of reminders or special dates like birthdays, anniversaries, etc.",
    ),
  notes: z.string().optional().describe("Notes about the character"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateCharacterSchema = createCharacterSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const characterSchema = createCharacterSchema.extend({
  id: z.string().describe("ID of the character"),
});

// Type Inference
export type Character = z.infer<typeof characterSchema>;
export type CharacterCreate = z.infer<typeof createCharacterSchema>;
export type CharacterUpdate = z.infer<typeof updateCharacterSchema>;

export interface CharactersFilter {
  characterIds?: string[];
}
