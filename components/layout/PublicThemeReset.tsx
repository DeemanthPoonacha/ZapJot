"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { DEFAULT_THEME } from "@/lib/constants";

export function PublicThemeReset() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme !== DEFAULT_THEME) {
      document.documentElement.className = "";
      setTheme(DEFAULT_THEME);
    }
  }, []);

  return null;
}
