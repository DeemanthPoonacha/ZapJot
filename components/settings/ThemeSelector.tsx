// components/ThemeSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";

// Define the themes with fixed color values for previews
const themes = [
  {
    name: "light",
    label: "Light",
    colors: [
      { name: "background", color: "#FFFFFF" },
      { name: "foreground", color: "#0F1729" },
      { name: "primary", color: "#1E293B" },
      { name: "secondary", color: "#F1F5F9" },
      { name: "accent", color: "#F1F5F9" },
      { name: "muted", color: "#F1F5F9" },
    ],
  },
  {
    name: "dark",
    label: "Dark",
    colors: [
      { name: "background", color: "#0F1729" },
      { name: "foreground", color: "#F8FAFC" },
      { name: "primary", color: "#F8FAFC" },
      { name: "secondary", color: "#1E293B" },
      { name: "accent", color: "#1E293B" },
      { name: "muted", color: "#1E293B" },
    ],
  },
  {
    name: "purple",
    label: "Purple",
    colors: [
      { name: "background", color: "#FAF5FF" },
      { name: "foreground", color: "#2D1B4F" },
      { name: "primary", color: "#7E22CE" },
      { name: "secondary", color: "#F3E8FF" },
      { name: "accent", color: "#F3E8FF" },
      { name: "muted", color: "#F3E8FF" },
    ],
  },
  {
    name: "green",
    label: "Green",
    colors: [
      { name: "background", color: "#F0FFF4" },
      { name: "foreground", color: "#1C4532" },
      { name: "primary", color: "#2F855A" },
      { name: "secondary", color: "#DCFCE7" },
      { name: "accent", color: "#DCFCE7" },
      { name: "muted", color: "#DCFCE7" },
    ],
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Theme Selector</h2>

      <RadioGroup
        value={theme}
        onValueChange={setTheme}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {themes.map((themeOption) => (
          <div key={themeOption.name} className="space-y-2">
            <RadioGroupItem
              value={themeOption.name}
              id={themeOption.name}
              className="peer sr-only"
            />
            <Label
              htmlFor={themeOption.name}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-lg font-medium mb-3">
                {themeOption.label}
              </span>
              <div className="grid grid-cols-3 gap-2 w-full">
                {themeOption.colors.map((color) => (
                  <div key={color.name} className="flex flex-col items-center">
                    <div
                      style={{ backgroundColor: color.color }}
                      className={`w-8 h-8 rounded-full border border-border`}
                    />
                    <span className="text-xs mt-1">{color.name}</span>
                  </div>
                ))}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

// app/page.tsx
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        Theme Customization
      </h1>

      <ThemeSelector />

      <Card>
        <CardHeader>
          <CardTitle>UI Preview</CardTitle>
          <CardDescription>
            See how components look with the selected theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">
              Background & Text
            </span>
            <div className="p-4 bg-background text-foreground border rounded-md">
              This is how text looks on the background
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>

          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-md bg-primary"></div>
            <div className="w-12 h-12 rounded-md bg-secondary"></div>
            <div className="w-12 h-12 rounded-md bg-accent"></div>
            <div className="w-12 h-12 rounded-md bg-muted"></div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            The theme affects all shadcn/ui components
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
