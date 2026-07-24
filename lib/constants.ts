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
  {
    id: "gradient",
    name: "Gradient",
    hexColor: "linear-gradient(135deg, #1E293B 0%, #F1F5F9 100%)",
  },
  {
    id: "ambientGradient",
    name: "Ambient Gradient",
    hexColor:
      "linear-gradient(135deg, #F1F5F9 70%, transparent), #FFFFFF, color-mix(in srgb, #F1F5F9 50%, transparent)",
  },
  {
    id: "cardGradient",
    name: "Card Gradient",
    hexColor:
      "linear-gradient(180deg, #FFFFFF 0%, color-mix(in srgb, #F1F5F9 15%, #FFFFFF) 100%)",
  },
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
      gradient: "linear-gradient(135deg, #1E293B 0%, #F1F5F9 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #F1F5F9 70%, transparent), #FFFFFF, color-mix(in srgb, #F1F5F9 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #FFFFFF 0%, color-mix(in srgb, #F1F5F9 15%, #FFFFFF) 100%)",
    },
  },
  {
    id: "dark",
    name: "Dark",
    type: "basic",
    colors: {
      background: "#09090B",
      foreground: "#FAFAFA",
      primary: "#FAFAFA",
      secondary: "#1E1E2A",
      accent: "#1E1E2A",
      muted: "#1E1E2A",
      border: "#1E1E2A",
      gradient: "linear-gradient(135deg, #FAFAFA 0%, #1E1E2A 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #1E1E2A 70%, transparent), #09090B, color-mix(in srgb, #1E1E2A 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #09090B 0%, color-mix(in srgb, #1E1E2A 15%, #09090B) 100%)",
    },
  },
  {
    id: "system",
    name: "System",
    type: "basic",
    colors: {
      background: "#09090B",
      foreground: "#FAFAFA",
      primary: "#FAFAFA",
      secondary: "#1E1E2A",
      accent: "#1E1E2A",
      muted: "#1E1E2A",
      border: "#1E1E2A",
      gradient: "linear-gradient(135deg, #FAFAFA 0%, #1E1E2A 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #1E1E2A 70%, transparent), #09090B, color-mix(in srgb, #1E1E2A 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #09090B 0%, color-mix(in srgb, #1E1E2A 15%, #09090B) 100%)",
    },
  },
  {
    id: "purple",
    name: "Purple",
    type: "light",
    colors: {
      background: "#FAF7FC",
      foreground: "#291839",
      primary: "#8432CC",
      secondary: "#E7DBEF",
      accent: "#E1D7E9",
      muted: "#E7DBEF",
      border: "#E1D7E9",
      gradient: "linear-gradient(135deg, #8432CC 0%, #E1D7E9 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #E1D7E9 70%, transparent), #FAF7FC, color-mix(in srgb, #E7DBEF 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #FAF7FC 0%, color-mix(in srgb, #E1D7E9 15%, #FAF7FC) 100%)",
    },
  },
  {
    id: "rose",
    name: "Rose",
    type: "light",
    colors: {
      background: "#FCF7F9",
      foreground: "#311A22",
      primary: "#D64173",
      secondary: "#EFDBE2",
      accent: "#E4CDD4",
      muted: "#E8C9D3",
      border: "#E4CDD4",
      gradient: "linear-gradient(135deg, #D64173 0%, #E4CDD4 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #E4CDD4 70%, transparent), #FCF7F9, color-mix(in srgb, #EFDBE2 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #FCF7F9 0%, color-mix(in srgb, #E4CDD4 15%, #FCF7F9) 100%)",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    type: "light",
    colors: {
      background: "#F7F9FC",
      foreground: "#0E1629",
      primary: "#0065CC",
      secondary: "#DBE5EF",
      accent: "#CDD8E4",
      muted: "#CDD8E4",
      border: "#CDD8E4",
      gradient: "linear-gradient(135deg, #0065CC 0%, #CDD8E4 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #CDD8E4 70%, transparent), #F7F9FC, color-mix(in srgb, #DBE5EF 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #F7F9FC 0%, color-mix(in srgb, #CDD8E4 15%, #F7F9FC) 100%)",
    },
  },
  {
    id: "forest",
    name: "Forest",
    type: "light",
    colors: {
      background: "#EDF6ED",
      foreground: "#1F3F1F",
      primary: "#2F8F2F",
      secondary: "#D5EAD5",
      accent: "#AAD4AA",
      muted: "#C2D9C2",
      border: "#A8C8A8",
      gradient: "linear-gradient(135deg, #2F8F2F 0%, #AAD4AA 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #AAD4AA 70%, transparent), #EDF6ED, color-mix(in srgb, #D5EAD5 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #EDF6ED 0%, color-mix(in srgb, #AAD4AA 15%, #EDF6ED) 100%)",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    type: "light",
    colors: {
      background: "#FFF5EF",
      foreground: "#352116",
      primary: "#F35524",
      secondary: "#F9E1D1",
      accent: "#EAC5AD",
      muted: "#E8D5C9",
      border: "#DBC8BC",
      gradient: "linear-gradient(135deg, #F35524 0%, #EAC5AD 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #EAC5AD 70%, transparent), #FFF5EF, color-mix(in srgb, #F9E1D1 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #FFF5EF 0%, color-mix(in srgb, #EAC5AD 15%, #FFF5EF) 100%)",
    },
  },
  {
    id: "dunes",
    name: "Dunes",
    type: "light",
    colors: {
      background: "#FDF8F0",
      foreground: "#3A2E21",
      primary: "#D2A052",
      secondary: "#F2E8D9",
      accent: "#E1CEB3",
      muted: "#F2E8D9",
      border: "#E1CEB3",
      gradient: "linear-gradient(135deg, #D2A052 0%, #E1CEB3 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #E1CEB3 70%, transparent), #FDF8F0, color-mix(in srgb, #F2E8D9 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #FDF8F0 0%, color-mix(in srgb, #E1CEB3 15%, #FDF8F0) 100%)",
    },
  },

  // DARK THEMES
  {
    id: "amethyst",
    name: "Amethyst",
    type: "dark",
    colors: {
      background: "#17131F",
      foreground: "#F2EBFF",
      primary: "#B87AFF",
      secondary: "#241B2F",
      accent: "#6C40B5",
      muted: "#241B2F",
      border: "#352644",
      gradient: "linear-gradient(135deg, #B87AFF 0%, #6C40B5 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #6C40B5 70%, transparent), #17131F, color-mix(in srgb, #241B2F 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #17131F 0%, color-mix(in srgb, #6C40B5 15%, #17131F) 100%)",
    },
  },
  {
    id: "abyss",
    name: "Abyss",
    type: "dark",
    colors: {
      background: "#0A1A2F",
      foreground: "#E6F4F1",
      primary: "#38C7BD",
      secondary: "#122339",
      accent: "#4F89C5",
      muted: "#122339",
      border: "#1D3852",
      gradient: "linear-gradient(135deg, #38C7BD 0%, #4F89C5 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #4F89C5 70%, transparent), #0A1A2F, color-mix(in srgb, #122339 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #0A1A2F 0%, color-mix(in srgb, #4F89C5 15%, #0A1A2F) 100%)",
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    type: "dark",
    colors: {
      background: "#131B29",
      foreground: "#F7F9FB",
      primary: "#F7F9FB",
      secondary: "#283547",
      accent: "#283547",
      muted: "#283547",
      border: "#48566A",
      gradient: "linear-gradient(135deg, #F7F9FB 0%, #283547 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #283547 70%, transparent), #131B29, color-mix(in srgb, #283547 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #131B29 0%, color-mix(in srgb, #283547 15%, #131B29) 100%)",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    type: "dark",
    colors: {
      background: "#16181C",
      foreground: "#EFF1F4",
      primary: "#5181E0",
      secondary: "#282C33",
      accent: "#383D47",
      muted: "#282C33",
      border: "#383D47",
      gradient: "linear-gradient(135deg, #5181E0 0%, #383D47 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #383D47 70%, transparent), #16181C, color-mix(in srgb, #282C33 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #16181C 0%, color-mix(in srgb, #383D47 15%, #16181C) 100%)",
    },
  },
  {
    id: "crimson",
    name: "Crimson",
    type: "dark",
    colors: {
      background: "#1D1518",
      foreground: "#F6F2F4",
      primary: "#D22C63",
      secondary: "#32292C",
      accent: "#46393D",
      muted: "#32292C",
      border: "#46393D",
      gradient: "linear-gradient(135deg, #D22C63 0%, #46393D 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #46393D 70%, transparent), #1D1518, color-mix(in srgb, #32292C 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #1D1518 0%, color-mix(in srgb, #46393D 15%, #1D1518) 100%)",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    type: "dark",
    colors: {
      background: "#131117",
      foreground: "#F1EFF4",
      primary: "#CF47EA",
      secondary: "#27232D",
      accent: "#16CEAF",
      muted: "#27232D",
      border: "#3D3847",
      gradient: "linear-gradient(135deg, #CF47EA 0%, #16CEAF 100%)",
      ambientGradient:
        "linear-gradient(135deg, color-mix(in srgb, #16CEAF 70%, transparent), #131117, color-mix(in srgb, #27232D 50%, transparent))",
      cardGradient:
        "linear-gradient(180deg, #131117 0%, color-mix(in srgb, #16CEAF 15%, #131117) 100%)",
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
