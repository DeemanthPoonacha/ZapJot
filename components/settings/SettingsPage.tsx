"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Bell,
  Calendar,
  ChevronRight,
  Palette,
  UserCog,
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Users,
} from "lucide-react";

import { NotificationSettings } from "./NotificationsSettings";
import ThemesPage from "./themes/ThemeSelectorAdv";
import { AiSettings } from "./AiSettings";
import { GoogleCalendarSettings } from "./GoogleCalendarSettings";
import { GoogleContactsSettings } from "./GoogleContactsSettings";
import Account from "../account/Account";
import PageLayout from "../layout/PageLayout";
import { useAuth } from "@/lib/context/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type TabId =
  | "overview"
  | "ai"
  | "notifications"
  | "calendar"
  | "contacts"
  | "themes"
  | "account";

interface TabConfig {
  id: TabId;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  badge?: string;
}

const TABS: TabConfig[] = [
  {
    id: "overview",
    label: "Overview",
    subtitle: "Settings dashboard & summary",
    icon: LayoutGrid,
  },
  {
    id: "ai",
    label: "AI Assistance",
    subtitle: "Model power & safety rules",
    icon: Bot,
    badge: "Gemini",
  },
  {
    id: "notifications",
    label: "Notifications",
    subtitle: "Push alerts & timing",
    icon: Bell,
  },
  {
    id: "calendar",
    label: "Google Calendar",
    subtitle: "Event auto-sync",
    icon: Calendar,
  },
  {
    id: "contacts",
    label: "Google Contacts",
    subtitle: "Characters auto-sync",
    icon: Users,
  },
  {
    id: "themes",
    label: "Appearance",
    subtitle: "Themes & colors",
    icon: Palette,
  },
  {
    id: "account",
    label: "Account & Profile",
    subtitle: "Security & credentials",
    icon: UserCog,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
      ? user.email[0].toUpperCase()
      : "ZJ";

  const currentTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <PageLayout
      headerProps={{
        title: "Settings", // activeTab === "overview" ? "Settings" : currentTabInfo.label,
        onBackClick: () => {
          if (activeTab !== "overview") {
            setActiveTab("overview");
          }
        },
        ...(activeTab === "overview" ? { backLink: "/home" } : {}),
      }}
    >
      <div className="container max-w-6xl mx-auto pb-24 px-3 sm:px-6 space-y-6 sm:space-y-8">
        {/* User Profile Header Banner (Responsive) */}
        {activeTab === "overview" && (
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-r from-primary/10 via-card to-card p-4 sm:p-6 shadow-sm backdrop-blur-md">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/30 shadow-md shrink-0">
                  <AvatarImage
                    src={user?.photoURL || undefined}
                    alt={user?.displayName || "User Avatar"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-base sm:text-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate">
                      {user?.displayName || "ZapJot User"}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                      <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Verified User
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {user?.email || "Signed in with ZapJot Account"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/50">
                <Badge
                  variant="outline"
                  className="px-2.5 py-1 text-xs gap-1.5 bg-background/50 border-border"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  ZapJot Hub v1.7
                </Badge>

                {activeTab !== "overview" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="sm:hidden flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Overview
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sticky Horizontal Tab Bar */}
        {activeTab !== "overview" && (
          <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md py-2 -mx-3 px-3 border-b border-border/60">
            <div className="flex w-full md:justify-between items-center gap-2 overflow-x-auto scrollbar-none">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <div
                    className={`w-full mb-2.5 flex flex-col items-center ${tab.id === "overview" ? "sticky left-0 z-10 border-r-2 bg-background" : ""}`}
                  >
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl text-left transition-all relative cursor-pointer ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-settings-tab"
                          className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    </button>
                    <div
                      className={`hidden md:block text-[10px] text-center ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {tab.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Desktop Layout: Sidebar + Active Tab Content Panel */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 items-start">
          {/* Sidebar Navigation (Desktop) */}
          {/* <div className="hidden md:block md:col-span-4 lg:col-span-3 space-y-2 sticky top-24">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Navigation
            </div>
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl text-left transition-all relative cursor-pointer ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-settings-tab"
                        className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium leading-none mb-1 flex items-center gap-1.5">
                          {tab.label}
                          {tab.badge && (
                            <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.2 rounded font-bold">
                              {tab.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {tab.subtitle}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-primary relative z-10 shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div> */}

          {/* Main Content Area */}
          <div className="col-span-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Active Tab Header */}
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                      <currentTabInfo.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      {currentTabInfo.label}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {currentTabInfo.subtitle}
                    </p>
                  </div>
                  {activeTab !== "overview" && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="hidden sm:flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50 cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back to Overview
                    </button>
                  )}
                </div>

                {/* Tab Renderers */}
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TABS.filter((t) => t.id !== "overview").map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <div
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:bg-card/90 cursor-pointer backdrop-blur-sm flex flex-col justify-between"
                        >
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-transform duration-300 group-hover:scale-110">
                              <Icon className="h-5 w-5" />
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>

                          <div className="mt-3 space-y-1">
                            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                              {tab.label}
                              {tab.badge && (
                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                  {tab.badge}
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {tab.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "ai" && (
                  <div className="space-y-6">
                    <AiSettings />
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <NotificationSettings />
                  </div>
                )}

                {activeTab === "calendar" && (
                  <div className="space-y-6">
                    <GoogleCalendarSettings />
                  </div>
                )}

                {activeTab === "contacts" && (
                  <div className="space-y-6">
                    <GoogleContactsSettings />
                  </div>
                )}

                {activeTab === "themes" && (
                  <div className="space-y-6">
                    <ThemesPage />
                  </div>
                )}

                {activeTab === "account" && (
                  <div className="space-y-6">
                    <Account />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
