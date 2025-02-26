import { Event } from "@/types/events";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/**
 * Calculates the next occurrence of an event based on its repeat pattern
 * @param {Object} event - The event object with repeat, repeatDays, date, and time properties
 * @return {dayjs.Dayjs} The next occurrence date of the event as a dayjs object
 */
export const getNextOccurrence = (event: Event) => {
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
      let baseDate = now.hour(hours).minute(minutes).second(0).millisecond(0);
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
      let baseDate = now.hour(hours).minute(minutes).second(0).millisecond(0);

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
      let thisYearDate = dayjs()
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
