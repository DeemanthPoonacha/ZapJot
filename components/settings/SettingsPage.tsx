import { Separator } from "@/components/ui/separator";
import { NotificationSettings } from "./NotificationsSettings";
import ThemesPage from "./themes/ThemeSelectorAdv";
import { AiSettings } from "./AiSettings";
import { Bot } from "lucide-react";

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
        <h2 className="text-xl font-bold mb-4">Appearance</h2>
        <ThemesPage />
      </div>
    </div>
  );
}

