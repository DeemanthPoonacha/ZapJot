import { z } from "zod";

// Task schema for itinerary days
const itineraryTaskSchema = z.object({
  id: z.string(), // Unique task ID
  title: z.string().min(1, "Task title is required"),
  time: z.string().optional(), // "10:00 PM", "3:00 PM", etc.
  completed: z.boolean().default(false),
});

// Day schema within the itinerary
export const itineraryDaySchema = z.object({
  id: z.string(), // Unique day ID
  title: z.string().min(1, "Day title is required"),
  budget: z.number().default(0),
  tasks: z.array(itineraryTaskSchema).default([]),
});

// Schema for creating a new itinerary
export const createItinerarySchema = z.object({
  title: z.string().min(1, "Title is required"),
  destination: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  totalDays: z.number(),
  budget: z.number().default(0),
  actualCost: z.number().default(0),
  days: z.array(itineraryDaySchema).default([]),
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
export type ItineraryDayType = z.infer<typeof itineraryDaySchema>;
export type ItineraryDayUpdate = Partial<ItineraryDayType>;
export type ItineraryTask = z.infer<typeof itineraryTaskSchema>;
