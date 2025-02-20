import { formatDateTitle } from "@/lib/utils/general";
import { z } from "zod";

// Base schema for creating a journal
export const createJournalSchema = z.object({
  title: z.string().default(formatDateTitle),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  location: z.string().optional(),
  gallery: z.array(z.string()).optional(), // List of image URLs (videos in future)
  chapterId: z.string(),
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

// Chapter Schema
export const createChapterSchema = z.object({
  userId: z.string(),
  title: z.string(),
  journals: z.array(journalSchema).optional(), // Array of journal posts
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateChapterSchema = createChapterSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const chapterSchema = createChapterSchema.extend({
  id: z.string(),
});

// Type inference
export type Journal = z.infer<typeof journalSchema>;
export type JournalCreate = z.infer<typeof createJournalSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
