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
import { AVAILABLE_MODELS } from "@/lib/services/firebase/ai";

const AiSettingsFormSchema = z.object({
  confirmAiActions: z.boolean().default(true),
  preferredModel: z.string().default(AVAILABLE_MODELS[0]),
});

type AiSettingsFormValues = z.infer<typeof AiSettingsFormSchema>;

export function AiSettings() {
  const { settings, updateAiSettings, isSettingsLoading } = useSettings();

  const form = useForm<AiSettingsFormValues>({
    resolver: zodResolver(AiSettingsFormSchema),
    defaultValues: {
      confirmAiActions: settings?.ai?.confirmAiActions ?? true,
      preferredModel: settings?.ai?.preferredModel ?? AVAILABLE_MODELS[0],
    },
  });

  useEffect(() => {
    if (settings?.ai) {
      form.reset({
        confirmAiActions: settings.ai.confirmAiActions ?? true,
        preferredModel: settings.ai.preferredModel ?? AVAILABLE_MODELS[0],
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
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-muted/60 rounded-xl" />
        <div className="h-24 bg-muted/60 rounded-xl" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-5">
        {/* Confirm AI Actions */}
        <FormField
          control={form.control}
          name="confirmAiActions"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base font-semibold cursor-pointer">
                      Confirm AI Actions
                    </FormLabel>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Safety
                    </span>
                  </div>
                  <FormDescription className="text-sm text-muted-foreground">
                    Always show a confirmation prompt before Zappy creates, edits, or deletes data.
                  </FormDescription>
                </div>
              </div>
              <FormControl className="ml-4 shrink-0">
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

        {/* AI Model Selection */}
        <FormField
          control={form.control}
          name="preferredModel"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md backdrop-blur-sm gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base font-semibold cursor-pointer">
                      AI Intelligence Level
                    </FormLabel>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary border border-primary/20">
                      Gemini
                    </span>
                  </div>
                  <FormDescription className="text-sm text-muted-foreground">
                    Select your preferred AI engine. "Pro" offers advanced reasoning while "Flash" optimizes for rapid responses.
                  </FormDescription>
                </div>
              </div>
              <div className="w-full sm:w-52 shrink-0">
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onModelChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-background/80 border-border/80 rounded-lg">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border/80 shadow-lg">
                    {AVAILABLE_MODELS.map((model) => (
                      <SelectItem key={model} value={model} className="rounded-lg py-2 cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {model
                              .replace("gemini-", "")
                              .replace("-preview", "")
                              .split("-")
                              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(" ")}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
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

