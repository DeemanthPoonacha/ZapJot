import { formatDateTitle } from "@/lib/utils/date-time";
import { z } from "zod";

// Base schema for creating a journal
export const createJournalSchema = z.object({
  title: z.string().default(formatDateTitle).describe("Title of the journal"),
  content: z.string().optional().describe("Content of the journal"),
  iv: z.string().describe("Initialization vector for encryption"),
  coverImage: z
    .string()
    .optional()
    .describe("URL of the cover image for the journal"),
  location: z.string().optional().describe("Location of the journal"),
  gallery: z
    .array(z.string())
    .optional()
    .describe("List of image URLs for the journal"), // List of image URLs (videos in future)
  chapterId: z.string().describe("ID of the chapter this journal belongs to"),
  date: z.string().optional().describe("Date of the journal"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateJournalSchema = createJournalSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Full journal schema (extends creation schema)
export const journalSchema = createJournalSchema.extend({
  id: z.string().describe("ID of the Journal"), // Firestore ID
});

// Type inference
export type Journal = z.infer<typeof journalSchema>;
export type JournalCreate = z.infer<typeof createJournalSchema>;
export type JournalUpdate = z.infer<typeof updateJournalSchema>;
