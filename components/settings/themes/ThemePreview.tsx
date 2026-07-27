import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ListCard,
  ListCardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatChip } from "@/components/home/home-header";
import {
  Calendar1,
  CalendarDays,
  ListChecks,
  Target,
  Send,
  CheckCircle2,
  Camera,
  FileEdit,
  Star,
} from "lucide-react";
import { getThemeCssVariables } from "@/lib/utils/colors";
import { Theme } from "@/types/themes";
import { Checkbox } from "@/components/ui/checkbox";

interface ThemePreviewProps {
  colors?: Theme["colors"] | Record<string, string>;
}

export function ThemePreview({ colors }: ThemePreviewProps) {
  // Extract CSS variables using the centralized helper from colors.ts
  const cssVars = getThemeCssVariables(colors);

  const primary = cssVars["--primary"];
  const contrastPrimaryText = cssVars["--primary-foreground"];
  const secondary = cssVars["--secondary"];
  const contrastSecondaryText = cssVars["--secondary-foreground"];
  const accent = cssVars["--accent"];
  const contrastAccentText = cssVars["--accent-foreground"];
  const background = cssVars["--background"];
  const foreground = cssVars["--foreground"];
  const border = cssVars["--border"];
  const muted = cssVars["--muted"];
  const mutedForeground = cssVars["--muted-foreground"];

  const gradientStyle = cssVars["--primary-gradient"];
  const ambientStyle = cssVars["--ambient-gradient"];
  const cardGradientStyle = cssVars["--card-gradient"];

  // Complete CSS Variable Scope for all child components
  const styleScope: React.CSSProperties = {
    ...cssVars,
    backgroundColor: background,
    color: foreground,
    borderColor: border,
  } as React.CSSProperties;

  return (
    <Tabs
      tabValues={["components", "colors"]}
      defaultValue="components"
      className="w-full"
    >
      <TabsList className="mb-4">
        <TabsTrigger value="components">Components Preview</TabsTrigger>
        <TabsTrigger value="colors">Color Palette</TabsTrigger>
      </TabsList>

      <TabsContent value="components" className="space-y-6">
        <div
          className="rounded-2xl p-4 sm:p-6 border shadow-xs space-y-5 overflow-hidden"
          style={styleScope}
        >
          {/* 1. Header Banner (HomeHeader) */}
          <div
            className="relative overflow-hidden p-6 sm:p-7 rounded-2xl shadow-md space-y-4 text-white"
            style={{
              background: gradientStyle,
              color: contrastPrimaryText,
            }}
          >
            <div className="flex items-start justify-between gap-4 z-10 relative">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif italic font-medium tracking-tight">
                  Good morning, Creator!
                </h1>
                <p className="text-sm opacity-90 mt-1">
                  Here&apos;s your daily overview at a glance.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 z-10 relative">
              <StatChip
                icon={<ListChecks className="h-3.5 w-3.5" />}
                count={12}
                loading={false}
                label="task"
              />
              <StatChip
                icon={<Target className="h-3.5 w-3.5" />}
                count={8}
                loading={false}
                label="goal"
              />
              <StatChip
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                count={2}
                loading={false}
                label="event"
              />
            </div>
          </div>

          {/* 2. Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="p-4 text-center flex flex-col items-center justify-center gap-2.5 rounded-xl border shadow-xs transition"
              style={{
                backgroundColor: background,
                backgroundImage: cardGradientStyle,
                borderColor: border,
              }}
            >
              <span
                className="inline-flex items-center justify-center rounded-full p-2.5"
                style={{
                  backgroundColor: `color-mix(in srgb, ${primary} 15%, transparent)`,
                  color: primary,
                }}
              >
                <Camera className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold">Capture Quick Media</span>
            </div>

            <div
              className="p-4 text-center flex flex-col items-center justify-center gap-2.5 rounded-xl border shadow-xs transition"
              style={{
                backgroundColor: background,
                backgroundImage: cardGradientStyle,
                borderColor: border,
              }}
            >
              <span
                className="inline-flex items-center justify-center rounded-full p-2.5"
                style={{
                  backgroundColor: `color-mix(in srgb, ${primary} 15%, transparent)`,
                  color: primary,
                }}
              >
                <FileEdit className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold">New Journal Entry</span>
            </div>
          </div>

          {/* 3. Today's Focus Quote Card */}
          <div
            className="relative overflow-hidden p-5 sm:p-6 border shadow-xs items-center text-center space-y-1.5 rounded-xl"
            style={{
              background: ambientStyle,
              borderColor: border,
            }}
          >
            <span
              aria-hidden
              className="absolute -top-2 left-4 font-serif text-5xl opacity-15 select-none"
            >
              &ldquo;
            </span>
            <h3 className="relative text-base sm:text-lg font-serif italic font-medium max-w-[480px] mx-auto leading-snug">
              The secret of getting ahead is getting started.
            </h3>
            <p className="text-[10px] uppercase tracking-widest opacity-75 pt-1">
              — Mark Twain
            </p>
          </div>

          {/* 4. Form Controls & Quick Jot Down */}
          <Card
            className="p-4 sm:p-5 space-y-4 border rounded-xl"
            style={{
              backgroundColor: background,
              borderColor: border,
            }}
          >
            <div className="space-y-2">
              <h4 className="font-bold text-xs">Quick Jot Down</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Jot down a quick thought..."
                  className="text-xs rounded-xl"
                  style={{
                    backgroundColor: background,
                    borderColor: border,
                    color: foreground,
                  }}
                />
                <Button
                  size="sm"
                  className="gap-1.5 text-xs font-bold rounded-xl shadow-xs shrink-0"
                  style={{
                    background: gradientStyle,
                    color: contrastPrimaryText,
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit
                </Button>
              </div>
            </div>

            <div
              className="pt-2 border-t space-y-2"
              style={{ borderColor: border }}
            >
              <h4 className="text-xs font-bold">Button Variants</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="text-xs font-bold"
                  style={{
                    backgroundColor: primary,
                    color: contrastPrimaryText,
                  }}
                >
                  Primary
                </Button>

                <Button
                  size="sm"
                  className="text-xs font-bold"
                  style={{
                    backgroundColor: secondary,
                    color: contrastSecondaryText,
                  }}
                >
                  Secondary
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-bold"
                  style={{
                    borderColor: border,
                    color: foreground,
                    backgroundColor: "transparent",
                  }}
                >
                  Outline
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs font-bold"
                  style={{
                    color: foreground,
                    backgroundColor: "transparent",
                  }}
                >
                  Ghost
                </Button>
              </div>
            </div>
          </Card>

          {/* List Card Example */}
          <ListCard>
            <CardContent className="px-4 py-2 gap-1">
              <div className="w-full flex justify-between items-center space-x-2">
                <span className="flex items-center space-x-2">
                  <Checkbox className="cursor-pointer" />

                  <label
                    htmlFor={"-checkbox"}
                    className={
                      "font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer max-w-72 line-clamp-2"
                    }
                  >
                    Task Title
                  </label>
                </span>
                <span className="flex gap-2 items-center">
                  <Star
                    className="w-5 h-5"
                    fill="currentColor"
                    style={{ color: primary }}
                  />
                </span>
              </div>
              <div className="ml-6 mt-2 space-y-2">
                <div key={"subtask.id"} className="flex items-center space-x-2">
                  <Checkbox className="cursor-pointer" />

                  <label
                    className={
                      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer max-w-72 line-clamp-2 text-sm"
                    }
                  >
                    Subtask
                  </label>
                </div>
              </div>
            </CardContent>
            <ListCardFooter>
              <div className="flex items-center justify-between w-full line-clamp-1 gap-2">
                <span
                  className="text-xs text-muted-foreground line-clamp-1"
                  style={{ color: mutedForeground }}
                >
                  This is a description
                </span>
                <span
                  className="text-xs text-muted-foreground flex gap-1 items-center line-clamp-1"
                  style={{ color: mutedForeground }}
                >
                  <Calendar1 className="h-4 w-4" />
                  Due:
                  <span className="font-medium flex gap-1 items-center truncate">
                    {"27th Dec, 2026"}
                  </span>
                </span>
              </div>
            </ListCardFooter>
          </ListCard>
        </div>
      </TabsContent>

      <TabsContent value="colors" className="space-y-6 px-0 rounded-lg">
        <div
          className="grid grid-cols-2 md:grid-cols-2 gap-3.5 p-4 rounded-2xl border"
          style={styleScope}
        >
          {[
            { name: "primary", label: "Primary", colorVal: primary },
            { name: "accent", label: "Accent", colorVal: accent },
            { name: "background", label: "Background", colorVal: background },
            { name: "foreground", label: "Foreground", colorVal: foreground },
            { name: "secondary", label: "Secondary", colorVal: secondary },
            { name: "muted", label: "Muted", colorVal: muted },
            { name: "border", label: "Border", colorVal: border },
            {
              name: "gradient",
              label: "Primary Gradient",
              colorVal: gradientStyle,
            },
            { name: "ambient", label: "Ambient Glow", colorVal: ambientStyle },
            {
              name: "cardGradient",
              label: "Card Sheen",
              colorVal: cardGradientStyle,
            },
          ].map((item) => {
            const rawHex =
              colors && (colors as Record<string, string>)[item.name];
            return (
              <Card
                key={item.name}
                className="p-3 border rounded-xl flex flex-col justify-between"
                style={{
                  backgroundColor: background,
                  borderColor: border,
                  color: foreground,
                }}
              >
                <div
                  className="w-full h-14 mb-2 rounded-lg border shadow-xs"
                  style={{
                    background: item.colorVal,
                    borderColor: border,
                  }}
                />
                <div>
                  <p className="font-bold text-xs">{item.label}</p>
                  <p className="text-[10px] font-mono opacity-70 truncate mt-0.5">
                    {rawHex || item.name}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
