import { z } from "zod";

// Goal creation schema
export const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required").describe("Title of the goal"),
  description: z.string().optional().describe("Description of the goal"),
  deadline: z
    .string()
    .optional()
    .describe("Deadline of the goal in YYYY-MM-DD format"),
  priority: z
    .enum(["low", "medium", "high"])
    .default("medium")
    .describe("Priority of the goal"),
  progress: z.number().default(0).describe("Progress of the goal"),
  objective: z.number().default(100).describe("Objective of the goal"),
  unit: z
    .string()
    .default("%")
    .describe("Unit of the goal, e.g., %, $, kg, lbs, km etc."),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Update schema (allows partial updates)
export const updateGoalSchema = createGoalSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Full goal schema (includes Firestore ID)
export const goalSchema = createGoalSchema.extend({
  id: z.string().describe("ID of the goal"),
});

// Type inference
export type Goal = z.infer<typeof goalSchema>;
export type GoalCreate = z.infer<typeof createGoalSchema>;
export type GoalUpdate = z.infer<typeof updateGoalSchema>;
