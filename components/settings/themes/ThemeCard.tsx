import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit3 } from "lucide-react";
import { Theme } from "@/types/themes";
import { ThemePreview } from "./ThemePreview";
import DeleteConfirm from "@/components/ui/delete-confirm";
import ThemedCanvasImage from "@/components/layout/themed-image";

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  onThemeSelect: (themeId: string) => void;
  onEditTheme: (themeId: string) => void;
  onDeleteTheme: (themeId: string) => void;
}

export function ThemeCard({
  theme,
  isActive,
  onThemeSelect,
  onEditTheme,
  onDeleteTheme,
}: ThemeCardProps) {
  const { colors } = theme;

  return (
    <Card
      className={`cursor-pointer flex flex-col rounded-xl border-2 transition-all duration-300 ${
        isActive
          ? "border-primary shadow-lg ring-2 ring-primary/30"
          : "border-muted/70 hover:border-primary/40"
      } overflow-hidden`}
      onClick={() => onThemeSelect(theme.id)}
      style={{
        backgroundColor: colors.background,
        backgroundImage: colors.cardGradient,
        color: colors.foreground,
      }}
    >
      {/* Header */}
      <div
        className="p-3 font-medium text-center border-b flex justify-between items-center"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center gap-2">
          <ThemedCanvasImage
            src="/greyed_out_logo_md.svg"
            width={42}
            height={44}
            alt="logo"
            color={colors.primary}
            className={"shadow-sm rounded-[18%]"}
          />
          <span className="font-bold text-sm">{theme.name}</span>
          {isActive && (
            <span
              className="ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Active
            </span>
          )}
        </div>
        {theme.type === "custom" && (
          <div className="flex gap-2">
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditTheme(theme.id);
              }}
              className="text-xs"
              style={{ backgroundColor: colors.primary }}
            >
              <Edit3 style={{ color: colors.background }} className="w-4 h-4" />
            </Button>
            <DeleteConfirm
              itemName={"theme"}
              buttonClassName={`bg-${colors.primary} text-${colors.foreground} text-xs`}
              iconClassName={`text-red-400`}
              handleDelete={(e) => {
                e.stopPropagation();
                onDeleteTheme(theme.id);
              }}
            />
          </div>
        )}
      </div>

      {/* Content preview */}
      <ThemePreview colors={colors} />
    </Card>
  );
}
