import { date, z } from "zod";
import { journalSchema } from "./journals";

// Chapter Schema

export const createChapterSchema = z.object({
  userId: z.string(),
  image: z.string().optional(),
  title: z.string(),
  date: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
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
