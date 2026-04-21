import { z } from "zod";
import { zodToGeminiSchema } from "./schema-utils";

// Schema Imports for tool parameters
import {
  createChapterSchema,
  updateChapterSchema,
} from "../../../types/chapters";
import {
  createJournalSchema,
  updateJournalSchema,
} from "../../../types/journals";
import { createEventSchema, updateEventSchema } from "../../../types/events";
import { createTaskSchema, updateTaskSchema } from "../../../types/tasks";
import { createGoalSchema, updateGoalSchema } from "../../../types/goals";
import {
  createCharacterSchema,
  updateCharacterSchema,
} from "../../../types/characters";
import {
  createItinerarySchema,
  updateItinerarySchema,
} from "../../../types/itineraries";
import { brainDumpSchema } from "../../../types/brain-dump";

export const toolDeclarations = [
  // --- UTILITY TOOLS ---
  {
    name: "get_current_time",
    description: "Get the current time and date in the user's local timezone.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "get_user_info",
    description: "Get information about the currently logged in user.",
    parameters: { type: "object", properties: {} },
  },

  // --- DATA FETCHING TOOLS (ALL) ---
  {
    name: "get_chapters",
    description: "Fetch all chapters (organisational categories for journals).",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "get_characters",
    description: "Fetch all characters or person profiles.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "get_events",
    description: "Fetch events/reminders with optional filters.",
    parameters: zodToGeminiSchema(
      z.object({
        filter: z
          .object({
            onlyUpcoming: z.boolean().optional(),
            participants: z.array(z.string()).optional(),
            limit: z.number().optional(),
          })
          .optional(),
      }),
    ),
  },
  {
    name: "get_goals",
    description: "Fetch all user goals.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "get_itineraries",
    description: "Fetch all multi-day itineraries.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "get_tasks",
    description: "Fetch to-do tasks with optional filters.",
    parameters: zodToGeminiSchema(
      z.object({
        filter: z
          .object({
            status: z.enum(["pending", "in-progress", "completed"]).optional(),
            limit: z.number().optional(),
          })
          .optional(),
      }),
    ),
  },

  // --- DATA FETCHING TOOLS (BY ID) ---
  {
    name: "get_chapter_by_id",
    description: "Fetch a specific chapter by its ID.",
    parameters: zodToGeminiSchema(z.object({ chapterId: z.string() })),
  },
  {
    name: "get_character_by_id",
    description: "Fetch a specific character profile by its ID.",
    parameters: zodToGeminiSchema(z.object({ characterId: z.string() })),
  },
  {
    name: "get_event_by_id",
    description: "Fetch a specific event by its ID.",
    parameters: zodToGeminiSchema(z.object({ eventId: z.string() })),
  },
  {
    name: "get_goal_by_id",
    description: "Fetch a specific goal by its ID.",
    parameters: zodToGeminiSchema(z.object({ goalId: z.string() })),
  },
  {
    name: "get_itinerary_by_id",
    description: "Fetch a specific itinerary by its ID.",
    parameters: zodToGeminiSchema(z.object({ itineraryId: z.string() })),
  },
  {
    name: "get_task_by_id",
    description: "Fetch a specific task by its ID.",
    parameters: zodToGeminiSchema(z.object({ taskId: z.string() })),
  },
  {
    name: "get_journals",
    description: "Fetch all journals within a specific chapter.",
    parameters: zodToGeminiSchema(z.object({ chapterId: z.string() })),
  },
  {
    name: "get_journal_by_id",
    description:
      "Fetch a specific journal entry by its ID. Requires both chapterId and journalId.",
    parameters: zodToGeminiSchema(
      z.object({ chapterId: z.string(), journalId: z.string() }),
    ),
  },
  {
    name: "search_characters",
    description: "Search for characters by name.",
    parameters: zodToGeminiSchema(z.object({ searchString: z.string() })),
  },

  // --- UPDATE TOOLS ---
  {
    name: "update_chapter",
    description: "Update an existing chapter.",
    parameters: zodToGeminiSchema(
      z.object({
        chapterId: z.string(),
        data: updateChapterSchema.omit({
          userId: true,
          createdAt: true,
          updatedAt: true,
        }),
      }),
    ),
  },
  {
    name: "update_journal",
    description: "Update an existing journal entry.",
    parameters: zodToGeminiSchema(
      z.object({
        chapterId: z.string(),
        journalId: z.string(),
        data: updateJournalSchema.omit({
          iv: true,
          chapterId: true,
          createdAt: true,
          updatedAt: true,
        }),
      }),
    ),
  },
  {
    name: "update_event",
    description: "Update an existing event or reminder.",
    parameters: zodToGeminiSchema(
      z.object({
        eventId: z.string(),
        data: updateEventSchema.omit({
          nextOccurrence: true,
          nextNotificationAt: true,
          createdAt: true,
          updatedAt: true,
        }),
      }),
    ),
  },
  {
    name: "update_task",
    description: "Update an existing to-do task.",
    parameters: zodToGeminiSchema(
      z.object({
        taskId: z.string(),
        data: updateTaskSchema.omit({ createdAt: true, updatedAt: true }),
      }),
    ),
  },
  {
    name: "update_goal",
    description: "Update an existing goal.",
    parameters: zodToGeminiSchema(
      z.object({
        goalId: z.string(),
        data: updateGoalSchema.omit({ createdAt: true, updatedAt: true }),
      }),
    ),
  },
  {
    name: "update_character",
    description: "Update an existing character or person profile.",
    parameters: zodToGeminiSchema(
      z.object({
        characterId: z.string(),
        data: updateCharacterSchema.omit({
          userId: true,
          lowercaseName: true,
          createdAt: true,
          updatedAt: true,
        }),
      }),
    ),
  },
  {
    name: "update_itinerary",
    description: "Update an existing multi-day itinerary.",
    parameters: zodToGeminiSchema(
      z.object({
        itineraryId: z.string(),
        data: updateItinerarySchema.omit({
          actualCost: true,
          createdAt: true,
          updatedAt: true,
        }),
      }),
    ),
  },

  // --- CREATION TOOLS ---
  {
    name: "create_chapter",
    description: "Create a new chapter for organising journals.",
    parameters: zodToGeminiSchema(
      createChapterSchema.omit({
        userId: true,
        createdAt: true,
        updatedAt: true,
      }),
    ),
  },
  {
    name: "create_journal",
    description: "Create a new journal entry.",
    parameters: zodToGeminiSchema(
      createJournalSchema.omit({
        iv: true,
        chapterId: true,
        createdAt: true,
        updatedAt: true,
      }),
    ),
  },
  {
    name: "create_event",
    description: "Create a new event or reminder.",
    parameters: zodToGeminiSchema(
      createEventSchema.omit({
        nextOccurrence: true,
        nextNotificationAt: true,
        createdAt: true,
        updatedAt: true,
      }),
    ),
  },
  {
    name: "create_task",
    description: "Create a to-do task.",
    parameters: zodToGeminiSchema(
      createTaskSchema.omit({
        createdAt: true,
        updatedAt: true,
      }),
    ),
  },
  {
    name: "create_goal",
    description: "Create a goal with an objective.",
    parameters: zodToGeminiSchema(
      createGoalSchema.omit({
        createdAt: true,
        updatedAt: true,
      }),
    ),
  },
  {
    name: "create_character",
    description: "Create a character or person profile.",
    parameters: zodToGeminiSchema(
      createCharacterSchema.omit({
        userId: true,
        lowercaseName: true,
        createdAt: true,
        updatedAt: true,
      }),
    ),
  },
  {
    name: "create_itinerary",
    description: "Create a multi-day itinerary.",
    parameters: zodToGeminiSchema(
      createItinerarySchema.omit({
        actualCost: true,
        createdAt: true,
        updatedAt: true,
      }),
    ),
  },
  {
    name: "brain_dump",
    description:
      "Extract multiple items (tasks, goals, itineraries, characters, journals, chapters) from a bulk of unstructured text.",
    parameters: zodToGeminiSchema(brainDumpSchema),
  },
];
