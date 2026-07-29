"use client";
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
import { z } from "zod";
import { useSettings } from "@/lib/hooks/useSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Bell, Clock } from "lucide-react";
import { getDeviceId } from "@/lib/utils";

const FormSchema = z.object({
  enable_notifications: z.boolean().default(false),
  notifyMinsBefore: z.number().min(1).max(60).default(10),
});

export function NotificationSettings() {
  const { user } = useAuth();
  const userId = user?.uid;

  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { settings, updateNotificationSettings } = useSettings();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { enable_notifications: false, notifyMinsBefore: 10 },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        enable_notifications:
          settings.notifications.devices?.[getDeviceId()]?.enabled ?? false,
        notifyMinsBefore: settings.notifications.notifyMinsBefore ?? 10,
      });
    }
    console.log(
      "🚀 ~ useEffect ~ settings.notifications.notifyMinsBefore :",
      settings?.notifications.notifyMinsBefore,
    );
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

    const deviceId = getDeviceId();

    if (checked) {
      try {
        setIsLoading(true);
        await requestPermission();

        const token = await getFcmToken();
        if (!token) {
          throw new Error("Failed to get FCM token.");
        }

        localStorage.setItem("fcmToken", token);

        await updateNotificationSettings({
          ...settings?.notifications,
          devices: {
            ...settings?.notifications.devices,
            [deviceId]: {
              token,
              enabled: true,
              lastActive: new Date().toISOString(),
            },
          },
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

        const token = localStorage.getItem("fcmToken");
        if (token) {
          await updateNotificationSettings({
            ...settings?.notifications,
            devices: {
              ...settings?.notifications.devices,
              [deviceId]: {
                token,
                enabled: false,
                lastActive: new Date().toISOString(),
              },
            },
          });
        }

        toast.success("Notifications disabled.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to disable notifications.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function handleNotifyMinsChange(value: number) {
    if (!userId) {
      toast.error("Authentication required.");
      return;
    }

    try {
      await updateNotificationSettings({
        ...settings?.notifications,
        notifyMinsBefore: value,
      });
      toast.success("Notification timing updated.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notification timing.");
    }
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-5">
        {!isSupported && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-xl p-4 text-sm flex items-center gap-3">
            <Bell className="h-5 w-5 shrink-0 text-amber-500" />
            <p>Push notifications are not supported in this browser environment.</p>
          </div>
        )}

        {/* Notifications Toggle */}
        <FormField
          control={form.control}
          name="enable_notifications"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base font-semibold cursor-pointer">
                      Enable Push Notifications
                    </FormLabel>
                    {field.value && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Active Device
                      </span>
                    )}
                  </div>
                  <FormDescription className="text-sm text-muted-foreground">
                    Receive real-time push alerts for upcoming events, reminders, and updates on this browser.
                  </FormDescription>
                </div>
              </div>
              <FormControl className="ml-4 shrink-0">
                <Switch
                  disabled={!isSupported || isLoading}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleToggleChange(checked);
                  }}
                  aria-label="Toggle notifications"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Notification Timing */}
        <FormField
          control={form.control}
          name="notifyMinsBefore"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md backdrop-blur-sm gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <FormLabel className="text-base font-semibold cursor-pointer">
                    Notification Lead Time
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    Specify how many minutes in advance to receive event alerts on your registered devices.
                  </FormDescription>
                </div>
              </div>
              <div className="w-full sm:w-44 shrink-0">
                <Select
                  disabled={
                    !settings?.notifications.devices?.[getDeviceId()]
                      ?.enabled ||
                    !isSupported ||
                    isLoading
                  }
                  onValueChange={(value) => {
                    const intValue = parseInt(value, 10);
                    if (isNaN(intValue)) {
                      return;
                    }
                    field.onChange(intValue);
                    handleNotifyMinsChange(intValue);
                  }}
                  value={field.value.toString()}
                  aria-label="Select notification timing"
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-background/80 border-border/80 rounded-lg">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border/80 shadow-lg">
                    <SelectItem value="5" className="rounded-lg cursor-pointer">5 minutes before</SelectItem>
                    <SelectItem value="10" className="rounded-lg cursor-pointer">10 minutes before</SelectItem>
                    <SelectItem value="30" className="rounded-lg cursor-pointer">30 minutes before</SelectItem>
                    <SelectItem value="60" className="rounded-lg cursor-pointer">1 hour before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
