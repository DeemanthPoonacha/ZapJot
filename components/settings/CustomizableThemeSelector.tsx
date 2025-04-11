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
import { Edit3 } from "lucide-react";
import DeleteConfirm from "../ui/delete-confirm";

// Define the theme color properties
type ThemeColor = {
  id: string;
  name: string;
  defaultLight: string;
};

const colorProperties: ThemeColor[] = [
  { id: "background", name: "Background", defaultLight: "#FFFFFF" },
  { id: "foreground", name: "Foreground", defaultLight: "#0F1729" },
  { id: "primary", name: "Primary", defaultLight: "#1E293B" },
  { id: "secondary", name: "Secondary", defaultLight: "#F1F5F9" },
  { id: "accent", name: "Accent", defaultLight: "#F1F5F9" },
  { id: "muted", name: "Muted", defaultLight: "#F1F5F9" },
  { id: "border", name: "Border", defaultLight: "#E2E8F0" },
];

// Define the theme interface
type Theme = {
  id: string;
  name: string;
  colors: Record<string, string>;
  isCustom?: boolean;
};

// Default themes
const defaultThemes: Theme[] = [
  {
    id: "light",
    name: "Light",
    colors: {
      background: "#FFFFFF",
      foreground: "#0F1729",
      primary: "#1E293B",
      secondary: "#F1F5F9",
      accent: "#F1F5F9",
      muted: "#F1F5F9",
      border: "#E2E8F0",
    },
  },
  {
    id: "dark",
    name: "Dark",
    colors: {
      background: "#0F1729",
      foreground: "#F8FAFC",
      primary: "#F8FAFC",
      secondary: "#1E293B",
      accent: "#1E293B",
      muted: "#1E293B",
      border: "#334155",
    },
  },
  {
    id: "purple",
    name: "Purple",
    colors: {
      background: "#FAF5FF",
      foreground: "#2D1B4F",
      primary: "#7E22CE",
      secondary: "#F3E8FF",
      accent: "#F3E8FF",
      muted: "#F3E8FF",
      border: "#DDD6FE",
    },
  },
  {
    id: "green",
    name: "Green",
    colors: {
      background: "#F0FFF4",
      foreground: "#1C4532",
      primary: "#2F855A",
      secondary: "#DCFCE7",
      accent: "#DCFCE7",
      muted: "#DCFCE7",
      border: "#BBEFC2",
    },
  },
  {
    id: "rose",
    name: "Rose",
    colors: {
      background: "#FFF1F2",
      foreground: "#4C1D1D",
      primary: "#E11D48",
      secondary: "#FFE4E6",
      accent: "#FFE4E6",
      muted: "#FFE4E6",
      border: "#FECDD3",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      background: "#F0F9FF",
      foreground: "#082F49",
      primary: "#0EA5E9",
      secondary: "#E0F2FE",
      accent: "#E0F2FE",
      muted: "#E0F2FE",
      border: "#BAE6FD",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: {
      background: "#FFF7ED",
      foreground: "#431407",
      primary: "#EA580C",
      secondary: "#FFEDD5",
      accent: "#FFEDD5",
      muted: "#FFEDD5",
      border: "#FED7AA",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    colors: {
      background: "#0D1117",
      foreground: "#E6EDF3",
      primary: "#3B82F6",
      secondary: "#161B22",
      accent: "#1F2937",
      muted: "#1F2937",
      border: "#334155",
    },
  },
  {
    id: "crimson",
    name: "Crimson",
    colors: {
      background: "#1A0C0C",
      foreground: "#F5EAEA",
      primary: "#DC2626",
      secondary: "#2B1212",
      accent: "#3F1B1B",
      muted: "#3F1B1B",
      border: "#7F1D1D",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    colors: {
      background: "#0A0A0F",
      foreground: "#E5E7EB",
      primary: "#D946EF",
      secondary: "#1C1C2B",
      accent: "#06B6D4",
      muted: "#1C1C2B",
      border: "#4B5563",
    },
  },
];

// Create a schema for form validation
const formSchema = z.object({
  id: z.string().default(new Date().toISOString()),
  name: z.string().min(2, { message: "Label must be at least 2 characters" }),
  colors: z.object({
    background: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    foreground: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    muted: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
    border: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color",
    }),
  }),
});
type ThemeFormType = z.infer<typeof formSchema>;

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
    ) as Record<string, string>,
  };

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ThemeFormType>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
        isCustom: true,
      });
    } else {
      // Adding a new theme
      const newId = "custom-theme-" + Date.now().toString();
      createOrUpdateTheme({
        id: newId,
        name: values.name,
        colors: values.colors,
        isCustom: true,
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

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Themes</h2>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetFormAndCloseDialog();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline">Create New Theme</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditingId ? "Edit Theme" : "New Theme"}
              </DialogTitle>
              <DialogDescription>
                Choose colors for your new theme
              </DialogDescription>
            </DialogHeader>

            <Form key={isEditingId || "new"} {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                                <Input
                                  type="text"
                                  {...field}
                                  className="flex-1"
                                />
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
                  <Button type="submit">
                    {isEditingId ? "Save" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allThemes.map((themeOption) => {
          const { colors: preview } = themeOption;

          return (
            <div
              key={themeOption.id}
              className={`flex flex-col rounded-md border-2 ${
                theme === themeOption.id ? "border-primary" : "border-muted"
              } overflow-hidden`}
            >
              {/* Theme preview */}
              <div
                className="cursor-pointer"
                style={{
                  backgroundColor: preview.background,
                  color: preview.foreground,
                }}
                onClick={() => handleThemeChange(themeOption.id)}
              >
                {/* Header */}
                <div
                  className="p-3 font-medium text-center border-b flex justify-between items-center"
                  style={{ borderColor: preview.border }}
                >
                  <span>{themeOption.name}</span>
                  {themeOption.isCustom && (
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTheme(themeOption.id);
                        }}
                        className="text-xs"
                        style={{ backgroundColor: preview.primary }}
                      >
                        <Edit3
                          style={{ color: preview.background }}
                          className="w-4 h-4"
                        />
                      </Button>
                      <DeleteConfirm
                        itemName={"theme"}
                        buttonClassName={`bg-${preview.primary} text-${preview.foreground} text-xs`}
                        iconClassName={`text-red-400`}
                        handleDelete={(e) => {
                          e.stopPropagation();
                          handleDeleteTheme(themeOption.id);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Content preview */}
                <ThemePreview colors={preview} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
