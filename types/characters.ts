import { string, z } from "zod";

// Reminder Schema
const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"), // e.g., Birthday, Anniversary
  date: z.string().min(1, "Date is required"), // Format: "DD-MM"
  time: z.string().optional(), // Format: "HH:MM" (optional)
  repeat: z
    .enum(["none", "daily", "weekly", "monthly", "yearly"])
    .default("none"),
});

// Character Schema
export const createCharacterSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(), // Relationship or nickname
  reminders: z.array(reminderSchema).default([]), // Special dates like birthdays
  notes: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateCharacterSchema = createCharacterSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const characterSchema = createCharacterSchema.extend({
  id: z.string(),
  reminders: z.array(string()).optional(),
});

// Type Inference
export type Reminder = z.infer<typeof reminderSchema>;
export type Character = z.infer<typeof characterSchema>;
export type CharacterCreate = z.infer<typeof createCharacterSchema>;
