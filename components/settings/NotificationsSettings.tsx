import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { urlBase64ToUint8Array } from "@/lib/utils";
import { subscribeUser, unsubscribeUser } from "@/lib/services/push-actions";

const FormSchema = z.object({
  enable_notifications: z.boolean().default(false),
});

export function NotificationSettings() {
  const { user } = useAuth();
  const userId = user?.uid;

  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { enable_notifications: false },
  });

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  async function checkNotificationSupport() {
    function isPushSupported() {
      return "serviceWorker" in navigator && "PushManager" in window;
    }

    if (!isPushSupported()) {
      setIsSupported(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();

      if (existingSub) {
        setSubscription(existingSub);
        form.setValue("enable_notifications", true);
      }
    } catch (error) {
      console.error("Error checking notification status:", error);
      setIsSupported(false);
    }
  }

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast.error("Notification permission denied.");
      throw new Error("Notification permission denied.");
    }
    return true;
  }

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      return registration;
    } catch (error) {
      console.error("Service worker registration failed:", error);
      throw error;
    }
  }

  async function subscribeToPush() {
    if (!userId) {
      toast.error("Authentication required.");
      return false;
    }

    try {
      setIsLoading(true);
      await requestPermission();
      const registration = await registerServiceWorker();

      // Get existing subscription or create a new one
      const sub =
        (await registration.pushManager.getSubscription()) ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        }));

      // Store subscription on server
      await subscribeUser(userId, JSON.parse(JSON.stringify(sub)));
      setSubscription(sub);
      toast.success("Notifications enabled.");
      return true;
    } catch (error) {
      console.error("Failed to subscribe:", error);
      toast.error("Failed to enable notifications.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    if (!userId || !subscription) return false;

    try {
      setIsLoading(true);
      await subscription.unsubscribe();
      await unsubscribeUser(userId);
      setSubscription(null);
      toast.success("Notifications disabled.");
      return true;
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      toast.error("Failed to disable notifications.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleChange(checked: boolean) {
    if (checked) {
      const success = await subscribeToPush();
      if (!success) {
        form.setValue("enable_notifications", false);
      }
    } else {
      await unsubscribeFromPush();
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
