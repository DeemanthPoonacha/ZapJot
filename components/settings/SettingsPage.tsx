"use client";
import { Separator } from "@/components/ui/separator";
import { NotificationSettings } from "./NotificationsSettings";
import ThemesPage from "./ThemeSelectorAdv";

export default function SettingsPage() {
  return (
    <div className="container space-y-8">
      <div>
        <ThemesPage />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
        <NotificationSettings />
      </div>
    </div>
  );
}
