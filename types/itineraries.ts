import { z } from "zod";

// Task schema for itinerary days
const itineraryTaskSchema = z.object({
  id: z.string(), // Unique task ID
  title: z.string().min(1, "Task title is required"),
  time: z.string().optional(), // "10:00 PM", "3:00 PM", etc.
  completed: z.boolean().default(false),
});

// Day schema within the itinerary
const itineraryDaySchema = z.object({
  id: z.string(), // Unique day ID
  title: z.string().min(1, "Day title is required"), // Example: "Day 1"
  budget: z.number().default(0), // Example: 12,000
  tasks: z.array(itineraryTaskSchema).default([]), // List of activities/tasks
});

// Schema for creating a new itinerary
export const createItinerarySchema = z.object({
  userId: z.string(),
  title: z.string().min(1, "Title is required"), // Example: "Manali 2025"
  destination: z.string().optional(),
  startDate: z.string(), // Example: "2025-12-02"
  endDate: z.string(), // Example: "2025-12-07"
  totalDays: z.number(), // Example: 6
  budget: z.number().default(0), // Example: 68,000
  actualCost: z.number().default(0), // Example: 0 initially
  days: z.array(itineraryDaySchema).default([]), // List of days with activities
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Update schema for partial updates
export const updateItinerarySchema = createItinerarySchema.partial().extend({});

// Full itinerary schema (extends creation schema)
export const itinerarySchema = createItinerarySchema.extend({
  id: z.string(), // Firestore ID
});

// Type inference
export type Itinerary = z.infer<typeof itinerarySchema>;
export type ItineraryCreate = z.infer<typeof createItinerarySchema>;
export type ItineraryUpdate = z.infer<typeof updateItinerarySchema>;
export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type ItineraryTask = z.infer<typeof itineraryTaskSchema>;
