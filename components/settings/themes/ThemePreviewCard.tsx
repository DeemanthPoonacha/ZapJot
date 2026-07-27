import { Card, ListCard } from "@/components/ui/card";
import { invertColor } from "@/lib/utils/colors";

interface ThemePreviewProps {
  colors: Record<string, string>;
}

export function ThemePreviewCard({ colors }: ThemePreviewProps) {
  const gradientStyle =
    colors.gradient ||
    `linear-gradient(135deg, ${colors.primary}, ${colors.accent || colors.secondary})`;

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          className="px-3 py-1 rounded-md text-xs font-medium shadow-xs"
          style={{
            backgroundColor: colors.primary,
            color: invertColor(colors.primary),
          }}
        >
          Primary
        </button>
        <button
          className="px-3 py-1 rounded-md text-xs font-medium shadow-xs"
          style={{
            backgroundColor: colors.secondary,
            color: colors.foreground,
          }}
        >
          Secondary
        </button>
        <button
          className="px-3 py-1 rounded-md text-xs font-medium shadow-xs"
          style={{
            background: colors.gradient,
            color: invertColor(colors.primary),
          }}
        >
          Gradient
        </button>

        <button
          className="px-3 py-1 rounded-md text-xs font-medium shadow-xs"
          style={{
            background: colors.ambientGradient,
            color: colors.foreground,
          }}
        >
          ambient
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Object.entries(colors).map(
          ([key, value]) =>
            key !== "cardGradient" && (
              <div key={key} className="flex flex-col items-center">
                <div
                  className="w-6 h-6 rounded-full border shadow-xs"
                  style={{
                    background: value || gradientStyle,
                    borderColor: colors.border,
                  }}
                />
                <span className="text-[11px] mt-1 opacity-80">{key}</span>
              </div>
            ),
        )}
      </div>

      {/* Theme Gradient Strip Banner */}
      <div
        className="mt-3 pt-2 border-t flex flex-col gap-1"
        style={{ borderColor: colors.border }}
      >
        <Card
          className="w-full p-2 border-none shadow-xl text-center"
          style={{
            background: gradientStyle,
            borderColor: colors.border,
            color: invertColor(colors.primary),
          }}
        >
          <span className="font-semibold text-xs">Primary Gradient</span>
        </Card>
        <ListCard
          className={`w-full p-2 cursor-pointer text-center`}
          style={{
            background: colors.ambientGradient,
            borderColor: colors.primary,
            color: colors.foreground,
          }}
        >
          <span className="font-semibold text-xs">List Card Gradient</span>
        </ListCard>
        <Card
          className="w-full p-2 text-center"
          style={{
            background: colors.cardGradient,
            borderColor: colors.border,
            color: colors.foreground,
          }}
        >
          <span className="font-semibold text-xs">Card Gradient</span>
        </Card>
      </div>
    </div>
  );
}
