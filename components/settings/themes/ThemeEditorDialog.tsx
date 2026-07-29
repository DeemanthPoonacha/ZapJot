import { useEffect, useState } from "react";
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
import { ThemePreviewCard } from "./ThemePreviewCard";
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

  // Active gradient tab
  const [activeGradTab, setActiveGradTab] = useState<
    "primary" | "ambient" | "card"
  >("primary");

  // Primary gradient state
  const [isCustomPrimary, setIsCustomPrimary] = useState(false);
  const [gradStart, setGradStart] = useState<string>("#1E293B");
  const [gradEnd, setGradEnd] = useState<string>("#F1F5F9");
  const [gradAngle, setGradAngle] = useState<string>("135deg");

  // Ambient gradient state
  const [isCustomAmbient, setIsCustomAmbient] = useState(false);
  const [ambStart, setAmbStart] = useState<string>("#F1F5F9");
  const [ambEnd, setAmbEnd] = useState<string>("#F1F5F9");
  const [ambAngle, setAmbAngle] = useState<string>("135deg");

  // Card gradient state
  const [isCustomCard, setIsCustomCard] = useState(false);
  const [cardStart, setCardStart] = useState<string>("#FFFFFF");
  const [cardEnd, setCardEnd] = useState<string>("#F1F5F9");
  const [cardAngle, setCardAngle] = useState<string>("180deg");

  const defaultValues = {
    name: "",
    colors: colorProperties.reduce(
      (obj, prop) => ({ ...obj, [prop.id]: prop.hexColor }),
      {},
    ),
  };

  const form = useForm<ThemeCreate>({
    resolver: zodResolver(createThemeSchema),
    defaultValues: editingTheme || defaultValues,
  });

  useEffect(() => {
    if (editingTheme) {
      form.reset(editingTheme);

      // Primary gradient
      if (editingTheme.colors.gradient) {
        setIsCustomPrimary(true);
        const match = editingTheme.colors.gradient.match(
          /linear-gradient\((\d+deg),\s*(#[A-Fa-f0-9]{3,6}),\s*(#[A-Fa-f0-9]{3,6})\)/,
        );
        if (match) {
          setGradAngle(match[1]);
          setGradStart(match[2]);
          setGradEnd(match[3]);
        } else {
          setGradStart(editingTheme.colors.primary || "#1E293B");
          setGradEnd(editingTheme.colors.accent || "#F1F5F9");
        }
      } else {
        setIsCustomPrimary(false);
        setGradStart(editingTheme.colors.primary || "#1E293B");
        setGradEnd(editingTheme.colors.accent || "#F1F5F9");
      }

      // Ambient gradient
      if (editingTheme.colors.ambientGradient) {
        setIsCustomAmbient(true);
        const match = editingTheme.colors.ambientGradient.match(
          /linear-gradient\((\d+deg),\s*(#[A-Fa-f0-9]{3,6}),\s*(#[A-Fa-f0-9]{3,6})\)/,
        );
        if (match) {
          setAmbAngle(match[1]);
          setAmbStart(match[2]);
          setAmbEnd(match[3]);
        }
      } else {
        setIsCustomAmbient(false);
      }

      // Card gradient
      if (editingTheme.colors.cardGradient) {
        setIsCustomCard(true);
        const match = editingTheme.colors.cardGradient.match(
          /linear-gradient\((\d+deg),\s*(#[A-Fa-f0-9]{3,6}),\s*(#[A-Fa-f0-9]{3,6})\)/,
        );
        if (match) {
          setCardAngle(match[1]);
          setCardStart(match[2]);
          setCardEnd(match[3]);
        }
      } else {
        setIsCustomCard(false);
      }
    } else {
      form.reset(defaultValues);
      setIsCustomPrimary(false);
      setIsCustomAmbient(false);
      setIsCustomCard(false);
      setGradStart("#1E293B");
      setGradEnd("#F1F5F9");
      setGradAngle("135deg");
    }
  }, [editingTheme, form]);

  const onSubmit = async (values: z.infer<typeof createThemeSchema>) => {
    const primary = values.colors.primary || "#1E293B";
    const accent = values.colors.accent || "#F1F5F9";
    const secondary = values.colors.secondary || "#F1F5F9";
    const background = values.colors.background || "#FFFFFF";

    const finalPrimary = isCustomPrimary
      ? `linear-gradient(${gradAngle}, ${gradStart}, ${gradEnd})`
      : `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`;

    const finalAmbient = isCustomAmbient
      ? `linear-gradient(${ambAngle}, ${ambStart}, ${ambEnd})`
      : `linear-gradient(135deg, color-mix(in srgb, ${accent} 70%, transparent), ${background}, color-mix(in srgb, ${secondary} 50%, transparent))`;

    const finalCard = isCustomCard
      ? `linear-gradient(${cardAngle}, ${cardStart}, ${cardEnd})`
      : `linear-gradient(180deg, ${background} 0%, color-mix(in srgb, ${accent} 15%, ${background}) 100%)`;

    const themePayload = {
      ...values,
      colors: {
        ...values.colors,
        gradient: finalPrimary,
        ambientGradient: finalAmbient,
        cardGradient: finalCard,
      },
      type: "custom" as const,
    };

    if (editingTheme) {
      const updatedTheme = await updateTheme({
        themeId: editingTheme.id,
        theme: themePayload,
      });
      onFinish(updatedTheme.id);
    } else {
      const newTheme = await addTheme(themePayload);
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

  const directions = [
    { label: "135° ↘", value: "135deg" },
    { label: "90° ➔", value: "90deg" },
    { label: "180° ⬇", value: "180deg" },
    { label: "45° ↗", value: "45deg" },
  ];

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
              <h3 className="text-lg font-medium mb-2">Base Colors</h3>
              <div className="grid gap-4">
                {colorProperties.map(
                  (prop) =>
                    !prop.name.toLowerCase().includes("gradient") && (
                      <FormField
                        key={prop.id}
                        control={form.control}
                        name={`colors.${prop.id}` as ThemeColors}
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right font-medium">
                              {prop.name}
                            </FormLabel>
                            <div className="col-span-2 flex gap-2 items-center">
                              <FormControl>
                                <Input
                                  type="color"
                                  value={
                                    field.value &&
                                    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(
                                      field.value,
                                    )
                                      ? field.value
                                      : "#000000"
                                  }
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    if (!isCustomPrimary) {
                                      if (prop.id === "primary")
                                        setGradStart(e.target.value);
                                      if (prop.id === "accent")
                                        setGradEnd(e.target.value);
                                    }
                                  }}
                                  className="w-12 h-8 p-1 cursor-pointer rounded-md shrink-0"
                                />
                              </FormControl>
                              <FormControl>
                                <Input
                                  type="text"
                                  {...field}
                                  value={field.value || ""}
                                  className="flex-1 text-xs font-mono"
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="col-span-3" />
                          </FormItem>
                        )}
                      />
                    ),
                )}
              </div>
            </div>

            {/* Multi-Gradient Visual Pickers Section */}
            <div className="my-4 pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Gradient Editors</h3>
                <span className="text-xs text-muted-foreground">
                  Visual Color Pickers
                </span>
              </div>

              {/* Gradient Target Selector Tabs */}
              <div className="flex rounded-md bg-muted p-1 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveGradTab("primary")}
                  className={`flex-1 py-1 px-2 rounded-sm font-medium transition-all ${
                    activeGradTab === "primary"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Primary
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGradTab("ambient")}
                  className={`flex-1 py-1 px-2 rounded-sm font-medium transition-all ${
                    activeGradTab === "ambient"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Ambient
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGradTab("card")}
                  className={`flex-1 py-1 px-2 rounded-sm font-medium transition-all ${
                    activeGradTab === "card"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Card
                </button>
              </div>

              {/* Tab 1: Primary Gradient */}
              {activeGradTab === "primary" && (
                <div className="p-3 bg-muted/40 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      Primary Gradient
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => setIsCustomPrimary(!isCustomPrimary)}
                    >
                      {isCustomPrimary ? "Reset to Auto" : "Customize"}
                    </Button>
                  </div>

                  {isCustomPrimary && (
                    <div className="space-y-3 pt-1">
                      <div
                        className="h-8 w-full rounded-md border shadow-xs flex items-center justify-center text-xs font-medium text-white drop-shadow-sm"
                        style={{
                          background: `linear-gradient(${gradAngle}, ${gradStart}, ${gradEnd})`,
                        }}
                      >
                        Primary Preview
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-muted-foreground">
                            From
                          </label>
                          <div className="flex gap-1.5 items-center">
                            <Input
                              type="color"
                              value={gradStart}
                              onChange={(e) => setGradStart(e.target.value)}
                              className="w-8 h-7 p-0.5 cursor-pointer rounded-md shrink-0"
                            />
                            <Input
                              type="text"
                              value={gradStart}
                              onChange={(e) => setGradStart(e.target.value)}
                              className="flex-1 text-xs font-mono h-7 px-2"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-muted-foreground">
                            To
                          </label>
                          <div className="flex gap-1.5 items-center">
                            <Input
                              type="color"
                              value={gradEnd}
                              onChange={(e) => setGradEnd(e.target.value)}
                              className="w-8 h-7 p-0.5 cursor-pointer rounded-md shrink-0"
                            />
                            <Input
                              type="text"
                              value={gradEnd}
                              onChange={(e) => setGradEnd(e.target.value)}
                              className="flex-1 text-xs font-mono h-7 px-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {directions.map((d) => (
                          <Button
                            key={d.value}
                            type="button"
                            variant={
                              gradAngle === d.value ? "default" : "outline"
                            }
                            size="sm"
                            className="text-[11px] h-6 px-1"
                            onClick={() => setGradAngle(d.value)}
                          >
                            {d.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Ambient Gradient */}
              {activeGradTab === "ambient" && (
                <div className="p-3 bg-muted/40 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      Ambient Glow Gradient
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => setIsCustomAmbient(!isCustomAmbient)}
                    >
                      {isCustomAmbient ? "Reset to Auto" : "Customize"}
                    </Button>
                  </div>

                  {isCustomAmbient && (
                    <div className="space-y-3 pt-1">
                      <div
                        className="h-8 w-full rounded-md border shadow-xs flex items-center justify-center text-xs font-medium text-foreground drop-shadow-sm"
                        style={{
                          background: `linear-gradient(${ambAngle}, ${ambStart}, ${ambEnd})`,
                        }}
                      >
                        Ambient Preview
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-muted-foreground">
                            From
                          </label>
                          <div className="flex gap-1.5 items-center">
                            <Input
                              type="color"
                              value={ambStart}
                              onChange={(e) => setAmbStart(e.target.value)}
                              className="w-8 h-7 p-0.5 cursor-pointer rounded-md shrink-0"
                            />
                            <Input
                              type="text"
                              value={ambStart}
                              onChange={(e) => setAmbStart(e.target.value)}
                              className="flex-1 text-xs font-mono h-7 px-2"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-muted-foreground">
                            To
                          </label>
                          <div className="flex gap-1.5 items-center">
                            <Input
                              type="color"
                              value={ambEnd}
                              onChange={(e) => setAmbEnd(e.target.value)}
                              className="w-8 h-7 p-0.5 cursor-pointer rounded-md shrink-0"
                            />
                            <Input
                              type="text"
                              value={ambEnd}
                              onChange={(e) => setAmbEnd(e.target.value)}
                              className="flex-1 text-xs font-mono h-7 px-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {directions.map((d) => (
                          <Button
                            key={d.value}
                            type="button"
                            variant={
                              ambAngle === d.value ? "default" : "outline"
                            }
                            size="sm"
                            className="text-[11px] h-6 px-1"
                            onClick={() => setAmbAngle(d.value)}
                          >
                            {d.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Card Gradient */}
              {activeGradTab === "card" && (
                <div className="p-3 bg-muted/40 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      Card Sheen Gradient
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => setIsCustomCard(!isCustomCard)}
                    >
                      {isCustomCard ? "Reset to Auto" : "Customize"}
                    </Button>
                  </div>

                  {isCustomCard && (
                    <div className="space-y-3 pt-1">
                      <div
                        className="h-8 w-full rounded-md border shadow-xs flex items-center justify-center text-xs font-medium text-foreground drop-shadow-sm"
                        style={{
                          background: `linear-gradient(${cardAngle}, ${cardStart}, ${cardEnd})`,
                        }}
                      >
                        Card Sheen Preview
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-muted-foreground">
                            From
                          </label>
                          <div className="flex gap-1.5 items-center">
                            <Input
                              type="color"
                              value={cardStart}
                              onChange={(e) => setCardStart(e.target.value)}
                              className="w-8 h-7 p-0.5 cursor-pointer rounded-md shrink-0"
                            />
                            <Input
                              type="text"
                              value={cardStart}
                              onChange={(e) => setCardStart(e.target.value)}
                              className="flex-1 text-xs font-mono h-7 px-2"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-muted-foreground">
                            To
                          </label>
                          <div className="flex gap-1.5 items-center">
                            <Input
                              type="color"
                              value={cardEnd}
                              onChange={(e) => setCardEnd(e.target.value)}
                              className="w-8 h-7 p-0.5 cursor-pointer rounded-md shrink-0"
                            />
                            <Input
                              type="text"
                              value={cardEnd}
                              onChange={(e) => setCardEnd(e.target.value)}
                              className="flex-1 text-xs font-mono h-7 px-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {directions.map((d) => (
                          <Button
                            key={d.value}
                            type="button"
                            variant={
                              cardAngle === d.value ? "default" : "outline"
                            }
                            size="sm"
                            className="text-[11px] h-6 px-1"
                            onClick={() => setCardAngle(d.value)}
                          >
                            {d.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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

                <ThemePreviewCard
                  colors={{
                    ...form.watch("colors"),
                    gradient: isCustomPrimary
                      ? `linear-gradient(${gradAngle}, ${gradStart}, ${gradEnd})`
                      : `linear-gradient(135deg, ${
                          form.watch("colors.primary") || "#1E293B"
                        }, ${form.watch("colors.accent") || "#F1F5F9"})`,
                  }}
                />
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
