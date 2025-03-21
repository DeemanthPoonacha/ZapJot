import { z } from "zod";

// Goal creation schema
export const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  progress: z.number().default(0),
  objective: z.number().default(100),
  unit: z.string().default("%"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Update schema (allows partial updates)
export const updateGoalSchema = createGoalSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Full goal schema (includes Firestore ID)
export const goalSchema = createGoalSchema.extend({
  id: z.string(),
});

// Type inference
export type Goal = z.infer<typeof goalSchema>;
export type GoalCreate = z.infer<typeof createGoalSchema>;
export type GoalUpdate = z.infer<typeof updateGoalSchema>;
