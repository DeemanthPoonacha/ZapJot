import { z } from "zod";
import { createTaskSchema } from "./tasks";
import { createGoalSchema } from "./goals";
import { createItinerarySchema } from "./itineraries";
import { createCharacterSchema } from "./characters";
import { createJournalSchema } from "./journals";
import { createEventSchema } from "./events";

export const brainDumpSchema = z.object({
  tasks: z.array(createTaskSchema.omit({ createdAt: true, updatedAt: true })).optional(),
  goals: z.array(createGoalSchema.omit({ createdAt: true, updatedAt: true })).optional(),
  itineraries: z.array(createItinerarySchema.omit({ createdAt: true, updatedAt: true, actualCost: true })).optional(),
  characters: z.array(createCharacterSchema.omit({ userId: true, createdAt: true, updatedAt: true, lowercaseName: true })).optional(),
  journals: z.array(createJournalSchema.omit({ iv: true, chapterId: true, createdAt: true, updatedAt: true })).optional(),
  events: z.array(createEventSchema.omit({ nextOccurrence: true, nextNotificationAt: true, createdAt: true, updatedAt: true })).optional(),
});

export type BrainDump = z.infer<typeof brainDumpSchema>;
