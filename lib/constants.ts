import { getDates } from "./utils/date-time";
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
export const DEFAULT_THEME = "purple";

export const colorProperties = [
  { id: "background", name: "Background", hexColor: "#FFFFFF" },
  { id: "foreground", name: "Foreground", hexColor: "#0F1729" },
  { id: "primary", name: "Primary", hexColor: "#1E293B" },
  { id: "secondary", name: "Secondary", hexColor: "#F1F5F9" },
  { id: "accent", name: "Accent", hexColor: "#F1F5F9" },
  { id: "muted", name: "Muted", hexColor: "#F1F5F9" },
  { id: "border", name: "Border", hexColor: "#E2E8F0" },
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
      background: "#FAF7FC", // hsl(280 50% 98%)",
      foreground: "#291839", // hsl(272 40% 16%)",
      primary: "#8432CC", // hsl(272 60% 50%)",
      secondary: "#E7DBEF", // hsl(275 40% 90%)",
      accent: "#E1D7E9", // hsl(272 30% 88%)",
      muted: "#E7DBEF", // hsl(275 40% 90%)",
      border: "#E1D7E9", // hsl(272 30% 88%)",
    },
  },
  {
    id: "rose",
    name: "Rose",
    type: "light",
    colors: {
      background: "#FCF7F9", // hsl(340 50% 98%)",
      foreground: "#311A22", // hsl(340 30% 15%)",
      primary: "#D64173", // hsl(340 65% 55%)",
      secondary: "#EFDBE2", // hsl(340 40% 90%)",
      accent: "#E4CDD4", // hsl(340 30% 85%)",
      muted: "#E8C9D3", // hsl(340 40% 85%)",
      border: "#E4CDD4", // hsl(340 30% 85%)",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    type: "light",
    colors: {
      background: "#F7F9FC", // hsl(210 50% 98%)",
      foreground: "#0E1629", // hsl(222 47% 11%)",
      primary: "#0065CC", // hsl(210 100% 40%)",
      secondary: "#DBE5EF", // hsl(210 40% 90%)",
      accent: "#CDD8E4", // hsl(210 30% 85%)",
      muted: "#CDD8E4", // hsl(210 30% 85%)",
      border: "#CDD8E4", // hsl(210 30% 85%)",
    },
  },
  {
    id: "forest",
    name: "Forest",
    type: "light",
    colors: {
      background: "#EDF6ED", // hsl(145 30% 95%)
      foreground: "#1F3F1F", // hsl(145 50% 10%)
      primary: "#2F8F2F", // hsl(145 60% 35%)
      secondary: "#D5EAD5", // hsl(145 30% 85%)
      accent: "#AAD4AA", // hsl(145 40% 75%)
      muted: "#C2D9C2", // hsl(145 20% 80%)
      border: "#A8C8A8", // hsl(145 30% 75%)
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    type: "light",
    colors: {
      background: "#FFF5EF", // hsl(24 100% 97%)",
      foreground: "#352116", // hsl(20 40% 15%)",
      primary: "#F35524", // hsl(14 90% 55%)",
      secondary: "#F9E1D1", // hsl(24 80% 90%)",
      accent: "#EAC5AD", // hsl(24 60% 80%)",
      muted: "#E8D5C9", // hsl(24 40% 85%)",
      border: "#DBC8BC", // hsl(24 30% 80%)",
    },
  },
  {
    id: "dunes",
    name: "Dunes",
    type: "light",
    colors: {
      background: "#FDF8F0", // pale sand
      foreground: "#3A2E21", // deep desert brown
      primary: "#D2A052", // golden sand
      secondary: "#F2E8D9", // light sand
      accent: "#E1CEB3", // medium sand/khaki
      muted: "#F2E8D9", // light sand
      border: "#E1CEB3", // medium sand/khaki
    },
  },

  // DARK THEMES
  {
    id: "amethyst",
    name: "Amethyst",
    type: "dark",
    colors: {
      background: "#17131F", // deep purple-black
      foreground: "#F2EBFF", // light purple-white
      primary: "#B87AFF", // bright purple
      secondary: "#241B2F", // slightly lighter purple-black
      accent: "#6C40B5", // medium purple
      muted: "#241B2F", // slightly lighter purple-black
      border: "#352644", // medium purple
    },
  },

  {
    id: "abyss",
    name: "Abyss",
    type: "dark",
    colors: {
      background: "#0A1A2F", // deep sea blue
      foreground: "#E6F4F1", // seafoam white
      primary: "#38C7BD", // teal
      secondary: "#122339", // slightly lighter blue
      accent: "#4F89C5", // medium blue
      muted: "#122339", // slightly lighter blue
      border: "#1D3852", // medium blue
    },
  },

  {
    id: "monochrome",
    name: "Monochrome",
    type: "dark",
    colors: {
      background: "#131B29", // deep blue-gray
      foreground: "#F7F9FB", // off-white
      primary: "#F7F9FB", // off-white
      secondary: "#283547", // medium blue-gray
      accent: "#283547", // medium blue-gray
      muted: "#283547", // medium blue-gray
      border: "#48566A", // lighter blue-gray
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    type: "dark",
    colors: {
      background: "#16181C", // hsl(220 13% 10%)",
      foreground: "#EFF1F4", // hsl(220 20% 95%)",
      primary: "#5181E0", // hsl(220 70% 60%)",
      secondary: "#282C33", // hsl(220 12% 18%)",
      accent: "#383D47", // hsl(220 12% 25%)",
      muted: "#282C33", // hsl(220 12% 18%)",
      border: "#383D47", // hsl(220 12% 25%)",
    },
  },
  {
    id: "crimson",
    name: "Crimson",
    type: "dark",
    colors: {
      background: "#1D1518", // hsl(340 15% 10%)",
      foreground: "#F6F2F4", // hsl(340 20% 96%)",
      primary: "#D22C63", // hsl(340 65% 50%)",
      secondary: "#32292C", // hsl(340 10% 18%)",
      accent: "#46393D", // hsl(340 10% 25%)",
      muted: "#32292C", // hsl(340 10% 18%)",
      border: "#46393D", // hsl(340 10% 25%)",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    type: "dark",
    colors: {
      background: "#131117", // hsl(260 15% 8%)",
      foreground: "#F1EFF4", // hsl(260 20% 95%)",
      primary: "#CF47EA", // hsl(290 80% 60%)",
      secondary: "#27232D", // hsl(260 12% 16%)",
      accent: "#16CEAF", // hsl(170 80% 45%)",
      muted: "#27232D", // hsl(260 12% 16%)",
      border: "#3D3847", // hsl(260 12% 25%)",
    },
  },
];
