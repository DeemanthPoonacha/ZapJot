import { EventUpdate, Event } from "@/types/events";
import { addMinutes, isAfter } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";

export function updateEventOccurrence(data: EventUpdate, minsBefore?: number) {
  const nextOccurrence = getNextOccurrence(data)?.toDate() || null;
  if (nextOccurrence) data.nextOccurrence = nextOccurrence;
  const nextNotificationAt = getNextNotificationTime(
    nextOccurrence,
    minsBefore
  );
  if (nextNotificationAt) data.nextNotificationAt = nextNotificationAt;
}

export function getNextNotificationTime(
  nextOccurrence: Date | null,
  minsBefore = 10
): Date | null {
  if (!nextOccurrence) return null;

  const occurrence =
    nextOccurrence instanceof Timestamp
      ? nextOccurrence.toDate()
      : nextOccurrence;

  const notificationTime = addMinutes(occurrence, -minsBefore); // 10 mins before

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
