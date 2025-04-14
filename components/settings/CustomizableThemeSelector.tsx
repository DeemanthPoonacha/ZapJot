// components/CustomizableThemeSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { adjustBrightness, hexToHSL, invertColor } from "@/lib/utils";
import { Edit3, Plus } from "lucide-react";
import DeleteConfirm from "../ui/delete-confirm";
import { Theme, ThemeFormType, ThemeformSchema } from "@/types/themes";
import { defaultThemes, colorProperties } from "@/lib/constants";
import { Card } from "../ui/card";

export function CustomizableThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allThemes, setAllThemes] = useState<Theme[]>(defaultThemes);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  const defaultValues = {
    id: "",
    name: "",
    colors: colorProperties.reduce(
      (obj, prop) => ({ ...obj, [prop.id]: prop.defaultLight }),
      {}
    ),
  };

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ThemeFormType>({
    resolver: zodResolver(ThemeformSchema),
    defaultValues: defaultValues,
  });

  // Load saved custom themes from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedThemes = localStorage.getItem("customThemes");
      if (savedThemes) {
        try {
          const parsedCustomThemes = JSON.parse(savedThemes);
          setCustomThemes(parsedCustomThemes);
          setAllThemes([...defaultThemes, ...parsedCustomThemes]);
        } catch (e) {
          console.error("Failed to parse saved themes", e);
        }
      } else {
        setAllThemes(defaultThemes);
      }
    }
    setMounted(true);
  }, []);

  // Save custom themes to localStorage when they change
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("customThemes", JSON.stringify(customThemes));
    }
  }, [customThemes, mounted]);

  // Add custom CSS variables for themes
  useEffect(() => {
    if (mounted && customThemes.length > 0) {
      // Apply CSS variables for each custom theme
      customThemes.forEach((customTheme) => {
        addCustomCssVariables(customTheme);
      });
    }
  }, [mounted, customThemes]);

  const addCustomCssVariables = (themeObj: Theme) => {
    // Create a style element if it doesn't exist for this theme
    let styleEl = document.getElementById(`theme-${themeObj.id}`);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = `theme-${themeObj.id}`;
      document.head.appendChild(styleEl);
    }

    // Generate CSS variables for the theme
    const cssVariables = `
      [data-theme="${themeObj.id}"],
      .${themeObj.id} {
        --background: hsl(${hexToHSL(themeObj.colors.background)});
        --foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --primary: hsl(${hexToHSL(themeObj.colors.primary)});
        --primary-foreground: hsl(${hexToHSL(
          invertColor(themeObj.colors.primary)
        )});
        --secondary: hsl(${hexToHSL(themeObj.colors.secondary)});
        --secondary-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --accent: hsl(${hexToHSL(themeObj.colors.accent)});
        --accent-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --muted: hsl(${hexToHSL(themeObj.colors.muted)});
        --muted-foreground: hsl(${hexToHSL(
          adjustBrightness(themeObj.colors.foreground, 0.6)
        )});
        --border: hsl(${hexToHSL(themeObj.colors.border)});
        --input: hsl(${hexToHSL(themeObj.colors.border)});
        --card: hsl(${hexToHSL(themeObj.colors.background)});
        --card-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --popover: hsl(${hexToHSL(themeObj.colors.background)});
        --popover-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --ring: hsl(${hexToHSL(themeObj.colors.primary)});
      }
    `;
    styleEl.textContent = cssVariables;
  };

  const resetFormAndCloseDialog = () => {
    form.reset(defaultValues);
    setIsDialogOpen(false);
    setIsEditingId(null);
  };

  const onSubmit = (values: z.infer<typeof ThemeformSchema>) => {
    const createOrUpdateTheme = (theme: Theme) => {
      addCustomCssVariables(theme);

      const updatedCustomThemes = isEditingId
        ? customThemes.map((t) => (t.id === isEditingId ? theme : t))
        : [...customThemes, theme];

      setCustomThemes(updatedCustomThemes);
      setAllThemes([...defaultThemes, ...updatedCustomThemes]);
    };

    if (isEditingId) {
      // Editing an existing theme
      createOrUpdateTheme({
        id: isEditingId,
        name: values.name,
        colors: values.colors,
        type: "custom",
      });

      // Force a small delay before switching themes
      setTimeout(() => handleThemeChange(isEditingId), 50);
    } else {
      // Adding a new theme
      const newId = "custom-theme-" + Date.now().toString();
      createOrUpdateTheme({
        id: newId,
        name: values.name,
        colors: values.colors,
        type: "custom",
      });

      // Force a small delay before switching themes
      setTimeout(() => handleThemeChange(newId), 50);
    }

    resetFormAndCloseDialog();
  };

  const handleEditTheme = (themeId: string) => {
    const themeToEdit = allThemes.find((t) => t.id === themeId);
    if (themeToEdit) {
      setIsEditingId(themeId);
      form.reset(themeToEdit);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteTheme = (themeId: string) => {
    // Remove from custom themes
    const updatedCustomThemes = customThemes.filter((t) => t.id !== themeId);
    setCustomThemes(updatedCustomThemes);

    // Update all themes
    const updatedAllThemes = [...defaultThemes, ...updatedCustomThemes];
    setAllThemes(updatedAllThemes);

    // If we're deleting the active theme, switch to light
    if (theme === themeId) {
      setTheme("light");
    }

    // Remove the CSS style element for this theme
    const styleEl = document.getElementById(`theme-${themeId}`);
    if (styleEl) {
      document.head.removeChild(styleEl);
    }
  };

  const handleThemeChange = (themeName: string) => {
    // Clear all existing theme classes
    if (theme !== themeName) document.documentElement.className = "";

    // Set new theme
    setTheme(themeName);
  };

  if (!mounted) {
    return null;
  }

  type ThemeColors =
    | "colors.background"
    | "colors.foreground"
    | "colors.primary"
    | "colors.secondary"
    | "colors.accent"
    | "colors.muted"
    | "colors.border";

  const themeEditorDialog = (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetFormAndCloseDialog();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Create Custom Theme
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditingId ? "Edit Theme" : "New Theme"}</DialogTitle>
          <DialogDescription>
            Choose colors for your new theme
          </DialogDescription>
        </DialogHeader>

        <Form key={isEditingId || "new"} {...form}>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{isEditingId ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  const groupedThemes = Object.groupBy(allThemes, ({ type }) => type);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Themes</h2>

        {themeEditorDialog}
      </div>

      {Object.entries(groupedThemes).map(([key, themes]) => (
        <div className="mb-8" key={key}>
          <span className="flex items-center gap-2 mb-3 justify-between">
            {key.charAt(0).toUpperCase() + key.slice(1)} themes
            {key === "custom" && themeEditorDialog}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {themes?.map((themeOption) => {
              const { colors } = themeOption;

              return (
                <Card
                  key={themeOption.id}
                  className={`cursor-pointer flex flex-col rounded-md border-2 ${
                    theme === themeOption.id ? "border-primary" : "border-muted"
                  } overflow-hidden`}
                  onClick={() => handleThemeChange(themeOption.id)}
                  style={{
                    backgroundColor: colors.background,
                    color: colors.foreground,
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-3 font-medium text-center border-b flex justify-between items-center"
                    style={{ borderColor: colors.border }}
                  >
                    <span>{themeOption.name}</span>
                    {themeOption.type === "custom" && (
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTheme(themeOption.id);
                          }}
                          className="text-xs"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Edit3
                            style={{ color: colors.background }}
                            className="w-4 h-4"
                          />
                        </Button>
                        <DeleteConfirm
                          itemName={"theme"}
                          buttonClassName={`bg-${colors.primary} text-${colors.foreground} text-xs`}
                          iconClassName={`text-red-400`}
                          handleDelete={(e) => {
                            handleDeleteTheme(themeOption.id);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content preview */}
                  <ThemePreview colors={colors} />
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Theme preview component
const ThemePreview = ({ colors }: { colors: Record<string, string> }) => (
  <div className="p-4">
    <div className="flex space-x-2 mb-3">
      <button
        className="px-3 py-1 rounded-md text-xs"
        style={{
          backgroundColor: colors.primary,
          color: invertColor(colors.primary),
        }}
      >
        Primary
      </button>
      <button
        className="px-3 py-1 rounded-md text-xs"
        style={{
          backgroundColor: colors.secondary,
          color: colors.foreground,
        }}
      >
        Secondary
      </button>
    </div>

    <div className="grid grid-cols-3 gap-2">
      {Object.entries(colors).map(([key, value]) => (
        <div key={key} className="flex flex-col items-center">
          <div
            className="w-6 h-6 rounded-full border"
            style={{
              backgroundColor: value,
              borderColor: colors.border,
            }}
          />
          <span className="text-xs mt-1">{key}</span>
        </div>
      ))}
    </div>
  </div>
);
