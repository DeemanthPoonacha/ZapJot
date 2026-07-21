import { db } from "./firebase/db";
import { doc, updateDoc } from "firebase/firestore";

/**
 * Checks if Google Calendar sync is enabled.
 * Reads state from localStorage.
 */
export function isCalendarSyncEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem("google_calendar_sync_enabled") === "true";
}

/**
 * Sets the Google Calendar sync state in localStorage.
 */
export function setCalendarSyncEnabled(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem("google_calendar_sync_enabled", String(enabled));
}

/**
 * Helper to get access token from localStorage.
 * Returns null if token is missing or expired.
 */
export function getCalendarAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("google_calendar_access_token");
  const expiry = localStorage.getItem("google_calendar_token_expiry");

  if (!token) return null;

  if (expiry && Date.now() > Number(expiry)) {
    return null;
  }

  return token;
}

/**
 * Converts ZapJot recurrence into RFC 5545 RRULE format for Google Calendar.
 */
function buildGoogleRecurrence(repeat: string, repeatDays: string[]): string[] | undefined {
  if (!repeat || repeat === "none") return undefined;

  let rrule = `FREQ=${repeat.toUpperCase()}`;

  if (repeat === "weekly" && repeatDays && repeatDays.length > 0) {
    const dayMap = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    const byday = repeatDays.map((d) => dayMap[Number(d)]).filter(Boolean).join(",");
    if (byday) {
      rrule += `;BYDAY=${byday}`;
    }
  } else if (repeat === "monthly" && repeatDays && repeatDays.length > 0) {
    const bymonthday = repeatDays.map((d) => Number(d)).filter((n) => !isNaN(n)).join(",");
    if (bymonthday) {
      rrule += `;BYMONTHDAY=${bymonthday}`;
    }
  }

  return [`RRULE:${rrule}`];
}

/**
 * Calculates reminder override offset in minutes based on nextNotificationAt.
 * Falls back to the passed notifyMinsBefore configuration.
 */
function getReminderMinutes(event: any, dateVal: Date, notifyMinsBefore?: number): number {
  if (event.nextNotificationAt) {
    const notifyDate = new Date(
      event.nextNotificationAt.seconds
        ? event.nextNotificationAt.seconds * 1000
        : event.nextNotificationAt
    );
    const diffMs = dateVal.getTime() - notifyDate.getTime();
    if (diffMs > 0) {
      return Math.floor(diffMs / 60 / 1000);
    }
  }

  return typeof notifyMinsBefore === "number" ? notifyMinsBefore : 10;
}

/**
 * Prepares the Google Calendar Event resource representation.
 */
function buildEventResource(event: any, dateVal: Date, timeZone: string, notifyMinsBefore?: number) {
  const recurrence = buildGoogleRecurrence(event.repeat, event.repeatDays);
  const reminderMinutes = getReminderMinutes(event, dateVal, notifyMinsBefore);

  return {
    summary: event.title,
    description: `${event.notes || ""}\n\n---\nSynced via ZapJot`,
    location: event.location || "",
    start: {
      dateTime: dateVal.toISOString(),
      timeZone,
    },
    end: {
      dateTime: new Date(dateVal.getTime() + 60 * 60 * 1000).toISOString(),
      timeZone,
    },
    recurrence,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: reminderMinutes },
      ],
    },
    extendedProperties: {
      private: {
        source: "zapjot",
      },
    },
  };
}

/**
 * Helper to normalize occurrence date.
 */
function normalizeDate(event: any): Date {
  if (event.nextOccurrence) {
    if (typeof event.nextOccurrence.toDate === "function") {
      return event.nextOccurrence.toDate();
    } else if (event.nextOccurrence instanceof Date) {
      return event.nextOccurrence;
    } else if (event.nextOccurrence.seconds) {
      return new Date(event.nextOccurrence.seconds * 1000);
    } else {
      return new Date(event.nextOccurrence);
    }
  }
  return new Date();
}

/**
 * Inserts an event into Google Calendar.
 */
export async function insertGoogleCalendarEvent(token: string, event: any, notifyMinsBefore?: number): Promise<{ id: string }> {
  const dateVal = normalizeDate(event);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const body = buildEventResource(event, dateVal, timeZone, notifyMinsBefore);

  const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to insert Google Calendar event: ${errorText}`);
  }

  const data = await res.json();
  return { id: data.id };
}

/**
 * Updates an existing Google Calendar event.
 */
export async function updateGoogleCalendarEvent(token: string, googleEventId: string, event: any, notifyMinsBefore?: number): Promise<void> {
  const dateVal = normalizeDate(event);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const body = buildEventResource(event, dateVal, timeZone, notifyMinsBefore);

  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update Google Calendar event: ${errorText}`);
  }
}

/**
 * Deletes a Google Calendar event.
 */
export async function deleteGoogleCalendarEvent(token: string, googleEventId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete Google Calendar event: ${errorText}`);
  }
}

/**
 * Synchronizes events list to Google Calendar.
 */
export async function syncGoogleCalendar(
  userId: string,
  events: any[],
  notifyMinsBefore?: number
): Promise<{ success: boolean; message: string }> {
  const token = getCalendarAccessToken();
  if (!token) {
    throw new Error("Calendar sync enabled but no valid Google Calendar access token was found.");
  }

  let successCount = 0;
  for (const event of events) {
    try {
      if (!event.googleCalendarEventId) {
        const { id } = await insertGoogleCalendarEvent(token, event, notifyMinsBefore);
        const eventRef = doc(db, `users/${userId}/events`, event.id);
        await updateDoc(eventRef, { googleCalendarEventId: id });
        event.googleCalendarEventId = id;
      } else {
        await updateGoogleCalendarEvent(token, event.googleCalendarEventId, event, notifyMinsBefore);
      }
      successCount++;
    } catch (err) {
      console.error(`Error syncing event ${event.id}:`, err);
    }
  }

  return {
    success: true,
    message: `Successfully synced ${successCount} out of ${events.length} event(s) to Google Calendar.`,
  };
}


