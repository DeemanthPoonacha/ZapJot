import { Event, EventUpdate } from "@/types/events";
import { Theme } from "@/types/themes";
import { clsx, type ClassValue } from "clsx";
import { addMinutes, isAfter } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPluralWord = (word: string, count: number) => {
  return count !== 1 ? `${word}s` : word;
};

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function getMinutesRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

// Function to format the date
export const formatDateTitle = (
  dateString: string = new Date().toISOString()
) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // Example: "Fri, 3rd Nov 2025"
};

// Function to format the date
export const formatDate = (dateString: string = new Date().toISOString()) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // Example: "3rd Nov 2025"
};

export function GetDateTime() {
  return new Date().toString().split(" GMT", 1);
}

export function getDates(month: number = 0, year: number = 2020) {
  const daysInMonth = dayjs()
    .set("month", month)
    .set("year", year)
    .daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

export function updateEventOccurrence(data: EventUpdate) {
  const nextOccurrence = getNextOccurrence(data)?.toDate() || null;
  if (nextOccurrence) data.nextOccurrence = nextOccurrence;
  const nextNotificationAt = getNextNotificationTime(nextOccurrence);
  if (nextNotificationAt) data.nextNotificationAt = nextNotificationAt;
}

export function getNextNotificationTime(
  nextOccurrence: Date | null
): Date | null {
  if (!nextOccurrence) return null;

  const occurrence =
    nextOccurrence instanceof Timestamp
      ? nextOccurrence.toDate()
      : nextOccurrence;

  const notificationTime = addMinutes(occurrence, -10); // 10 mins before

  return isAfter(notificationTime, new Date()) ? notificationTime : null;
}

/**
 * Calculates the next occurrence of an event based on its repeat pattern
 * @param {Object} event - The event object with repeat, repeatDays, date, and time properties
 * @return {dayjs.Dayjs} The next occurrence date of the event as a dayjs object
 */
export const getNextOccurrence = (event: EventUpdate) => {
  const now = dayjs();
  const eventTime = event.time || "00:00";
  const [hours, minutes] = eventTime.split(":").map(Number);

  // For one-time events
  if (event.repeat === "none" && event.date) {
    const eventDate = dayjs(`${event.date}T${eventTime}`);
    return eventDate;
  }

  // For repeating events
  switch (event.repeat) {
    case "daily": {
      // Set time to event time, but date to today
      let nextDate = now.hour(hours).minute(minutes).second(0).millisecond(0);

      // If today's occurrence has passed, move to tomorrow
      if (nextDate.isBefore(now)) {
        nextDate = nextDate.add(1, "day");
      }

      return nextDate;
    }

    case "weekly": {
      const weekDays = event.repeatDays?.map((day) => parseInt(day));
      if (!weekDays?.length) return null;

      // Today with event time
      const baseDate = now.hour(hours).minute(minutes).second(0).millisecond(0);
      const currentDay = now.day();

      // Find the next day in the repeatDays array
      const sortedWeekDays = [...weekDays].sort((a, b) => a - b);

      // Check if today is in the repeatDays and the event hasn't occurred yet
      if (weekDays.includes(currentDay) && baseDate.isAfter(now)) {
        return baseDate;
      }

      // Find days later this week
      const nextDays = sortedWeekDays.filter((day) => day > currentDay);

      if (nextDays.length > 0) {
        // There's a day later this week
        const daysToAdd = nextDays[0] - currentDay;
        return baseDate.add(daysToAdd, "day");
      } else {
        // Wrap around to next week
        const daysToAdd = 7 - currentDay + sortedWeekDays[0];
        return baseDate.add(daysToAdd, "day");
      }
    }

    case "monthly": {
      const monthDays = event.repeatDays?.map((day) => parseInt(day));
      if (!monthDays?.length) return null;

      const currentDate = now.date();
      const currentMonth = now.month();
      const currentYear = now.year();

      // Today with event time
      const baseDate = now.hour(hours).minute(minutes).second(0).millisecond(0);

      // Check if today is a repeat day and the event hasn't occurred yet
      if (monthDays.includes(currentDate) && baseDate.isAfter(now)) {
        return baseDate;
      }

      // Find days later this month
      const nextDays = monthDays.filter((day) => day > currentDate);

      if (nextDays.length > 0) {
        // There's a day later this month
        return dayjs()
          .year(currentYear)
          .month(currentMonth)
          .date(nextDays[0])
          .hour(hours)
          .minute(minutes)
          .second(0);
      } else {
        // Move to next month
        return dayjs()
          .year(currentYear)
          .month(currentMonth + 1)
          .date(monthDays[0])
          .hour(hours)
          .minute(minutes)
          .second(0);
      }
    }

    case "yearly": {
      if (!event.repeatDays?.length) return null;

      const [monthStr, dayStr] = event.repeatDays[0].split("-");
      const month = parseInt(monthStr) - 1; // JavaScript months are 0-indexed
      const day = parseInt(dayStr);

      const currentYear = now.year();

      // This year's occurrence with event time
      const thisYearDate = dayjs()
        .year(currentYear)
        .month(month)
        .date(day)
        .hour(hours)
        .minute(minutes)
        .second(0);

      // If this year's date hasn't passed yet, return it
      if (thisYearDate.isAfter(now)) {
        return thisYearDate;
      }

      // Otherwise return next year's occurrence
      return thisYearDate.add(1, "year");
    }

    default:
      return null;
  }
};

const getOccurrenceDate = (date: string, time: string) =>
  dayjs(`${date}${time}`).toDate();

function getDatesBetween(startDate: Dayjs, endDate: Dayjs) {
  const dates: Record<
    string,
    {
      date: string;
      weekDay: string;
      monthDay: string;
      yearDay: string;
    }
  > = {};
  let currentDate = startDate;
  const end = endDate;

  while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
    const dateStr = currentDate.format("YYYY-MM-DD");
    if (!dates[dateStr])
      dates[dateStr] = {
        date: dateStr,
        weekDay: currentDate.day().toString(),
        monthDay: currentDate.date().toString(),
        yearDay: currentDate.format("M-D"),
      };

    currentDate = currentDate.add(1, "day");
  }

  return dates;
}

/**
 * Groups events by their date and handles different repetition types.
 * @param {Array} events - The array of event objects to group.
 * @param {Date} startDate - The start date for the grouping.
 * @param {Date} endDate - The end date for the grouping.
 * @returns {Object} An object where keys are dates and values are arrays of events for that date.
 */
export const groupEventsByDate = (
  events: Event[],
  startDate?: Date,
  endDate?: Date
): Record<string, Event[]> => {
  // Get all dates between start and end date
  const dateRange = getDatesBetween(
    dayjs(startDate).startOf("day"),
    dayjs(endDate).endOf("day")
  );

  // Initialize data structures to hold events by repetition type
  const eventsByDate: Record<string, Event[]> = {};
  const eventsByRepeatType = {
    daily: [] as Event[],
    weekly: {} as Record<string, Event[]>,
    monthly: {} as Record<string, Event[]>,
    yearly: {} as Record<string, Event[]>,
  };

  // Initialize the eventsByDate object with empty arrays for all dates
  Object.keys(dateRange).forEach((date) => {
    eventsByDate[date] = [];
  });

  // First pass: categorize events by their repetition type
  events.forEach((event) => {
    if (event.repeat === "none") {
      const dateStr = event.date as string;

      if (!eventsByDate[dateStr]) return;

      eventsByDate[dateStr].push({
        ...event,
        nextOccurrence: getOccurrenceDate(event.date!, event.time),
      });
    } else if (event.repeat === "daily") {
      eventsByRepeatType.daily.push(event);
    } else if (["weekly", "monthly", "yearly"].includes(event.repeat)) {
      // Handle events with repeatDays
      event.repeatDays.forEach((day) => {
        const repeatType = event.repeat as "weekly" | "monthly" | "yearly";
        if (!eventsByRepeatType[repeatType][day]) {
          eventsByRepeatType[repeatType][day] = [];
        }
        eventsByRepeatType[repeatType][day].push(event);
      });
    }
  });

  // Second pass: populate eventsByDate with recurring events for each date
  Object.entries(dateRange).forEach(
    ([date, { weekDay, monthDay, yearDay }]) => {
      // Add daily events
      if (eventsByRepeatType.daily.length > 0) {
        eventsByDate[date].push(
          ...eventsByRepeatType.daily.map((event) => ({
            ...event,
            nextOccurrence: getOccurrenceDate(date, event.time),
          }))
        );
      }

      // Add weekly events
      const weeklyEventsForDay = eventsByRepeatType.weekly[weekDay] || [];
      if (weeklyEventsForDay.length > 0) {
        eventsByDate[date].push(
          ...weeklyEventsForDay.map((event) => ({
            ...event,
            nextOccurrence: getOccurrenceDate(date, event.time),
          }))
        );
      }

      // Add monthly events
      const monthlyEventsForDay = eventsByRepeatType.monthly[monthDay] || [];
      if (monthlyEventsForDay.length > 0) {
        eventsByDate[date].push(
          ...monthlyEventsForDay.map((event) => ({
            ...event,
            nextOccurrence: getOccurrenceDate(date, event.time),
          }))
        );
      }

      // Add yearly events
      const yearlyEventsForDay = eventsByRepeatType.yearly[yearDay] || [];
      if (yearlyEventsForDay.length > 0) {
        eventsByDate[date].push(
          ...yearlyEventsForDay.map((event) => ({
            ...event,
            nextOccurrence: getOccurrenceDate(date, event.time),
          }))
        );
      }
    }
  );

  // console.log("🚀 ~ Object.entries ~ weeklyEvents:", weeklyEvents);

  return eventsByDate;
};

// Helper function to convert hex to HSL format for CSS variables
export function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find min and max values of R, G, B
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate luminance
  let l = (max + min) / 2;

  // If max and min are the same, it's a shade of gray
  if (max === min) {
    return `0 0% ${Math.round(l * 100)}%`;
  }

  // Calculate saturation
  let s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

  // Calculate hue
  let h = 0;
  if (max === r) {
    h = ((g - b) / (max - min)) % 6;
  } else if (max === g) {
    h = (b - r) / (max - min) + 2;
  } else {
    h = (r - g) / (max - min) + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

// Invert a color for contrast
export function invertColor(hex: string): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Determine if color is light or dark
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return white for dark colors, black for light colors
  return brightness < 128 ? "#FFFFFF" : "#000000";
}

// Adjust brightness of a color
export function adjustBrightness(hex: string, factor: number): string {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  if (factor < 1) {
    // darken
    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);
  } else {
    // lighten
    r = Math.min(255, Math.floor(r + (255 - r) * (factor - 1)));
    g = Math.min(255, Math.floor(g + (255 - g) * (factor - 1)));
    b = Math.min(255, Math.floor(b + (255 - b) * (factor - 1)));
  }

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export const addCustomCssVariables = (themeObj: Theme) => {
  let styleEl = document.getElementById(`theme-${themeObj.id}`);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = `theme-${themeObj.id}`;
    document.head.appendChild(styleEl);
  }

  const cssVariables = `
      [data-theme="${themeObj.id}"],
      .${themeObj.id} {
        --background: hsl(${hexToHSL(themeObj.colors.background)});
        --foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --primary: hsl(${hexToHSL(themeObj.colors.primary)});
        --primary-foreground: hsl(${hexToHSL(
          invertColor(themeObj.colors.primary)
        )});
        --secondary: hsl(${hexToHSL(themeObj.colors.secondary)});
        --secondary-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --accent: hsl(${hexToHSL(themeObj.colors.accent)});
        --accent-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --muted: hsl(${hexToHSL(themeObj.colors.muted)});
        --muted-foreground: hsl(${hexToHSL(
          adjustBrightness(themeObj.colors.foreground, 0.6)
        )});
        --border: hsl(${hexToHSL(themeObj.colors.border)});
        --input: hsl(${hexToHSL(themeObj.colors.border)});
        --card: hsl(${hexToHSL(themeObj.colors.background)});
        --card-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --popover: hsl(${hexToHSL(themeObj.colors.background)});
        --popover-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --ring: hsl(${hexToHSL(themeObj.colors.primary)});
      }
    `;
  styleEl.textContent = cssVariables;
};

export function removeCustomCssVariables(deletedThemeId: string) {
  const styleEl = document.getElementById(`theme-${deletedThemeId}`);
  if (styleEl) {
    document.head.removeChild(styleEl);
  }
}
