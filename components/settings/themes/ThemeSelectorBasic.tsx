import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  console.log("🚀 ~ ThemeSelector ~ theme:", theme);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Theme Preference</h2>

      <RadioGroup
        value={theme}
        onValueChange={(value) => setTheme(value)}
        className="grid grid-cols-3 gap-4"
      >
        <ThemeOption
          value="light"
          icon={<Sun className="h-5 w-5" />}
          label="Light"
          currentTheme={theme}
        />

        <ThemeOption
          value="dark"
          icon={<Moon className="h-5 w-5" />}
          label="Dark"
          currentTheme={theme}
        />

        <ThemeOption
          value="system"
          icon={<Monitor className="h-5 w-5" />}
          label="System"
          currentTheme={theme}
        />
      </RadioGroup>
    </div>
  );
}

function ThemeOption({
  value,
  icon,
  label,
  currentTheme,
}: {
  value: string;
  icon: React.ReactNode;
  label: string;
  currentTheme?: string;
}) {
  return (
    <Label
      htmlFor={value}
      className={`cursor-pointer ${
        currentTheme === value ? "ring-2 ring-primary" : "hover:bg-accent"
      } rounded-lg transition-all`}
    >
      <Card className="relative p-2 h-full flex flex-col items-center text-center space-y-2">
        <RadioGroupItem value={value} id={value} className="sr-only" />
        <div className="mb-2 p-2 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
        <div className="font-medium">{label}</div>

        {currentTheme === value && (
          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        )}
      </Card>
    </Label>
  );
}
