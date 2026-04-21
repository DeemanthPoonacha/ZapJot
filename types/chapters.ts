import { z } from "zod";
import { journalSchema } from "./journals";

export const createChapterSchema = z.object({
  userId: z.string().describe("User ID of the Auth user"),
  image: z.string().optional().describe("Image URL of the chapter"),
  title: z.string().describe("Title of the chapter"),
  date: z
    .string()
    .optional()
    .describe("Date of the chapter in YYYY-MM-DD format"),
  subtitle: z.string().optional().describe("Subtitle of the chapter"),
  description: z.string().optional().describe("Description of the chapter"),
  journals: z
    .array(journalSchema)
    .optional()
    .describe("Array of journal posts"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateChapterSchema = createChapterSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const chapterSchema = createChapterSchema.extend({
  id: z.string().describe("ID of the chapter"),
});

export type Chapter = z.infer<typeof chapterSchema>;
export type ChapterCreate = z.infer<typeof createChapterSchema>;
export type ChapterUpdate = z.infer<typeof updateChapterSchema>;
