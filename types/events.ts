import { z } from "zod";

export enum RepeatType {
  none = "none",
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}
const RepeatTypes = Object.values(RepeatType);

// Base schema for event creation
export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  date: z.string().optional(),
  time: z.string(),
  repeat: z.enum(RepeatTypes as any).default("none"),
  repeatDays: z.array(z.string()).optional(),
  location: z.string().optional(),
  participants: z.string().optional(),
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
