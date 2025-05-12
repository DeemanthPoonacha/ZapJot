import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createThemeSchema, ThemeCreate, Theme } from "@/types/themes";
import { colorProperties } from "@/lib/constants";
import { ThemePreview } from "./ThemePreview";
import { useCustomThemes } from "@/lib/hooks/useCustomThemes";

interface ThemeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (themeId: string) => void;
  editingTheme?: Theme;
}

export function ThemeFormDialog({
  isOpen,
  onClose,
  onFinish,
  editingTheme,
}: ThemeFormDialogProps) {
  const { addTheme, updateTheme } = useCustomThemes();
  const defaultValues = {
    name: "",
    colors: colorProperties.reduce(
      (obj, prop) => ({ ...obj, [prop.id]: prop.hexColor }),
      {}
    ),
  };

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ThemeCreate>({
    resolver: zodResolver(createThemeSchema),
    defaultValues: editingTheme || defaultValues,
  });

  // Reset form when editing changes
  useEffect(() => {
    if (editingTheme) {
      form.reset(editingTheme);
    } else {
      form.reset(defaultValues);
    }
  }, [editingTheme, form]);

  const onSubmit = async (values: z.infer<typeof createThemeSchema>) => {
    if (editingTheme) {
      // Editing an existing theme
      const updatedTheme = await updateTheme({
        themeId: editingTheme.id,
        theme: {
          ...values,
          type: "custom",
        },
      });
      onFinish(updatedTheme.id);
    } else {
      // Adding a new theme
      const newTheme = await addTheme({
        ...values,
        type: "custom",
      });
      onFinish(newTheme.id);
    }
  };

  type ThemeColors =
    | "colors.background"
    | "colors.foreground"
    | "colors.primary"
    | "colors.secondary"
    | "colors.accent"
    | "colors.muted"
    | "colors.border";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTheme ? "Edit Theme" : "New Theme"}</DialogTitle>
          <DialogDescription>
            Choose colors for your {editingTheme ? "existing" : "new"} theme
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Theme" {...field} />
                  </FormControl>
                  <FormDescription>
                    Name shown in the theme selector
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="my-4">
              <h3 className="text-lg font-medium mb-2">Theme Colors</h3>
              <div className="grid gap-4">
                {colorProperties.map((prop) => (
                  <FormField
                    key={prop.id}
                    control={form.control}
                    name={`colors.${prop.id}` as ThemeColors}
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-3 items-center gap-4">
                        <FormLabel className="text-right">
                          {prop.name}
                        </FormLabel>
                        <div className="col-span-2 flex gap-2 items-center">
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              className="w-12 h-8 p-1"
                            />
                          </FormControl>
                          <FormControl>
                            <Input type="text" {...field} className="flex-1" />
                          </FormControl>
                        </div>
                        <FormMessage className="col-span-3" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <div
                className="rounded-md overflow-hidden border"
                style={{
                  backgroundColor: form.watch("colors.background"),
                  color: form.watch("colors.foreground"),
                  borderColor: form.watch("colors.border"),
                }}
              >
                <div
                  className="p-3 font-medium text-center border-b"
                  style={{
                    borderColor: form.watch("colors.border"),
                  }}
                >
                  {form.watch("name") || "New Theme"}
                </div>

                <ThemePreview colors={form.watch("colors")} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{editingTheme ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
