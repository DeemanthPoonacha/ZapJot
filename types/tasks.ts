import { z } from "zod";

export const subTasks = z.object({
  id: z.string().describe("ID of the subtask"),
  title: z.string().describe("Title of the subtask"),
  status: z
    .enum(["pending", "in-progress", "completed"])
    .default("pending")
    .describe("Status of the subtask"),
});

// Task creation schema
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").describe("Title of the task"),
  description: z.string().optional().describe("Description of the task"),
  dueDate: z
    .string()
    .optional()
    .describe("Due date of the task in YYYY-MM-DD format"), // ISO date format
  highPriority: z
    .boolean()
    .default(false)
    .describe("High priority of the task"),
  status: z
    .enum(["pending", "in-progress", "completed"])
    .default("pending")
    .describe("Status of the task"),
  subtasks: z.array(subTasks).default([]).describe("Subtasks of the task"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Task update schema
export const updateTaskSchema = createTaskSchema.partial().extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Full task schema
export const taskSchema = createTaskSchema.extend({
  id: z.string().describe("ID of the task"), // Firestore ID
});

// Type inference
export type Task = z.infer<typeof taskSchema>;
export type TaskCreate = z.infer<typeof createTaskSchema>;

export interface TaskFilter {
  highPriority?: boolean;
  status?: "pending" | "in-progress" | "completed";
  limit?: number;
}
