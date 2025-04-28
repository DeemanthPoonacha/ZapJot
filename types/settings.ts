import { z } from "zod";

export const notificationsSchema = z.object({
  enable_notifications: z.boolean().default(false),
  fcmToken: z.string().or(z.null()).default(null),
});

export const settingsSchema = z.object({
  theme: z.string().default("light"),
  notifications: notificationsSchema,
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const updateSettingsSchema = settingsSchema.partial();

export type Settings = z.infer<typeof settingsSchema>;
export type SettingsUpdate = z.infer<typeof updateSettingsSchema>;
export type NotificationsSettings = z.infer<typeof notificationsSchema>;

export type UserSettings = {
  settings: Settings;
};
