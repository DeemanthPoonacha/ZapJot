"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { useEvents } from "@/lib/hooks/useEvents";
import {
  isCalendarSyncEnabled,
  setCalendarSyncEnabled,
  syncGoogleCalendar,
} from "@/lib/services/googleCalendar";

export function GoogleCalendarSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { data: events } = useEvents();

  useEffect(() => {
    setIsMounted(true);
    setIsEnabled(isCalendarSyncEnabled());
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    setCalendarSyncEnabled(checked);
    if (checked) {
      toast.success("Google Calendar sync enabled.");
    } else {
      toast.success("Google Calendar sync disabled.");
    }
  };

  const handleSync = async () => {
    if (!isEnabled) {
      toast.error("Please enable Google Calendar sync first.");
      return;
    }

    try {
      setIsSyncing(true);
      const eventList = events || [];
      const result = await syncGoogleCalendar(eventList);
      if (result.success) {
        toast.success("Calendar synced successfully!");
      } else {
        toast.error("Failed to sync calendar.");
      }
    } catch (error) {
      console.error("Calendar sync error:", error);
      toast.error("An error occurred during sync.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200 hover:bg-muted/50">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold">
              Enable Google Calendar Sync
            </h3>
            <p className="text-sm text-muted-foreground">
              Automatically synchronize your events with your Google Calendar account.
            </p>
          </div>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={handleToggle}
          aria-label="Toggle Google Calendar sync"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSync}
          disabled={!isEnabled || isSyncing}
          className="gap-2"
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isSyncing ? "Syncing..." : "Sync Calendar"}
        </Button>
      </div>
    </div>
  );
}
