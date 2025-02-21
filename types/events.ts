import { z } from "zod";

// Base schema for event creation
export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string(),
  location: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateEventSchema = createEventSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Full event schema
export const eventSchema = createEventSchema.extend({
  id: z.string(),
});

// Type inference
export type Event = z.infer<typeof eventSchema>;
export type EventCreate = z.infer<typeof createEventSchema>;
