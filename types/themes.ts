import { z } from "zod";

// Theme Schema
export const createThemeSchema = z.object({
  name: z.string().min(1, "Theme name is required"),
  colors: z.object({
    background: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    foreground: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    primary: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    secondary: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    accent: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    muted: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    border: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  }),
  type: z.enum(["system", "light", "dark", "custom"]).default("custom"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type ThemeCreate = z.infer<typeof createThemeSchema>;

export const updateThemeSchema = createThemeSchema.extend({
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type ThemeUpdate = z.infer<typeof updateThemeSchema>;

export const themeSchema = createThemeSchema.extend({
  id: z.string(),
});

export type ThemeType = z.infer<typeof themeSchema>;

export interface Theme {
  id: string;
  name: string;
  type: "system" | "light" | "dark" | "custom";
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
  };
}
