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

export function useAiResponse() {
  return useMutation({
    mutationFn: async (userPrompt: string) => {
      const prompt = `The user said: "${userPrompt}". Follow the format above. Only respond with JSON.`;
      const res = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],

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
