"use client";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "next-themes";

const fonts = [
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "poppins", label: "Poppins" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(16);

  return (
    <main className="container pb-20 pt-4 max-w-md mx-auto">
      <PageHeader title="Settings" />
      <div className="space-y-6 p-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Theme</h2>
          <RadioGroup
            defaultValue={theme}
            onValueChange={(value) => setTheme(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Font</h2>
          <RadioGroup defaultValue="inter">
            {fonts.map((font) => (
              <div key={font.value} className="flex items-center space-x-2">
                <RadioGroupItem value={font.value} id={font.value} />
                <Label htmlFor={font.value}>{font.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Font Size</h2>
          <div className="space-y-4">
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={12}
              max={24}
              step={1}
            />
            <div className="text-sm text-muted-foreground text-center">
              {fontSize}px
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
