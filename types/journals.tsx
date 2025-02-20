import { z } from "zod";

export const journalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  location: z.string().optional(),
  images: z.array(z.string()).optional(),
  createdAt: z.string().default(() => new Date().toISOString()), // Auto-filled
  userId: z.string(),
});

export type Journal = z.infer<typeof journalSchema>;
