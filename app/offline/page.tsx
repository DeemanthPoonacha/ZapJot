"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, Home, Calendar, BookOpen, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const quickLinks = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Planner", href: "/planner", icon: Calendar },
    { label: "Chapters", href: "/chapters", icon: BookOpen },
    { label: "Characters", href: "/characters", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-foreground">
      <div className="max-w-md w-full p-8 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/15 shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-300 animate-pulse">
          <WifiOff className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            You are currently offline
          </h1>
          <p className="text-sm text-purple-200/80">
            ZapJot is currently unable to connect to the network. You can continue navigating cached routes or retry when connectivity is restored.
          </p>
        </div>

        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </Button>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-300/80 mb-3">
            Quick Navigation (Cached Routes)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-purple-400/40 text-xs text-purple-100 transition-all text-left"
                >
                  <Icon className="w-4 h-4 text-purple-300 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
