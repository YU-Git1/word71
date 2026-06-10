"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { IndustryOption, UserSettings } from "@/types/word";

const SETTINGS_KEY = "pro-vocab-settings";

const defaultSettings: UserSettings = {
  preferredIndustry: "uiux",
  appearance: "system",
};

type UserSettingsContextValue = {
  settings: UserSettings;
  setPreferredIndustry: (preferredIndustry: IndustryOption) => void;
  setAppearance: (appearance: UserSettings["appearance"]) => void;
};

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null);

function readSettings() {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const raw = window.localStorage.getItem(SETTINGS_KEY);

  if (!raw) {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  try {
    return {
      ...defaultSettings,
      ...(JSON.parse(raw) as Partial<UserSettings>),
    };
  } catch {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
}

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => readSettings());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const value = useMemo<UserSettingsContextValue>(
    () => ({
      settings,
      setPreferredIndustry: (preferredIndustry) => {
        setSettings((current) => ({
          ...current,
          preferredIndustry,
        }));
      },
      setAppearance: (appearance) => {
        setSettings((current) => ({
          ...current,
          appearance,
        }));
      },
    }),
    [settings],
  );

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error("useUserSettings must be used within UserSettingsProvider.");
  }

  return context;
}
