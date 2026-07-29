"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Users, Loader2, Download } from "lucide-react";
import { linkGoogleContacts } from "@/lib/services/auth";
import {
  isContactsSyncEnabled,
  setContactsSyncEnabled,
  getContactsAccessToken,
  setContactsAccessToken,
} from "@/lib/services/googleContacts";
import { ImportContactsDialog } from "@/components/characters/ImportContactsDialog";

export function GoogleContactsSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsEnabled(isContactsSyncEnabled());
  }, []);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      const existingToken = getContactsAccessToken();
      if (existingToken) {
        setIsEnabled(true);
        setContactsSyncEnabled(true);
        toast.success("Google Contacts sync enabled.");
      } else {
        try {
          setIsLinking(true);
          const credential = await linkGoogleContacts();
          if (credential && credential.accessToken) {
            setContactsAccessToken(credential.accessToken);
            setIsEnabled(true);
            setContactsSyncEnabled(true);
            toast.success("Google Contacts connected and sync enabled.");
          } else {
            throw new Error("No access token returned from Google link.");
          }
        } catch (error: any) {
          console.error("Failed to link Google Contacts:", error);
          setIsEnabled(false);
          setContactsSyncEnabled(false);
          toast.error("Failed to connect Google Contacts. Please try again.");
        } finally {
          setIsLinking(false);
        }
      }
    } else {
      setIsEnabled(false);
      setContactsSyncEnabled(false);
      toast.success("Google Contacts sync disabled.");
    }
  };

  const handleOpenSyncDialog = async () => {
    if (!isEnabled) {
      toast.error("Please enable Google Contacts sync first.");
      return;
    }

    const token = getContactsAccessToken();
    if (!token) {
      try {
        setIsLinking(true);
        const credential = await linkGoogleContacts();
        if (credential?.accessToken) {
          setContactsAccessToken(credential.accessToken);
        } else {
          throw new Error("Re-auth failed.");
        }
      } catch (err) {
        toast.error("Could not connect to Google Contacts.");
        return;
      } finally {
        setIsLinking(false);
      }
    }

    setIsImportDialogOpen(true);
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
          <Users className="h-5 w-5 text-primary" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">
                Enable Google Contacts Sync
              </h3>
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
              Automatically import your Google Contacts into your ZapJot
              Characters list.
            </p>
          </div>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={handleToggle}
          disabled={isLinking}
          aria-label="Toggle Google Contacts sync"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-4">
        <div className="text-xs text-muted-foreground">
          {isEnabled
            ? "Sync ready. Click to preview and select contacts to import/update."
            : "Turn on sync above to connect your Google account."}
        </div>
        <Button
          onClick={handleOpenSyncDialog}
          disabled={!isEnabled || isLinking}
          className="gap-2"
        >
          {isLinking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isLinking ? "Connecting..." : "Sync / Import Contacts"}
        </Button>
      </div>

      <ImportContactsDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
    </div>
  );
}
