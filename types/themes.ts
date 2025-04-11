import { z } from "zod";

export const ThemeformSchema = z.object({
  id: z.string().default(new Date().toISOString()),
  name: z.string().min(2, { message: "Label must be at least 2 characters" }),
  colors: z.object({
    background: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    foreground: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    muted: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    border: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
  }),
});

export type ThemeFormType = z.infer<typeof ThemeformSchema>;

// Define the theme color properties
export type ThemeColor = {
  id: string;
  name: string;
  defaultLight: string;
};

// Define the theme interface
export type Theme = {
  id: string;
  name: string;
  colors: Record<string, string>;
  isCustom?: boolean;
};
