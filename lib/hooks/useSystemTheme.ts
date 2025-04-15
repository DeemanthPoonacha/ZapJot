import { useEffect, useState } from "react";

export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      setSystemTheme(matchMedia.matches ? "dark" : "light");
    };

    updateTheme(); // initial check
    matchMedia.addEventListener("change", updateTheme); // listen for changes

    return () => matchMedia.removeEventListener("change", updateTheme);
  }, []);

  return systemTheme;
}
