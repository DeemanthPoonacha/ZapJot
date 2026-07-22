"use client";

import { useEffect, useRef } from "react";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import { toast } from "sonner";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline } = useNetworkStatus();
  const previousStatusRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (previousStatusRef.current === null) {
      previousStatusRef.current = isOnline;
      if (!isOnline) {
        toast.warning("You are offline. Working with local cached data.");
      }
      return;
    }

    if (previousStatusRef.current !== isOnline) {
      if (!isOnline) {
        toast.warning("You are offline. Working with local cached data.");
      } else {
        toast.success("Back online! Syncing latest changes...");
      }
      previousStatusRef.current = isOnline;
    }
  }, [isOnline]);

  if (isOnline) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto w-[92%] fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500/90 text-amber-950 font-medium text-xs sm:text-sm shadow-lg backdrop-blur-md border border-amber-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto justify-center">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        Offline Mode — Changes will be saved locally and synced automatically
        when back online
      </span>
    </div>
  );
}
