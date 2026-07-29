"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Users, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/context/AuthProvider";
import { linkGoogleContacts } from "@/lib/services/auth";
import { useCharacters, useCharacterMutations } from "@/lib/hooks/useCharacters";
import {
  isContactsSyncEnabled,
  setContactsSyncEnabled,
  getContactsAccessToken,
  setContactsAccessToken,
  fetchGoogleContacts,
  mapGoogleContactToCharacter,
} from "@/lib/services/googleContacts";

export function GoogleContactsSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const { user } = useAuth();
  const userId = user?.uid;
  const { data: existingCharacters } = useCharacters();
  const { addMutation } = useCharacterMutations();

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

  const handleSync = async () => {
    if (!userId) {
      toast.error("Authentication required.");
      return;
    }

    if (!isEnabled) {
      toast.error("Please enable Google Contacts sync first.");
      return;
    }

    let token = getContactsAccessToken();
    if (!token) {
      toast.error("Google Contacts session expired. Reconnecting...");
      try {
        setIsLinking(true);
        const credential = await linkGoogleContacts();
        if (credential?.accessToken) {
          token = credential.accessToken;
          setContactsAccessToken(token);
        } else {
          throw new Error("Re-auth failed.");
        }
      } catch (err) {
        setIsEnabled(false);
        setContactsSyncEnabled(false);
        toast.error("Could not reconnect Google Contacts.");
        setIsLinking(false);
        return;
      } finally {
        setIsLinking(false);
      }
    }

    try {
      setIsSyncing(true);
      const rawContacts = await fetchGoogleContacts(token);

      const existingGoogleIds = new Set(
        existingCharacters?.map((c) => c.googleContactId).filter(Boolean),
      );
      const existingNames = new Set(
        existingCharacters?.map((c) => c.name.toLowerCase().trim()),
      );

      let importedCount = 0;
      for (const raw of rawContacts) {
        const payload = mapGoogleContactToCharacter(raw, userId);
        const isDuplicate =
          (payload.googleContactId && existingGoogleIds.has(payload.googleContactId)) ||
          existingNames.has(payload.name.toLowerCase().trim());

        if (!isDuplicate) {
          await addMutation.mutateAsync(payload);
          importedCount++;
        }
      }

      toast.success(`Sync complete! ${importedCount} new contact(s) imported.`);
    } catch (error: any) {
      console.error("Contacts sync error:", error);
      toast.error(error?.message || "An error occurred during contacts sync.");
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
          <Users className="h-5 w-5 text-primary" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold">
              Enable Google Contacts Sync
            </h3>
            <p className="text-sm text-muted-foreground">
              Automatically import your Google Contacts into your ZapJot Characters list.
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
          {isSyncing ? "Syncing..." : isLinking ? "Connecting..." : "Sync Contacts"}
        </Button>
      </div>
    </div>
  );
}
