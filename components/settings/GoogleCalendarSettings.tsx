"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { useEvents } from "@/lib/hooks/useEvents";
import { useAuth } from "@/lib/context/AuthProvider";
import { linkGoogleCalendar } from "@/lib/services/auth";
import {
  isCalendarSyncEnabled,
  setCalendarSyncEnabled,
  getCalendarAccessToken,
  syncGoogleCalendar,
} from "@/lib/services/googleCalendar";

export function GoogleCalendarSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid;
  const { data: events } = useEvents();

  useEffect(() => {
    setIsMounted(true);
    setIsEnabled(isCalendarSyncEnabled());
  }, []);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      const existingToken = getCalendarAccessToken();
      if (existingToken) {
        setIsEnabled(true);
        setCalendarSyncEnabled(true);
        toast.success("Google Calendar sync enabled.");
      } else {
        try {
          setIsLinking(true);
          const credential = await linkGoogleCalendar();
          if (credential && credential.accessToken) {
            localStorage.setItem("google_calendar_access_token", credential.accessToken);
            // Default Google access token duration is 1 hour
            const expiryTime = Date.now() + 3600 * 1000;
            localStorage.setItem("google_calendar_token_expiry", String(expiryTime));

            setIsEnabled(true);
            setCalendarSyncEnabled(true);
            toast.success("Google Calendar connected and sync enabled.");
          } else {
            throw new Error("No access token returned from Google link.");
          }
        } catch (error) {
          console.error("Failed to link Google Calendar:", error);
          setIsEnabled(false);
          setCalendarSyncEnabled(false);
          toast.error("Failed to connect Google Calendar. Please try again.");
        } finally {
          setIsLinking(false);
        }
      }
    } else {
      setIsEnabled(false);
      setCalendarSyncEnabled(false);
      toast.success("Google Calendar sync disabled.");
    }
  };

  const handleSync = async () => {
    if (!userId) {
      toast.error("Authentication required.");
      return;
    }

    if (!isEnabled) {
      toast.error("Please enable Google Calendar sync first.");
      return;
    }

    const token = getCalendarAccessToken();
    if (!token) {
      toast.error("Google Calendar session expired. Please re-enable sync to reconnect.");
      setIsEnabled(false);
      setCalendarSyncEnabled(false);
      return;
    }

    try {
      setIsSyncing(true);
      const eventList = events || [];
      const result = await syncGoogleCalendar(userId, eventList);
      if (result.success) {
        toast.success(result.message || "Calendar synced successfully!");
      } else {
        toast.error("Failed to sync calendar.");
      }
    } catch (error: any) {
      console.error("Calendar sync error:", error);
      toast.error(error?.message || "An error occurred during sync.");
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
          disabled={isLinking}
          aria-label="Toggle Google Calendar sync"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSync}
          disabled={!isEnabled || isSyncing || isLinking}
          className="gap-2"
        >
          {isSyncing || isLinking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isSyncing ? "Syncing..." : isLinking ? "Connecting..." : "Sync Calendar"}
        </Button>
      </div>
    </div>
  );
}
