import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./base";
import { AI_SYSTEM_PROMPT } from "../../constants";
import { initAppCheck } from "./appCheck";

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
        description: "Create a new chapter for a journal or trip.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            subtitle: { type: "STRING" },
            description: { type: "STRING" },
            date: { type: "STRING", description: "ISO-8601 formatted date" },
            image: { type: "STRING", description: "URL or base64 of the cover image" },
          },
          required: ["title", "description"],
        },
      },
      {
        name: "create_journal",
        description: "Create a new journal entry.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            location: { type: "STRING" },
            date: { type: "STRING", description: "ISO-8601 formatted date" },
            content: { type: "STRING" },
            coverImage: { type: "STRING" },
            gallery: { 
              type: "ARRAY", 
              items: { type: "STRING" }, 
              description: "List of image URLs" 
            },
          },
          required: ["title", "content"],
        },
      },
      {
        name: "create_event",
        description: "Create a new event or reminder.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            time: { type: "STRING", description: "Time of day like 12:00" },
            date: { type: "STRING", description: "Date YYYY-MM-DD" },
            repeat: {
              type: "STRING",
              description: "One of: none, daily, weekly, monthly, yearly",
            },
            repeatDays: { type: "ARRAY", items: { type: "STRING" } },
            location: { type: "STRING" },
            notes: { type: "STRING" },
            participants: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  label: { type: "STRING" },
                  value: { type: "STRING", description: "Character ID" },
                },
              },
            },
          },
          required: ["title", "repeat"],
        },
      },
      {
        name: "create_task",
        description: "Create a to-do task.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            description: { type: "STRING" },
            status: {
              type: "STRING",
              description: "One of: pending, in-progress, completed",
            },
            highPriority: { type: "BOOLEAN" },
            dueDate: { type: "STRING", description: "YYYY-MM-DD" },
            subtasks: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  title: { type: "STRING" },
                  status: { type: "STRING" },
                },
              },
            },
          },
          required: ["title", "status"],
        },
      },
      {
        name: "create_goal",
        description: "Create a goal with an objective.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            description: { type: "STRING" },
            objective: { type: "INTEGER" },
            progress: { type: "INTEGER" },
            deadline: { type: "STRING", description: "YYYY-MM-DD" },
            unit: { type: "STRING" },
            priority: { 
              type: "STRING",
              description: "One of: low, medium, high"
            },
          },
          required: ["title", "objective", "deadline"],
        },
      },
      {
        name: "create_character",
        description: "Create a character or person profile.",
        parameters: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            title: { type: "STRING", description: "Relationship or role" },
            notes: { type: "STRING" },
            image: { type: "STRING" },
            reminders: { type: "ARRAY", items: { type: "STRING" } },
          },
          required: ["name"],
        },
      },
      {
        name: "create_itinerary",
        description: "Create a multi-day itinerary.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            destination: { type: "STRING" },
            startDate: { type: "STRING" },
            endDate: { type: "STRING" },
            budget: { type: "INTEGER" },
            totalDays: { type: "INTEGER" },
            days: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  title: { type: "STRING" },
                  budget: { type: "INTEGER" },
                  tasks: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        id: { type: "STRING" },
                        title: { type: "STRING" },
                        time: { type: "STRING" },
                        completed: { type: "BOOLEAN" },
                      }
                    }
                  }
                }
              }
            }
          },
          required: ["title"],
        },
      },
    ],
  },
] as any; // Typecast to ignore strict SchemaType enums

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
