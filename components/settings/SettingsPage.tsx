"use client";
import { Separator } from "@/components/ui/separator";
import { NotificationSettings } from "./NotificationsSettings";
import ThemesPage from "./themes/ThemeSelectorAdv";
import { ThemeSelector } from "./themes/ThemeSelectorBasic";

export default function SettingsPage() {
  return (
    <div className="container space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
        <NotificationSettings />
      </div>

      <Separator />

      <div>
        <ThemeSelector />
        <h2 className="text-xl font-bold mb-4">Appearance</h2>
        <ThemesPage />
      </div>
    </div>
  );
}
