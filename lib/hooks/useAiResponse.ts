import { useMutation } from "@tanstack/react-query";
import { model } from "@/lib/services/firebase";
// import { Schema } from "firebase/ai";

// export const createCommandSchema = Schema.object({
//   properties: {
//     action: Schema.string(),
//     // action: "create_event"
//     title: Schema.string(),
//     notes: Schema.string(),
//     date: Schema.string(),
//     time: Schema.string(),
//     repeat: Schema.enumString({
//       enum: ["none", "daily", "weekly", "monthly", "yearly"],
//     }),
//     repeatDays: Schema.array({ items: Schema.string() }),
//     location: Schema.string(),
//     participants: Schema.array({
//       items: Schema.object({
//         properties: {
//           label: Schema.string(),
//           value: Schema.string(),
//         },
//       }),
//     }),

//     // action: "create_task"
//     description: Schema.string(),
//     highPriority: Schema.boolean(),
//     status: Schema.enumString({
//       enum: ["pending", "in-progress", "completed"],
//     }),
//     subtasks: Schema.array({
//       items: Schema.object({
//         properties: {
//           id: Schema.string(),
//           title: Schema.string(),
//           status: Schema.enumString({
//             enum: ["pending", "in-progress", "completed"],
//           }),
//         },
//       }),
//     }),
//     dueDate: Schema.string(),

//     // action: "create_character"
//     name: Schema.string(),
//     // title: Schema.string(),
//     // notes: Schema.string(),

//     message: Schema.string(),
//   },
//   description: "Create an event",
//   example: {
//     title: "Anniversary",
//     notes: "Pick up flowers",
//     time: "09:00:00Z",
//     repeat: "yearly",
//     repeatDays: ["9-7"], // 7th of September
//     location: "JJ club",
//     participants: [
//       {
//         label: "Jane",
//         value: "WOJhyjnCX6GTs1SN3Rim", // character id from firebase
//       },
//     ],
//     message: "Anniversary reminder",
//   },
//   optionalProperties: ["notes", "date", "location", "participants"],
// });

const SYSTEM_PROMPT = `
You are a helpful assistant for the ZapJot app. The user can ask you to create journals, chapers for journals, events/reminders, tasks, goals, itineraries or characters.  
Always respond with a single JSON object describing the action to take.  

Only return raw JSON. Example formats:

Create chapter:
    {
      action: "create_chapter",
      title: "Tokyo Adventure",
      subtitle: "Neon Dreams and Sacred Spaces",
      description:
        "A week-long exploration of Japan's captivating capital, from the towering skyscrapers of Shinjuku to the serene shores of Lake Kawaguchiko. This journey weaves through bustling markets, peaceful shrines, and the perfect symmetry of Mount Fuji, capturing the beautiful contradictions that make Tokyo a city like no other.",
      date: "2025-03-08T18:30:00.000Z",
    }

Create journal:
    {
      action: "create_journal",
      title: "Arrival in Tokyo",
      location: "Shinjuku, Tokyo, Japan",
      date: "2025-03-08T18:30:00.000Z",
      content: "Touching down in Tokyo felt surreal — neon signs, quiet efficiency, and the low hum of the city’s rhythm all wrapped into one. Shinjuku welcomed us with its chaotic charm: towering skyscrapers, endless eateries, and streets pulsing with life. After checking into our tiny but cozy hotel, we wandered through Omoide Yokocho, sampling yakitori under glowing lanterns. The jet lag couldn’t compete with our excitement — Tokyo was already casting its spell.",
    }

    
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


Create Goal:
    {
      action: "create_goal",
      objective: 3000,
      title: "Save for Paris trip",
      progress: 0,
      deadline: "2026-04-01",
      unit: "$",
      description: "Spring vacation to Paris",
      priority: "medium",
    }

Create Itinerary:
    {
      action: "create_itinerary",
      title: "Tokyo 2025",
      days: [
        {
          id: "day-1",
          title: "Arrival in Shinjuku",
          tasks: [
            {
              id: "task-1-1",
              title: "Check-in at Shinjuku Hotel",
              completed: true,
              time: "15:00",
            },
            {
              time: "19:00",
              id: "task-1-2",
              completed: true,
              title: "Explore Golden Gai",
            },
            {
              time: "20:30",
              title: "Dinner at Local Izakaya",
              id: "task-1-3",
              completed: true,
            },
          ],
          budget: 300,
        },
        {
          tasks: [
            {
              id: "task-2-1",
              title: "Visit Meiji Shrine Early Morning",
              completed: true,
              time: "08:00",
            },
            {
              title: "Explore Harajuku Street Fashion",
              id: "task-2-2",
              time: "11:00",
              completed: true,
            },
            {
              completed: true,
              title: "Lunch in Harajuku",
              time: "13:00",
              id: "task-2-3",
            },
          ],
          budget: 400,
          id: "day-2",
          title: "Meiji Shrine & Harajuku",
        },
        {
          title: "Shibuya Adventure",
          id: "day-3",
          budget: 350,
          tasks: [
            {
              title: "Shibuya Crossing Observation",
              completed: true,
              id: "task-3-1",
              time: "11:00",
            },
            {
              time: "12:30",
              title: "Ramen Lunch at Local Shop",
              id: "task-3-2",
              completed: true,
            },
            {
              time: "14:00",
              title: "Explore Shibuya District",
              id: "task-3-3",
              completed: true,
            },
          ],
        },
        {
          id: "day-4",
          tasks: [
            {
              completed: true,
              title: "Visit Tokyo National Museum",
              time: "10:00",
              id: "task-4-1",
            },
            {
              completed: true,
              time: "14:00",
              id: "task-4-2",
              title: "Explore Akihabara Electronics District",
            },
            {
              completed: true,
              time: "19:00",
              title: "Evening in Roppongi",
              id: "task-4-3",
            },
          ],
          budget: 300,
          title: "Tokyo City Exploration",
        },
        {
          tasks: [
            {
              id: "task-5-1",
              time: "07:00",
              title: "Early Bus to Kawaguchiko",
              completed: true,
            },
            {
              completed: true,
              id: "task-5-2",
              title: "Kachi Kachi Ropeway",
              time: "11:00",
            },
            {
              title: "Washi Paper Workshop",
              time: "14:00",
              completed: true,
              id: "task-5-3",
            },
            {
              completed: true,
              title: "Return to Tokyo",
              id: "task-5-4",
              time: "18:00",
            },
          ],
          title: "Mount Fuji Day Trip",
          budget: 500,
          id: "day-5",
        },
        {
          id: "day-6",
          title: "Traditional Tokyo",
          tasks: [
            {
              title: "Tea Ceremony Experience",
              id: "task-6-1",
              time: "10:00",
              completed: true,
            },
            {
              title: "Visit Senso-ji Temple",
              time: "13:00",
              id: "task-6-2",
              completed: true,
            },
            {
              id: "task-6-3",
              title: "Traditional Dinner in Asakusa",
              completed: true,
              time: "19:00",
            },
          ],
          budget: 350,
        },
        {
          budget: 600,
          tasks: [
            {
              title: "Arrive at DisneySea",
              id: "task-7-1",
              time: "09:00",
              completed: true,
            },
            {
              completed: true,
              id: "task-7-2",
              time: "11:00",
              title: "Journey to the Center of the Earth Ride",
            },
            {
              id: "task-7-3",
              time: "14:00",
              title: "Explore Mediterranean Harbor",
              completed: true,
            },
            {
              title: "Evening Park Exploration",
              time: "18:00",
              id: "task-7-4",
              completed: true,
            },
          ],
          title: "Tokyo DisneySea",
          id: "day-7",
        },
      ],
      updatedAt: "2025-03-25T05:37:15.867Z",
      budget: 5000,
      destination: "Tokyo, Japan",
      actualCost: 4750,
      endDate: "2025-03-21",
      createdAt: "2025-03-25T05:37:15.867Z",
      startDate: "2025-03-15",
      totalDays: 7,
    }

Create Character:
    {
      action: "create_character",
      name: "John Doe",
      title: "Best Friend",
      notes: "A close friend who loves hiking and photography.",
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
          // responseSchema: createCommandSchema,
        },
      });
      console.log("🚀 ~ mutationFn: ~ res:", res.response);

      const raw =
        res.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      return raw;
    },
  });
}
