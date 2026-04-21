import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./base";
import { AI_SYSTEM_PROMPT } from "../../constants";
import { initAppCheck } from "./appCheck";
import { zodToGeminiSchema } from "./schema-utils";

// Schema Imports
import { createChapterSchema } from "../../../types/chapters";
import { createJournalSchema } from "../../../types/journals";
import { createEventSchema } from "../../../types/events";
import { createTaskSchema } from "../../../types/tasks";
import { createGoalSchema } from "../../../types/goals";
import { createCharacterSchema } from "../../../types/characters";
import { createItinerarySchema } from "../../../types/itineraries";

initAppCheck();

const ai = getAI(app, { backend: new GoogleAIBackend() });

const tools = [
  {
    functionDeclarations: [
      {
        name: "get_current_time",
        description:
          "Get the current time and date in the user's local timezone.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "get_user_info",
        description: "Get information about the currently logged in user.",
        parameters: { type: "object", properties: {} },
      },
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
    ],
  },
] as any;

export const AVAILABLE_MODELS = [
  "gemini-3.1-pro-preview", // Cutting edge default
  "gemini-3.1-flash-lite-preview", // Stable, fast fallback
  "gemini-2.5-pro", // High intelligence fallback
  "gemini-2.5-flash", // Reliable pro fallback
  "gemini-2.5-flash-lite", // Very fast, light
];

export const getModel = (modelName: string = AVAILABLE_MODELS[0]) => {
  return getGenerativeModel(ai, {
    model: modelName,
    systemInstruction: AI_SYSTEM_PROMPT,
    tools: tools,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  });
};

// For backward compatibility while migrating
export const model = getModel(AVAILABLE_MODELS[0]);
