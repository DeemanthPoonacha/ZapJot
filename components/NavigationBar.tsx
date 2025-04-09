"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Grid2X2, Users, Settings, ListTodo } from "lucide-react";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export const allRoutes = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Planner", icon: ListTodo, href: "/planner" },
  { label: "Chapters", icon: Grid2X2, href: "/chapters" },
  { label: "Characters", icon: Users, href: "/characters" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function NavigationBar() {
  const pathname = usePathname();
  const isTab = useMediaQuery({ maxWidth: 1024 }); // Adjust breakpoint as needed

  if (isTab) {
    // Mobile navigation (bottom bar)
    return (
      <nav className="fixed bottom-0 w-full border-t bg-background p-2 z-50 lg:hidden">
        <div className="mx-auto flex max-w-md justify-between px-4">
          {allRoutes.map((route) => {
            const isActive =
              route.label === "Home"
                ? pathname === route.href
                : pathname.includes(route.href);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 p-2 text-muted-foreground transition-transform duration-200 hover:text-primary",
                  isActive &&
                    "text-primary-foreground transform scale-110 transition-transform duration-200"
                )}
              >
                {isActive && (
                  <div className="absolute w-16 h-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full -z-10 transition-transform duration-200 scale-110" />
                )}
                <route.icon className="h-5 w-5" />
                <span className="text-xs">{route.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // Desktop navigation (sidebar)
  return (
    <nav className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:flex-col lg:border-r lg:bg-background lg:p-4">
      <div className="flex h-14 items-center px-4 font-semibold text-lg mb-8">
        ZapJot
      </div>
      <div className="space-y-2 px-2">
        {allRoutes.map((route) => {
          const isActive =
            route.label === "Home"
              ? pathname === route.href
              : pathname.includes(route.href);
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary hover:bg-accent",
                isActive &&
                  "text-primary-foreground bg-primary hover:bg-primary/90 hover:text-primary-foreground"
              )}
            >
              <route.icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
