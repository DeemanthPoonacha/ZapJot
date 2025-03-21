import { z } from "zod";

export const subTasks = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
});

// Task creation schema
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(), // ISO date format
  highPriority: z.boolean().default(false),
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  subtasks: z.array(subTasks).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Task update schema
export const updateTaskSchema = createTaskSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Full task schema
export const taskSchema = createTaskSchema.extend({
  id: z.string(), // Firestore ID
});

// Type inference
export type Task = z.infer<typeof taskSchema>;
export type TaskCreate = z.infer<typeof createTaskSchema>;
