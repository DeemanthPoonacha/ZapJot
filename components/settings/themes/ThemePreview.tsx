import { invertColor } from "@/lib/utils/colors";

interface ThemePreviewProps {
  colors: Record<string, string>;
}

export function ThemePreview({ colors }: ThemePreviewProps) {
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
            background: gradientStyle,
            color: invertColor(colors.primary),
          }}
        >
          Gradient
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
        className="mt-3 pt-2 border-t"
        style={{ borderColor: colors.border }}
      >
        <div
          className="w-full h-3.5 rounded-full border shadow-xs"
          style={{
            background: gradientStyle,
            borderColor: colors.border,
          }}
        />
        <span className="block text-[10px] text-center mt-1 font-semibold uppercase tracking-wider opacity-60">
          Theme Gradient Accent
        </span>
      </div>
    </div>
  );
}
