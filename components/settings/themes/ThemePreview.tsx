import { invertColor } from "@/lib/utils/colors";

interface ThemePreviewProps {
  colors: Record<string, string>;
}

export function ThemePreview({ colors }: ThemePreviewProps) {
  return (
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
}
