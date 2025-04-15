import { getDates } from "@/lib/utils";
import { Theme } from "@/types/themes";

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_DAYS = getDates();
export const ALL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DEFAULT_CHAPTER_ID = "others";

export const colorProperties = [
  { id: "background", name: "Background", defaultLight: "#FFFFFF" },
  { id: "foreground", name: "Foreground", defaultLight: "#0F1729" },
  { id: "primary", name: "Primary", defaultLight: "#1E293B" },
  { id: "secondary", name: "Secondary", defaultLight: "#F1F5F9" },
  { id: "accent", name: "Accent", defaultLight: "#F1F5F9" },
  { id: "muted", name: "Muted", defaultLight: "#F1F5F9" },
  { id: "border", name: "Border", defaultLight: "#E2E8F0" },
];

// Default themes
export const defaultThemes: Theme[] = [
  {
    id: "light",
    name: "Light",
    type: "basic",
    colors: {
      background: "#FFFFFF",
      foreground: "#0F1729",
      primary: "#1E293B",
      secondary: "#F1F5F9",
      accent: "#F1F5F9",
      muted: "#F1F5F9",
      border: "#E2E8F0",
    },
  },
  {
    id: "dark",
    name: "Dark",
    type: "basic",
    colors: {
      background: "#09090B", // hsl(240 10% 3.9%)
      foreground: "#FAFAFA", // hsl(0 0% 98%)
      primary: "#FAFAFA", // hsl(0 0% 98%)
      secondary: "#1E1E2A", // hsl(240 3.7% 15.9%)
      accent: "#1E1E2A", // hsl(240 3.7% 15.9%)
      muted: "#1E1E2A", // hsl(240 3.7% 15.9%)
      border: "#1E1E2A", // hsl(240 3.7% 15.9%)
    },
  },
  {
    id: "system",
    name: "System",
    type: "basic",
    colors: {
      background: "#09090B", // hsl(240 10% 3.9%)
      foreground: "#FAFAFA", // hsl(0 0% 98%)
      primary: "#FAFAFA", // hsl(0 0% 98%)
      secondary: "#1E1E2A", // hsl(240 3.7% 15.9%)
      accent: "#1E1E2A", // hsl(240 3.7% 15.9%)
      muted: "#1E1E2A", // hsl(240 3.7% 15.9%)
      border: "#1E1E2A", // hsl(240 3.7% 15.9%)
    },
  },
  {
    id: "purple",
    name: "Purple",
    type: "light",
    colors: {
      background: "#FAF5FF",
      foreground: "#2D1B4F",
      primary: "#7E22CE",
      secondary: "#F3E8FF",
      accent: "#F3E8FF",
      muted: "#F3E8FF",
      border: "#DDD6FE",
    },
  },
  {
    id: "green",
    name: "Green",
    type: "light",
    colors: {
      background: "#F0FFF4",
      foreground: "#1C4532",
      primary: "#2F855A",
      secondary: "#DCFCE7",
      accent: "#DCFCE7",
      muted: "#DCFCE7",
      border: "#BBEFC2",
    },
  },
  {
    id: "rose",
    name: "Rose",
    type: "light",
    colors: {
      background: "#FFF1F2",
      foreground: "#4C1D1D",
      primary: "#E11D48",
      secondary: "#FFE4E6",
      accent: "#FFE4E6",
      muted: "#FFE4E6",
      border: "#FECDD3",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    type: "light",
    colors: {
      background: "#F0F9FF",
      foreground: "#082F49",
      primary: "#0EA5E9",
      secondary: "#E0F2FE",
      accent: "#E0F2FE",
      muted: "#E0F2FE",
      border: "#BAE6FD",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    type: "light",
    colors: {
      background: "#FFF7ED",
      foreground: "#431407",
      primary: "#EA580C",
      secondary: "#FFEDD5",
      accent: "#FFEDD5",
      muted: "#FFEDD5",
      border: "#FED7AA",
    },
  },
  {
    id: "abyss",
    name: "Abyss",
    type: "dark",
    colors: {
      background: "#0F1729",
      foreground: "#F8FAFC",
      primary: "#F8FAFC",
      secondary: "#1E293B",
      accent: "#1E293B",
      muted: "#1E293B",
      border: "#334155",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    type: "dark",
    colors: {
      background: "#0D1117",
      foreground: "#E6EDF3",
      primary: "#3B82F6",
      secondary: "#161B22",
      accent: "#1F2937",
      muted: "#1F2937",
      border: "#334155",
    },
  },
  {
    id: "crimson",
    name: "Crimson",
    type: "dark",
    colors: {
      background: "#1A0C0C",
      foreground: "#F5EAEA",
      primary: "#DC2626",
      secondary: "#2B1212",
      accent: "#3F1B1B",
      muted: "#3F1B1B",
      border: "#7F1D1D",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    type: "dark",
    colors: {
      background: "#0A0A0F",
      foreground: "#E5E7EB",
      primary: "#D946EF",
      secondary: "#1C1C2B",
      accent: "#06B6D4",
      muted: "#1C1C2B",
      border: "#4B5563",
    },
  },
];
