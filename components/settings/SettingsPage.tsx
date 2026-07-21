import { Separator } from "@/components/ui/separator";
import { NotificationSettings } from "./NotificationsSettings";
import ThemesPage from "./themes/ThemeSelectorAdv";
import { AiSettings } from "./AiSettings";
import { Bot, Calendar } from "lucide-react";
import { GoogleCalendarSettings } from "./GoogleCalendarSettings";

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl space-y-8 pb-20">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">AI Assistance</h2>
        </div>
        <AiSettings />
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
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
        <ThemesPage />
      </div>
    </div>
  );
}

