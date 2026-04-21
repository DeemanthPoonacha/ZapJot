"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
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
import { useSettings } from "@/lib/hooks/useSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Bot, Brain, CheckCircle2, Zap } from "lucide-react";

const AiSettingsFormSchema = z.object({
  confirmAiActions: z.boolean().default(true),
  autoMergeNotes: z.boolean().default(true),
  preferredModel: z.string().default("gemini-1.5-flash"),
});

type AiSettingsFormValues = z.infer<typeof AiSettingsFormSchema>;

export function AiSettings() {
  const { settings, updateAiSettings, isSettingsLoading } = useSettings();

  const form = useForm<AiSettingsFormValues>({
    resolver: zodResolver(AiSettingsFormSchema),
    defaultValues: {
      confirmAiActions: settings?.ai?.confirmAiActions ?? true,
      autoMergeNotes: settings?.ai?.autoMergeNotes ?? true,
      preferredModel: settings?.ai?.preferredModel ?? "gemini-1.5-flash",
    },
  });

  useEffect(() => {
    if (settings?.ai) {
      form.reset({
        confirmAiActions: settings.ai.confirmAiActions ?? true,
        autoMergeNotes: settings.ai.autoMergeNotes ?? true,
        preferredModel: settings.ai.preferredModel ?? "gemini-1.5-flash",
      });
    }
  }, [settings?.ai, form]);

  async function onToggleConfirm(checked: boolean) {
    try {
      await updateAiSettings({ confirmAiActions: checked });
      toast.success(checked ? "Confirmation enabled" : "Confirmation disabled");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update AI settings");
    }
  }

  async function onToggleMerge(checked: boolean) {
    try {
      await updateAiSettings({ autoMergeNotes: checked });
      toast.success(checked ? "Smart merging enabled" : "Smart merging disabled");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update AI settings");
    }
  }

  async function onModelChange(value: string) {
    try {
      await updateAiSettings({ preferredModel: value });
      toast.success(`AI model set to ${value}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update AI settings");
    }
  }

  if (isSettingsLoading) {
    return <div className="space-y-4 animate-pulse">
      <div className="h-20 bg-muted rounded-lg" />
      <div className="h-20 bg-muted rounded-lg" />
    </div>;
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        {/* Confirm AI Actions */}
        <FormField
          control={form.control}
          name="confirmAiActions"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200 hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <FormLabel className="text-base font-semibold">
                    Confirm AI Actions
                  </FormLabel>
                  <FormDescription className="text-sm">
                    Always show a confirmation form before Zappy saves or updates data.
                  </FormDescription>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onToggleConfirm(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Auto Merge Notes */}
        <FormField
          control={form.control}
          name="autoMergeNotes"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200 hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <FormLabel className="text-base font-semibold">
                    Smart Merge Notes
                  </FormLabel>
                  <FormDescription className="text-sm">
                    Intelligently combine new information with existing notes instead of overwriting.
                  </FormDescription>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onToggleMerge(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* AI Model Selection */}
        <FormField
          control={form.control}
          name="preferredModel"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200 hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <FormLabel className="text-base font-semibold">
                    AI Intelligence Level
                  </FormLabel>
                  <FormDescription className="text-sm">
                    Choose the model power. "Pro" is smarter but might be slower.
                  </FormDescription>
                </div>
              </div>
              <div className="min-w-40">
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onModelChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-flash">Flash (Fast & Steady)</SelectItem>
                    <SelectItem value="gemini-1.5-pro">Pro (Advanced Reasoning)</SelectItem>
                    <SelectItem value="gemini-2.0-flash-exp">v2 Flash Exp (Experimental)</SelectItem>
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
