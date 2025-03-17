import { formatDateTitle } from "@/lib/utils";
import { z } from "zod";

// Base schema for creating a journal
export const createJournalSchema = z.object({
  title: z.string().default(formatDateTitle),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  location: z.string().optional(),
  gallery: z.array(z.string()).optional(), // List of image URLs (videos in future)
  chapterId: z.string(),
  date: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateJournalSchema = createJournalSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Full journal schema (extends creation schema)
export const journalSchema = createJournalSchema.extend({
  id: z.string(), // Firestore ID
});

// Type inference
export type Journal = z.infer<typeof journalSchema>;
export type JournalCreate = z.infer<typeof createJournalSchema>;
