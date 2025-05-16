import { Theme } from "@/types/themes";

// Helper function to convert hex to HSL format for CSS variables

export function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find min and max values of R, G, B
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate luminance
  let l = (max + min) / 2;

  // If max and min are the same, it's a shade of gray
  if (max === min) {
    return `0 0% ${Math.round(l * 100)}%`;
  }

  // Calculate saturation
  let s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

  // Calculate hue
  let h = 0;
  if (max === r) {
    h = ((g - b) / (max - min)) % 6;
  } else if (max === g) {
    h = (b - r) / (max - min) + 2;
  } else {
    h = (r - g) / (max - min) + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}
// Invert a color for contrast

export function invertColor(hex: string): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Determine if color is light or dark
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return white for dark colors, black for light colors
  return brightness < 128 ? "#FFFFFF" : "#000000";
}
// Adjust brightness of a color

export function adjustBrightness(hex: string, factor: number): string {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  if (factor < 1) {
    // darken
    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);
  } else {
    // lighten
    r = Math.min(255, Math.floor(r + (255 - r) * (factor - 1)));
    g = Math.min(255, Math.floor(g + (255 - g) * (factor - 1)));
    b = Math.min(255, Math.floor(b + (255 - b) * (factor - 1)));
  }

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export const addCustomCssVariables = (themeObj: Theme) => {
  let styleEl = document.getElementById(`theme-${themeObj.id}`);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = `theme-${themeObj.id}`;
    document.head.appendChild(styleEl);
  }

  const cssVariables = `
      [data-theme="${themeObj.id}"],
      .${themeObj.id} {
        --background: hsl(${hexToHSL(themeObj.colors.background)});
        --foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --primary: hsl(${hexToHSL(themeObj.colors.primary)});
        --primary-foreground: hsl(${hexToHSL(
          invertColor(themeObj.colors.primary)
        )});
        --secondary: hsl(${hexToHSL(themeObj.colors.secondary)});
        --secondary-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --accent: hsl(${hexToHSL(themeObj.colors.accent)});
        --accent-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --muted: hsl(${hexToHSL(themeObj.colors.muted)});
        --muted-foreground: hsl(${hexToHSL(
          adjustBrightness(themeObj.colors.foreground, 0.6)
        )});
        --border: hsl(${hexToHSL(themeObj.colors.border)});
        --input: hsl(${hexToHSL(themeObj.colors.border)});
        --card: hsl(${hexToHSL(themeObj.colors.background)});
        --card-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --popover: hsl(${hexToHSL(themeObj.colors.background)});
        --popover-foreground: hsl(${hexToHSL(themeObj.colors.foreground)});
        --ring: hsl(${hexToHSL(themeObj.colors.primary)});
      }
    `;
  styleEl.textContent = cssVariables;
};

export function removeCustomCssVariables(deletedThemeId: string) {
  const styleEl = document.getElementById(`theme-${deletedThemeId}`);
  if (styleEl) {
    document.head.removeChild(styleEl);
  }
}

export const hexToRgb = (hex: string) => {
  const parsedHex = hex.replace("#", "");
  const bigint = parseInt(parsedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h, s, l };
};

export const hslToRgb = (h: number, s: number, l: number) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};
