"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Grid3X3, Users, Settings, Plus, ListTodo } from "lucide-react";
import FloatingButton from "./ui/floating-button-link";

export const allRoutes = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Planner", icon: ListTodo, href: "/planner" },
  { label: "Chapters", icon: Grid3X3, href: "/chapters" },
  { label: "Characters", icon: Users, href: "/characters" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <>
      <FloatingButton />

      <nav className="fixed bottom-0 w-full border-t bg-background p-2 z-50">
        <div className="mx-auto flex max-w-md justify-between px-4">
          {allRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary",
                route.label === "Home"
                  ? pathname === route.href && "text-primary"
                  : pathname.includes(route.href) && "text-primary"
              )}
            >
              <route.icon className="h-5 w-5" />
              <span className="text-xs">{route.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
