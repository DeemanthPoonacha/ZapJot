import { AVAILABLE_MODELS } from "@/lib/services/firebase/ai";
import { z } from "zod";

export const deviceSchema = z.record(
  z.string(), // device_id
  z.object({
    token: z.string().describe("Token of the device"),
    enabled: z.boolean().describe("Enabled status of the device"),
    lastActive: z
      .string()
      .datetime()
      .describe("Last active time of the device"),
  }),
);

export const notificationsSchema = z.object({
  devices: deviceSchema.default({}).describe("Devices for notifications"),
  notifyMinsBefore: z
    .number()
    .default(10)
    .describe("Minutes before the event to notify"),
});

export const notificationsUpdateSchema = notificationsSchema.partial();

export const aiSchema = z.object({
  confirmAiActions: z
    .boolean()
    .default(true)
    .describe("Confirm AI actions before executing"),
  preferredModel: z
    .string()
    .default(AVAILABLE_MODELS[0])
    .describe("Preferred AI model for AI actions"),
});

export const aiUpdateSchema = aiSchema.partial();

export const settingsSchema = z.object({
  theme: z.string().default("light").describe("Theme of the application"),
  notifications: notificationsSchema,
  ai: aiSchema.default({}).describe("AI settings for the application"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateSettingsSchema = settingsSchema.partial().extend({
  notifications: notificationsUpdateSchema
    .optional()
    .describe("Notifications settings"),
  ai: aiUpdateSchema.optional().describe("AI settings"),
});

export type Settings = z.infer<typeof settingsSchema>;
export type SettingsUpdate = z.infer<typeof updateSettingsSchema>;
export type NotificationsSettings = z.infer<typeof notificationsSchema>;
export type NotificationsSettingsUpdate = z.infer<
  typeof notificationsUpdateSchema
>;
export type AiSettings = z.infer<typeof aiSchema>;
export type AiSettingsUpdate = z.infer<typeof aiUpdateSchema>;
