"use client";

import { useEffect } from "react";
import { useUserSettings } from "@/hooks/use-user-settings";

function applyAppearance(mode: "system" | "light" | "dark") {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "system" ? (systemDark ? "dark" : "light") : mode;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
}

export function ThemeSync() {
  const { settings } = useUserSettings();

  useEffect(() => {
    applyAppearance(settings.appearance);

    if (settings.appearance !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyAppearance("system");
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [settings.appearance]);

  return null;
}
