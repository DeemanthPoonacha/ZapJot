"use client";
import { useSettings } from "@/lib/hooks/useSettings";
import { useEffect, useRef } from "react";

const hexToRgb = (hex: string) => {
  const parsedHex = hex.replace("#", "");
  const bigint = parseInt(parsedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

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

const hslToRgb = (h: number, s: number, l: number) => {
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

export default function ThemedCanvasImage({
  src,
  width,
  height,
  alt,
  color,
}: {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme, allThemes } = useSettings();

  const activeTheme = allThemes.find((t) => t.id === currentTheme);
  const primaryHex = color || activeTheme?.colors?.primary || "#000000";
  const { r: targetR, g: targetG, b: targetB } = hexToRgb(primaryHex);
  const targetHSL = rgbToHsl(targetR, targetG, targetB);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.alt = alt || "";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const { l } = rgbToHsl(r, g, b); // Get grayscale lightness
        const {
          r: newR,
          g: newG,
          b: newB,
        } = hslToRgb(targetHSL.h, targetHSL.s, l);

        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
        // Alpha remains unchanged
      }

      ctx.putImageData(imageData, 0, 0);
    };
  }, [src, targetHSL]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
