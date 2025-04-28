import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/lib/context/AuthProvider";
import { getFcmToken } from "@/lib/utils/notifications";
import { notificationsSchema, NotificationsSettings } from "@/types/settings";
import { useSettings } from "@/lib/hooks/useSettings";

export function NotificationSettings() {
  const { user } = useAuth();
  const userId = user?.uid;

  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { settings, updateNotificationSettings } = useSettings();

  const form = useForm<NotificationsSettings>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      enable_notifications: false, // temporary initial
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        enable_notifications:
          settings.notifications.enable_notifications ?? false,
      });
    }
  }, [settings, form]);

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  async function checkNotificationSupport() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setIsSupported(false);
    }
  }

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast.error("Notification permission denied.");
      throw new Error("Notification permission denied.");
    }
  }

  async function handleToggleChange(checked: boolean) {
    if (!userId) {
      toast.error("Authentication required.");
      return;
    }

    if (checked) {
      try {
        setIsLoading(true);
        await requestPermission();
        const token = await getFcmToken();

        if (!token) {
          throw new Error("Failed to get FCM token.");
        }

        await updateNotificationSettings({
          enable_notifications: true,
          fcmToken: token,
        });

        toast.success("Notifications enabled.");
      } catch (error) {
        console.error(error);
        form.setValue("enable_notifications", false);
        toast.error("Failed to enable notifications.");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);

        await updateNotificationSettings({
          enable_notifications: false,
          fcmToken: null,
        });

        toast.success("Notifications disabled.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to disable notifications.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        {!isSupported && (
          <p className="text-sm text-muted-foreground">
            Push notifications are not supported in this browser.
          </p>
        )}

        <FormField
          control={form.control}
          name="enable_notifications"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div>
                <FormLabel>Notifications</FormLabel>
                <FormDescription>
                  Enable push notifications for updates
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  disabled={!isSupported || isLoading}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleToggleChange(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
