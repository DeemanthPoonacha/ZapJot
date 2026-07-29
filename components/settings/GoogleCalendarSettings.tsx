"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { useEvents } from "@/lib/hooks/useEvents";
import { useAuth } from "@/lib/context/AuthProvider";
import { linkGoogleCalendar } from "@/lib/services/auth";
import { useSettings } from "@/lib/hooks/useSettings";
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
  const { settings } = useSettings();
  const notifyMinsBefore = settings?.notifications?.notifyMinsBefore;

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
            localStorage.setItem(
              "google_calendar_access_token",
              credential.accessToken,
            );
            // Default Google access token duration is 1 hour
            const expiryTime = Date.now() + 3600 * 1000;
            localStorage.setItem(
              "google_calendar_token_expiry",
              String(expiryTime),
            );

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
      toast.error(
        "Google Calendar session expired. Please re-enable sync to reconnect.",
      );
      setIsEnabled(false);
      setCalendarSyncEnabled(false);
      return;
    }

    try {
      setIsSyncing(true);
      const eventList = events || [];
      const result = await syncGoogleCalendar(
        userId,
        eventList,
        notifyMinsBefore,
      );
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
        <div className="h-24 bg-muted/60 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">Google Calendar Sync</h3>
              {isEnabled ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border/50">
                  Disconnected
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Automatically synchronize your ZapJot events and schedules
              directly with Google Calendar.
            </p>
          </div>
        </div>
        <div className="ml-4 shrink-0">
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isLinking}
            aria-label="Toggle Google Calendar sync"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-4">
        <div className="text-xs text-muted-foreground">
          {isEnabled
            ? "Sync ready. Click to force trigger manual synchronization."
            : "Turn on sync above to enable calendar integration."}
        </div>
        <Button
          onClick={handleSync}
          disabled={!isEnabled || isSyncing || isLinking}
          size="sm"
          className="gap-2 font-medium shadow-sm transition-all hover:scale-[1.02]"
        >
          {isSyncing || isLinking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isSyncing ? "Syncing..." : isLinking ? "Connecting..." : "Sync Now"}
        </Button>
      </div>
    </div>
  );
}
