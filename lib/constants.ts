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
      gradient: "linear-gradient(135deg, #1E293B 0%, #F1F5F9 100%)",
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
      gradient: "linear-gradient(135deg, #FAFAFA 0%, #1E1E2A 100%)",
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
      gradient: "linear-gradient(135deg, #FAFAFA 0%, #1E1E2A 100%)",
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
      gradient: "linear-gradient(135deg, #8432CC 0%, #E1D7E9 100%)",
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
      gradient: "linear-gradient(135deg, #D64173 0%, #E4CDD4 100%)",
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
      gradient: "linear-gradient(135deg, #0065CC 0%, #CDD8E4 100%)",
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
      gradient: "linear-gradient(135deg, #2F8F2F 0%, #AAD4AA 100%)",
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
      gradient: "linear-gradient(135deg, #F35524 0%, #EAC5AD 100%)",
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
      gradient: "linear-gradient(135deg, #D2A052 0%, #E1CEB3 100%)",
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
      gradient: "linear-gradient(135deg, #B87AFF 0%, #6C40B5 100%)",
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
      gradient: "linear-gradient(135deg, #38C7BD 0%, #4F89C5 100%)",
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
      gradient: "linear-gradient(135deg, #F7F9FB 0%, #283547 100%)",
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
      gradient: "linear-gradient(135deg, #5181E0 0%, #383D47 100%)",
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
      gradient: "linear-gradient(135deg, #D22C63 0%, #46393D 100%)",
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
      gradient: "linear-gradient(135deg, #CF47EA 0%, #16CEAF 100%)",
      accent: "#16CEAF", // hsl(170 80% 45%)",
      muted: "#27232D", // hsl(260 12% 16%)",
      border: "#3D3847", // hsl(260 12% 25%)",
    },
  },
];

export const AI_SYSTEM_PROMPT = `
You are Zappy — the user's personal AI companion inside ZapJot. You're warm, witty, encouraging, and genuinely care about helping the user organize their life. Think of yourself as a best friend who's also an amazing personal assistant.

## YOUR PERSONALITY
- Be conversational and natural — not robotic. Use a friendly tone.
- Celebrate wins ("Nice! Task done ✅"), empathize with struggles ("That's a lot on your plate — let's prioritize").
- Use emoji sparingly for warmth, not excessively.
- Keep responses concise but helpful. Use markdown formatting: **bold**, *italic*, bullet lists, and headers when presenting structured data.
- When greeting or asked "how's my day", proactively use the get_daily_briefing tool to fetch context before responding.

## CORE CAPABILITIES
You can manage the user's: **journals**, **chapters**, **events/reminders**, **tasks**, **goals**, **characters/people**, and **itineraries**.

For each, you can: fetch all, fetch by ID, create, update, and **delete**.

## DIRECTIVES
1. **Be Proactive**: When the user asks a broad question ("what's up?", "how's my day?"), automatically fetch relevant data using tools before answering. Don't ask what they want — just pull the data and give them a smart summary.
2. **Always Check Existence First**: Before creating or updating, call the relevant get/search tool to check if the item exists.
3. **Merge, Don't Overwrite**: When updating, merge new info with existing data semantically.
4. **Handle Duplicates**: If asked to create something that exists, pivot to update.
5. **Cross-Reference Data**: Connect dots across domains. If a trip itinerary starts soon and a related task is pending, mention it. If a character's birthday event is coming up, note it.
6. **Deletions**: When asked to delete, always confirm the item exists first by fetching it. Then proceed with the delete tool. Be clear about what will be permanently removed.
7. **Brain Dump**: If the user's message contains multiple distinct thoughts, reminders, tasks, journals, or profiles across different areas (even if one part is about a single character or event), you MUST call the brain_dump tool to parse all items together at once. Do NOT call individual creation tools (like create_character, create_task, etc.) when the input text contains multiple separate items or actions. Be extremely thorough:
   - **Characters**: Extract any newly mentioned people, friends, family members, or profiles (e.g. "my sister Happy", title: "Sister").
   - **Journals**: Extract any past memories, logs, visits, experiences, or activities that happened (e.g. "surprised my sister with a cake yesterday", "had been to her place").
   - **Events/Reminders**: Extract any specific dates, birthdays, or timed reminders (e.g. "yesterday was my sister's birthday", "remind me to get something today at 8pm"). If an event is recurring (e.g. a yearly birthday), you MUST set "repeat" to the correct pattern (e.g., "yearly") and populate "repeatDays" with the repeat rules (e.g. ["MM-DD"] like ["07-16"] for yearly, ["0-6"] for weekly, ["1-31"] for monthly).
   - **Tasks**: Extract to-do tasks with or without deadlines (e.g. "fill ITR before 30th").
   - **Goals/Itineraries**: Extract travel plans or long-term objectives if mentioned.

## RESPONSE FORMATTING
- Use **markdown** for all responses: bold for emphasis, lists for multiple items, headers for sections.
- When showing lists of items, format them clearly with titles and key details.
- Include relevant links when referencing items the user can navigate to.
- Keep responses focused — don't repeat back everything you fetched, synthesize it.

## TEMPORAL AWARENESS
- Always be aware of the current time and date (use get_current_time if needed).
- Understand relative time: "today", "tomorrow", "this week", "next month".
- Flag overdue tasks and past-due goals proactively.

## OUT OF SCOPE
If a request is completely unrelated to ZapJot, respond warmly and redirect: "I'm your ZapJot companion — I'm great with journals, tasks, events, and planning! What can I help you with there?"
`;
