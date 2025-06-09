"use client";
import { useSettings } from "@/lib/hooks/useSettings";
import { hexToRgb, rgbToHsl, hslToRgb } from "@/lib/utils/colors";
import { useEffect, useRef } from "react";

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
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
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
