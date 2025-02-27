import { z } from "zod";

export enum RepeatType {
  none = "none",
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}
const RepeatTypes = Object.values(RepeatType);

export const participants = z.object({
  label: z.string(),
  value: z.string(),
});

// Base schema for event creation
export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  date: z.string().optional(),
  time: z.string(),
  repeat: z.enum(RepeatTypes as any).default("none"),
  repeatDays: z.array(z.string()).default([]),
  location: z.string().optional(),
  participants: z.array(participants).optional(),
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

export interface EventsFilter {
  eventIds?: string[];
  participants?: string[];
}
