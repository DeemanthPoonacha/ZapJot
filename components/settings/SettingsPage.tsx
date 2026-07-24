"use client";
import { Separator } from "@/components/ui/separator";
import { NotificationSettings } from "./NotificationsSettings";
import ThemesPage from "./themes/ThemeSelectorAdv";
import { AiSettings } from "./AiSettings";
import { Bot, Calendar, ChevronRight, Palette, UserCog } from "lucide-react";
import { GoogleCalendarSettings } from "./GoogleCalendarSettings";
import { useEffect, useState } from "react";
import Account from "../account/Account";
import PageLayout from "../layout/PageLayout";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <PageLayout
      headerProps={{
        title: activeTab
          ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          : "Settings",
        onBackClick: () => {
          setActiveTab(null);
        },
        ...(!activeTab ? { backLink: "/home" } : {}),
      }}
    >
      <div className="container max-w-4xl space-y-8 pb-20 mx-auto">
        {activeTab === "themes" ? (
          <ThemesPage />
        ) : activeTab === "account" ? (
          <Account />
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">AI Assistance</h2>
              </div>
              <AiSettings />
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-bold mb-4">
                Notification Preferences
              </h2>
              <NotificationSettings />
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Google Calendar Sync</h2>
              </div>
              <GoogleCalendarSettings />
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-bold mb-4">Appearance</h2>
              <div
                className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200"
                onClick={() => setActiveTab("themes")}
              >
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5" />
                  <div className="space-y-1">
                    <div className="text-base font-semibold">Themes</div>
                    <div className="text-sm">
                      Choose a theme for your application.
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-bold mb-4">Account</h2>
              <div
                className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200"
                onClick={() => setActiveTab("account")}
              >
                <div className="flex items-center gap-3">
                  <UserCog className="h-5 w-5" />
                  <div className="space-y-1">
                    <div className="text-base font-semibold">Account</div>
                    <div className="text-sm">Manage your account settings.</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
