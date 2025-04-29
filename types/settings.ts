import { z } from "zod";

export const deviceSchema = z.record(
  z.string(), // device_id
  z.object({
    token: z.string(),
    enabled: z.boolean(),
    lastActive: z.string().datetime(),
  })
);

export const notificationsSchema = z.object({
  devices: deviceSchema.default({}),
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
