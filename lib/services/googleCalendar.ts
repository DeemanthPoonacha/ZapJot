/**
 * Mock function to sync events with Google Calendar.
 * Simulates a delay and returns a success status.
 */
export async function syncGoogleCalendar(events: any[]): Promise<{ success: boolean; message: string }> {
  // Simulate a network delay of 1.5 seconds
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
    message: `Successfully synced ${events.length} event(s) to Google Calendar.`,
  };
}

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
