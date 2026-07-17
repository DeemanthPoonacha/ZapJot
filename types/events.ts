import { Timestamp } from "firebase/firestore";
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
  label: z.string().describe("Name of the participant"),
  value: z.string().describe("ID of the participant"),
});

export const TimestampType = z.custom<Timestamp>(
  (value) => value instanceof Timestamp,
);

// Base schema for event creation
export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").describe("Title of the event"),
  notes: z.string().optional().describe("Notes for the event"),
  date: z
    .string()
    .optional()
    .describe(
      "Daate of the event in YYYY-MM-DD format, Only for non-repeating events",
    ),
  nextOccurrence: TimestampType.or(z.date()).describe(
    "Next occurrence of the event",
  ),
  time: z.string().describe("Time of the event in HH:mm format"),
  repeat: z
    .enum(RepeatTypes as any)
    .default("none")
    .describe("Repeat type of the event"),
  repeatDays: z
    .array(z.string())
    .default([])
    .describe(
      "Repeat days of the event in 0-6 format for weekly events, 1-31 for monthly events, MM-DD format for yearly events",
    ),
  location: z.string().optional().describe("Location of the event"),
  nextNotificationAt: TimestampType.or(z.date())
    .nullable()
    .default(null)
    .describe("Next notification time of the event"),
  participants: z
    .array(participants)
    .optional()
    .describe("Participants of the event"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateEventSchema = createEventSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Full event schema
export const eventSchema = createEventSchema.extend({
  id: z.string().describe("ID of the event"),
});

// Type inference
export type Event = z.infer<typeof eventSchema>;
export type EventCreate = z.infer<typeof createEventSchema>;
export type EventUpdate = z.infer<typeof updateEventSchema>;

export type EventParticipant = z.infer<typeof participants>;

export interface EventsFilter {
  eventIds?: string[];
  participants?: string[];
  dateRange?: { start?: Date; end?: Date };
  limit?: number;
  onlyUpcoming?: boolean;
}
