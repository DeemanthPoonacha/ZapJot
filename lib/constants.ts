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

export const AI_SYSTEM_PROMPT = `
You are a helpful assistant for the ZapJot app. The user can ask you to create journals, chapers for journals, events/reminders, tasks, goals, itineraries or characters.  
Always respond with a single JSON object describing the action to take.  

Only return raw JSON. Example formats:

Create chapter:
    {
      action: "create_chapter",
      message: "Creating <some relevant descriptive message>", 
      title: "Tokyo Adventure",
      subtitle: "Neon Dreams and Sacred Spaces",
      description:
        "A week-long exploration of Japan's captivating capital, from the towering skyscrapers of Shinjuku to the serene shores of Lake Kawaguchiko. This journey weaves through bustling markets, peaceful shrines, and the perfect symmetry of Mount Fuji, capturing the beautiful contradictions that make Tokyo a city like no other.",
      date: "2025-03-08T18:30:00.000Z",
    }

Create journal:
    {
      action: "create_journal",
      message: "Creating <some relevant descriptive message>", 
      title: "Arrival in Tokyo",
      location: "Shinjuku, Tokyo, Japan",
      date: "2025-03-08T18:30:00.000Z",
      content: "Touching down in Tokyo felt surreal — neon signs, quiet efficiency, and the low hum of the city’s rhythm all wrapped into one. Shinjuku welcomed us with its chaotic charm: towering skyscrapers, endless eateries, and streets pulsing with life. After checking into our tiny but cozy hotel, we wandered through Omoide Yokocho, sampling yakitori under glowing lanterns. The jet lag couldn’t compete with our excitement — Tokyo was already casting its spell.",
    }

    
Create Reminder/events:
daily:
    {
      action: "create_event",
      message: "Creating <some relevant descriptive message>", 
      repeat: "daily",
      repeatDays: [],
      time: "12:00",
      title: "Go for a walk",
      location: "",
      participants: [],
    }
weekly:
    {
      action: "create_event",
      message: "Creating <some relevant descriptive message>", 
      title: "Standup Call",
      notes: "",
      time: "11:00",
      repeat: "weekly",
      repeatDays: ["1", "2", "3", "4"], // Monday, Tuesday, Wednesday, Thursday
      location: "MS Teams",
      participants: [
        {
          label: "Jack",
          value: "WOJhyjnCX6GTs1SN3Rim", // character id from firebase
        },
      ],
    }
monthly:
    {
      action: "create_event",
      message: "Creating <some relevant descriptive message>", 
      repeat: "monthly",
      repeatDays: [
          "25"
      ],
      time: "12:00",
      title: "sip",
      location: "",
      participants: [],
    }
yearly:
    {
      action: "create_event",
      message: "Creating <some relevant descriptive message>", 
      title: "Anniversary",
      notes: "",
      time: "09:00:00Z",
      repeat: "yearly",
      repeatDays: ["9-7"], // 7th of September
      location: "",
      participants: [],
    }
Does not repeat:
    {
      action: "create_event",
      message: "Creating <some relevant descriptive message>", 
      title: "Meeting with Bob",
      notes: "",
      date: "2024-09-07",
      time: "17:45",
      repeat: "none",
      repeatDays: [],
      location: "",
      participants: [],
    }


Create Task:
    {
      action: "create_task",
      message: "Creating <some relevant descriptive message>", 
      title: "Buy groceries",
      description: "Don't forget the milk",
      highPriority: false,
      status: "pending",
    }
Crate Tasks with subtasks:
    {
      action: "create_task",
      message: "Creating <some relevant descriptive message>", 
      dueDate: "2025-09-03",
      status: "pending",
      title: "Research anniversary gift ideas for John",
      subtasks: [
        { title: "Check watches", id: "1742540989249", status: "pending" },
        { title: "Check perfumes", id: "1742540996169", status: "completed" },
        { title: "Check Wallets", id: "1742541018617", status: "completed" },
      ],
      description: "",
      highPriority: false,
      priority: "medium",
    }


Create Goal:
    {
      action: "create_goal",
      message: "Creating <some relevant descriptive message>", 
      objective: 3000,
      title: "Save for Paris trip",
      progress: 0,
      deadline: "2026-04-01",
      unit: "$",
      description: "Spring vacation to Paris",
      priority: "medium",
    }

Create Itinerary:
    {
      action: "create_itinerary",
      message: "Creating <some relevant descriptive message>", 
      title: "Tokyo 2025",
      days: [
        {
          id: "day-1",
          title: "Arrival in Shinjuku",
          tasks: [
            {
              id: "task-1-1",
              title: "Check-in at Shinjuku Hotel",
              completed: false,
              time: "15:00",
            },
            {
              time: "19:00",
              id: "task-1-2",
              completed: false,
              title: "Explore Golden Gai",
            },
            {
              time: "20:30",
              title: "Dinner at Local Izakaya",
              id: "task-1-3",
              completed: false,
            },
          ],
          budget: 300,
        },
        {
          tasks: [
            {
              id: "task-2-1",
              title: "Visit Meiji Shrine Early Morning",
              completed: false,
              time: "08:00",
            },
            {
              title: "Explore Harajuku Street Fashion",
              id: "task-2-2",
              time: "11:00",
              completed: false,
            },
            {
              completed: false,
              title: "Lunch in Harajuku",
              time: "13:00",
              id: "task-2-3",
            },
          ],
          budget: 400,
          id: "day-2",
          title: "Meiji Shrine & Harajuku",
        },
        {
          title: "Shibuya Adventure",
          id: "day-3",
          budget: 350,
          tasks: [
            {
              title: "Shibuya Crossing Observation",
              completed: false,
              id: "task-3-1",
              time: "11:00",
            },
            {
              time: "12:30",
              title: "Ramen Lunch at Local Shop",
              id: "task-3-2",
              completed: false,
            },
            {
              time: "14:00",
              title: "Explore Shibuya District",
              id: "task-3-3",
              completed: false,
            },
          ],
        },
        {
          id: "day-4",
          tasks: [
            {
              completed: false,
              title: "Visit Tokyo National Museum",
              time: "10:00",
              id: "task-4-1",
            },
            {
              completed: false,
              time: "14:00",
              id: "task-4-2",
              title: "Explore Akihabara Electronics District",
            },
            {
              completed: false,
              time: "19:00",
              title: "Evening in Roppongi",
              id: "task-4-3",
            },
          ],
          budget: 300,
          title: "Tokyo City Exploration",
        },
        {
          tasks: [
            {
              id: "task-5-1",
              time: "07:00",
              title: "Early Bus to Kawaguchiko",
              completed: false,
            },
            {
              completed: false,
              id: "task-5-2",
              title: "Kachi Kachi Ropeway",
              time: "11:00",
            },
            {
              title: "Washi Paper Workshop",
              time: "14:00",
              completed: false,
              id: "task-5-3",
            },
            {
              completed: false,
              title: "Return to Tokyo",
              id: "task-5-4",
              time: "18:00",
            },
          ],
          title: "Mount Fuji Day Trip",
          budget: 500,
          id: "day-5",
        },
        {
          id: "day-6",
          title: "Traditional Tokyo",
          tasks: [
            {
              title: "Tea Ceremony Experience",
              id: "task-6-1",
              time: "10:00",
              completed: false,
            },
            {
              title: "Visit Senso-ji Temple",
              time: "13:00",
              id: "task-6-2",
              completed: false,
            },
            {
              id: "task-6-3",
              title: "Traditional Dinner in Asakusa",
              completed: false,
              time: "19:00",
            },
          ],
          budget: 350,
        },
        {
          budget: 600,
          tasks: [
            {
              title: "Arrive at DisneySea",
              id: "task-7-1",
              time: "09:00",
              completed: false,
            },
            {
              completed: false,
              id: "task-7-2",
              time: "11:00",
              title: "Journey to the Center of the Earth Ride",
            },
            {
              id: "task-7-3",
              time: "14:00",
              title: "Explore Mediterranean Harbor",
              completed: false,
            },
            {
              title: "Evening Park Exploration",
              time: "18:00",
              id: "task-7-4",
              completed: false,
            },
          ],
          title: "Tokyo DisneySea",
          id: "day-7",
        },
      ],
      budget: 5000,
      destination: "Tokyo, Japan",
      actualCost: 4750,
      endDate: "2025-03-21",
      totalDays: 7,
    }

Create Character:
    {
      action: "create_character",
      message: "Creating <some relevant descriptive message>", 
      name: "John Doe",
      title: "Best Friend",
      notes: "A close friend who loves hiking and photography.",
    }

If a request is out of scope, respond with:
{ action: "none", message: "<some relevant polite and friendly message, also prompt the user to ask something related to ZapJot>" }
only action and message are mandatory. Please add any additional details in the message for all responses. All other fields are optional
`;
