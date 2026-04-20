"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Grid2X2, Users, Settings, ListTodo } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { Link } from "@/components/layout/link/CustomLink";
import { Logo } from "./Logo";

export const allRoutes = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Planner", icon: ListTodo, href: "/planner" },
  { label: "Chapters", icon: Grid2X2, href: "/chapters" },
  { label: "Characters", icon: Users, href: "/characters" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function NavigationBar() {
  const pathname = usePathname();
  const isTab = useMediaQuery({ maxWidth: 1024 }); // Adjust breakpoint as needed

  if (isTab) {
    // Smaller screen navigation (bottom dock)
    return (
      <nav className="fixed bottom-6 left-6 right-6 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl p-2 z-50 lg:hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)] glass-panel transition-all">
        <div className="mx-auto flex justify-between items-center px-1 max-w-sm">
          {allRoutes.map((route) => {
            const isActive = pathname.includes(route.href);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "relative flex flex-col items-center justify-center w-14 h-12 gap-1 rounded-xl text-muted-foreground transition-all duration-300 hover:text-primary hover:bg-muted/30 active:scale-95",
                  isActive && "text-primary bg-primary/10 hover:bg-primary/15"
                )}
              >
                <route.icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] sm:text-xs font-medium sr-only sm:not-sr-only md:sr-only">{route.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // Desktop navigation (floating glass sidebar)
  return (
    <nav className="hidden lg:flex lg:fixed lg:left-6 lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-64 lg:flex-col lg:rounded-[2rem] lg:border lg:border-border/50 lg:bg-background/80 lg:backdrop-blur-xl lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:p-4 z-40 glass-panel transition-all">
      <Logo className="mb-8 p-2" />
      <div className="space-y-1.5 px-2">
        {allRoutes.map((route) => {
          const isActive = pathname.includes(route.href);
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/50 active:scale-[0.98]",
                isActive && "text-primary font-medium bg-primary/10 hover:bg-primary/15 hover:text-primary shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              )}
            >
              <route.icon className={cn("h-[18px] w-[18px] transition-transform group-hover:scale-110", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm tracking-wide">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
