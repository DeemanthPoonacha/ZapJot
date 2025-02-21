import { z } from "zod";
import { journalSchema } from "./journals";

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

export type Chapter = z.infer<typeof chapterSchema>;
export type ChapterCreate = z.infer<typeof createChapterSchema>;
