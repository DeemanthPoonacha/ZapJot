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
      className={`cursor-pointer flex flex-col rounded-md border-2 ${
        isActive ? "border-primary" : "border-muted"
      } overflow-hidden`}
      onClick={() => onThemeSelect(theme.id)}
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
        <div className="flex items-center gap-2">
          <ThemedCanvasImage
            src="/greyed_out_logo_md.svg"
            width={42}
            height={44}
            alt="zapjot"
            color={colors.primary}
          />
          <span>{theme.name}</span>
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
