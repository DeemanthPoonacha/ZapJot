import { useMutation } from "@tanstack/react-query";
import { model } from "@/lib/services/firebase";
import { Schema } from "firebase/ai";

export const createCommandSchema = Schema.object({
  properties: {
    action: Schema.string(),
    // action: "create_event"
    title: Schema.string(),
    notes: Schema.string(),
    date: Schema.string(),
    time: Schema.string(),
    repeat: Schema.enumString({
      enum: ["none", "daily", "weekly", "monthly", "yearly"],
    }),
    repeatDays: Schema.array({ items: Schema.string() }),
    location: Schema.string(),
    participants: Schema.array({
      items: Schema.object({
        properties: {
          label: Schema.string(),
          value: Schema.string(),
        },
      }),
    }),

    // action: "create_task"
    description: Schema.string(),
    highPriority: Schema.boolean(),
    status: Schema.enumString({
      enum: ["pending", "in-progress", "completed"],
    }),
    subtasks: Schema.array({
      items: Schema.object({
        properties: {
          id: Schema.string(),
          title: Schema.string(),
          status: Schema.enumString({
            enum: ["pending", "in-progress", "completed"],
          }),
        },
      }),
    }),
    dueDate: Schema.string(),

    message: Schema.string(),
  },
  description: "Create an event",
  example: {
    title: "Anniversary",
    notes: "Pick up flowers",
    time: "09:00:00Z",
    repeat: "yearly",
    repeatDays: ["9-7"], // 7th of September
    location: "JJ club",
    participants: [
      {
        label: "Jane",
        value: "WOJhyjnCX6GTs1SN3Rim", // character id from firebase
      },
    ],
    message: "Anniversary reminder",
  },
  optionalProperties: ["notes", "date", "location", "participants"],
});

const SYSTEM_PROMPT = `
You are a helpful assistant for the ZapJot app. The user can ask you to create journals, chapers for journals, events/reminders, tasks, goals, itineraries or characters.  
Always respond with a single JSON object describing the action to take.  

Only return raw JSON. Example formats:

Create Reminder/events:
daily:
    {
      "action": "create_event",
      "repeat": "daily",
      "repeatDays": [],
      "time": "12:00",
      "title": "Go for a walk",
      location: "",
      participants: [],
    }
weekly:
    {
      action: "create_event",
      title: "Standup Call",
      notes: "",
      time: "11:00",
      repeat: "weekly",
      repeatDays: ["1", "2", "3", "4"], // Monday, Tuesday, Wednesday, Thursday
      location: "MS Teams",
      participants: [
        {
          label: "Jack",
          value: "WOJhyjnCX6GTs1SN3Rim", // character id from firebase
        },
      ],
    }
monthly:
    {
      "action": "create_event",
      "repeat": "monthly",
      "repeatDays": [
          "25"
      ],
      "time": "12:00",
      "title": "sip",
      location: "",
      participants: [],
    }
yearly:
    {
      action: "create_event",
      title: "Anniversary",
      notes: "",
      time: "09:00:00Z",
      repeat: "yearly",
      repeatDays: ["9-7"], // 7th of September
      location: "",
      participants: [],
    }
Does not repeat:
    {
      action: "create_event",
      title: "Meeting with Bob",
      notes: "",
      date: "2024-09-07",
      time: "17:45",
      repeat: "none",
      repeatDays: [],
      location: "",
      participants: [],
    }


Create Task:
    {
      action: "create_task",
      title: "Buy groceries",
      description: "Don't forget the milk",
      highPriority: false,
      status: "pending",
    }
Crate Tasks with subtasks:
    {
      action: "create_task",
      dueDate: "2025-09-03",
      updatedAt: "2025-05-12T05:25:03.850Z",
      status: "pending",
      title: "Research anniversary gift ideas for John",
      subtasks: [
        { title: "Check watches", id: "1742540989249", status: "pending" },
        { title: "Check perfumes", id: "1742540996169", status: "completed" },
        { title: "Check Wallets", id: "1742541018617", status: "completed" },
      ],
      description: "",
      highPriority: true,
      createdAt: "2025-05-12T05:25:03.850Z",
      priority: "medium",
    }

If a request is out of scope, respond with:
{ action: "none", message: "<some relevant polite and friendly message, also prompt the user to ask something related to ZapJot>" }
`;
export function useAiResponse() {
  return useMutation({
    mutationFn: async (userPrompt: string) => {
      const prompt = `The user said: "${userPrompt}". Follow the format above. Only respond with JSON.`;
      const res = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "user", parts: [{ text: prompt }] },
        ],

        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: createCommandSchema,
        },
      });
      console.log("🚀 ~ mutationFn: ~ res:", res.response);

      const raw =
        res.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      return raw;
    },
  });
}
