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
      <form className="w-full space-y-6">
        {!isSupported && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 text-sm flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <p>Push notifications are not supported in this browser.</p>
          </div>
        )}

        {/* Notifications Toggle */}
        <FormField
          control={form.control}
          name="enable_notifications"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <div className="space-y-1">
                  <FormLabel className="text-base font-semibold">
                    Enable Notifications
                  </FormLabel>
                  <FormDescription className="text-sm">
                    Get event and update alerts on this device.
                  </FormDescription>
                </div>
              </div>
              <FormControl>
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
            <FormItem className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                <div className="space-y-1">
                  <FormLabel className="text-base font-semibold">
                    Notification Timing
                  </FormLabel>
                  <FormDescription className="text-sm">
                    Choose when to get event alerts on all registered devices
                    (if enabled).
                  </FormDescription>
                </div>
              </div>
              <div className="min-w-32">
                <Select
                  disabled={!isSupported || isLoading}
                  onValueChange={(value) => {
                    const intValue = parseInt(value, 10);
                    field.onChange(intValue);
                    handleNotifyMinsChange(intValue);
                  }}
                  defaultValue={field.value.toString()}
                  aria-label="Select notification timing"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
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

export function getDeviceId() {
  const key = "zapjot_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
