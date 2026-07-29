import { z } from "zod";

// Task schema for itinerary days
const itineraryTaskSchema = z.object({
  id: z.string().describe("ID of the task"),
  title: z
    .string()
    .min(1, "Task title is required")
    .max(300, "Task title must be under 300 characters")
    .describe("Title of the task"),
  time: z.string().optional().describe("Time of the task in HH:mm format"),
  completed: z
    .boolean()
    .default(false)
    .describe("Whether the task is completed"),
});

// Day schema within the itinerary
export const itineraryDaySchema = z.object({
  id: z.string().describe("ID of the day"),
  title: z
    .string()
    .min(1, "Day title is required")
    .max(200, "Day title must be under 200 characters")
    .describe("Title of the day. e.g., Arrival, Day 3, Beach day, etc."),
  budget: z.coerce.number().default(0).describe("Budget for the day"),
  tasks: z
    .array(itineraryTaskSchema)
    .max(50, "Maximum 50 tasks allowed per day")
    .default([])
    .describe("Tasks for the day"),
});

// Schema for creating a new itinerary
export const createItinerarySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  destination: z.string().optional().describe("Destination of the itinerary"),
  coverImage: z.string().optional().describe("Cover image URL for the itinerary"),
  startDate: z.string().describe("Start date of the itinerary"),
  endDate: z.string().describe("End date of the itinerary"),
  totalDays: z.coerce.number().min(1, "Total days must be at least 1").max(60, "Maximum 60 days allowed per itinerary").describe("Total number of days in the itinerary"),
  budget: z.coerce.number().default(0).describe("Budget for the itinerary"),
  actualCost: z.coerce.number().default(0).describe("Actual cost of the itinerary"),
  days: z
    .array(itineraryDaySchema)
    .max(60, "Maximum 60 days allowed per itinerary")
    .default([])
    .describe("Array of days of the itinerary"),
  notes: z.string().optional().describe("General notes, flight details, or travel tips for the itinerary"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Update schema for partial updates
export const updateItinerarySchema = createItinerarySchema.partial().extend({});

// Full itinerary schema (extends creation schema)
export const itinerarySchema = createItinerarySchema.extend({
  id: z.string().describe("ID of the itinerary"), // Firestore ID
});

// Type inference
export type ItineraryDayType = z.infer<typeof itineraryDaySchema>;
export type ItineraryDayUpdate = Partial<ItineraryDayType>;
export type ItineraryTask = z.infer<typeof itineraryTaskSchema>;
export type Itinerary = z.infer<typeof itinerarySchema>;
export type ItineraryCreate = z.infer<typeof createItinerarySchema>;
export type ItineraryUpdate = z.infer<typeof updateItinerarySchema>;
