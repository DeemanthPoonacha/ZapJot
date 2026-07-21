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
 * Inserts an event into Google Calendar.
 */
export async function insertGoogleCalendarEvent(token: string, event: any): Promise<{ id: string }> {
  let dateVal: Date;
  if (event.nextOccurrence) {
    if (typeof event.nextOccurrence.toDate === "function") {
      dateVal = event.nextOccurrence.toDate();
    } else if (event.nextOccurrence instanceof Date) {
      dateVal = event.nextOccurrence;
    } else if (event.nextOccurrence.seconds) {
      dateVal = new Date(event.nextOccurrence.seconds * 1000);
    } else {
      dateVal = new Date(event.nextOccurrence);
    }
  } else {
    dateVal = new Date();
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const body = {
    summary: event.title,
    description: event.notes || "",
    location: event.location || "",
    start: {
      dateTime: dateVal.toISOString(),
      timeZone,
    },
    end: {
      dateTime: new Date(dateVal.getTime() + 60 * 60 * 1000).toISOString(),
      timeZone,
    },
  };

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
export async function updateGoogleCalendarEvent(token: string, googleEventId: string, event: any): Promise<void> {
  let dateVal: Date;
  if (event.nextOccurrence) {
    if (typeof event.nextOccurrence.toDate === "function") {
      dateVal = event.nextOccurrence.toDate();
    } else if (event.nextOccurrence instanceof Date) {
      dateVal = event.nextOccurrence;
    } else if (event.nextOccurrence.seconds) {
      dateVal = new Date(event.nextOccurrence.seconds * 1000);
    } else {
      dateVal = new Date(event.nextOccurrence);
    }
  } else {
    dateVal = new Date();
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const body = {
    summary: event.title,
    description: event.notes || "",
    location: event.location || "",
    start: {
      dateTime: dateVal.toISOString(),
      timeZone,
    },
    end: {
      dateTime: new Date(dateVal.getTime() + 60 * 60 * 1000).toISOString(),
      timeZone,
    },
  };

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
export async function syncGoogleCalendar(userId: string, events: any[]): Promise<{ success: boolean; message: string }> {
  const token = getCalendarAccessToken();
  if (!token) {
    throw new Error("Calendar sync enabled but no valid Google Calendar access token was found.");
  }

  let successCount = 0;
  for (const event of events) {
    try {
      if (!event.googleCalendarEventId) {
        const { id } = await insertGoogleCalendarEvent(token, event);
        const eventRef = doc(db, `users/${userId}/events`, event.id);
        await updateDoc(eventRef, { googleCalendarEventId: id });
        event.googleCalendarEventId = id;
      } else {
        await updateGoogleCalendarEvent(token, event.googleCalendarEventId, event);
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
