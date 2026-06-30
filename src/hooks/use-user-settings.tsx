"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  readSettingsFromStorage,
  saveSettingsToStorage,
  storageKeys,
} from "@/lib/local-persistence";
import { IndustryOption, UserSettings } from "@/types/word";

const defaultSettings: UserSettings = {
  preferredIndustry: "uiux",
  appearance: "system",
  cardViewMode: "compact",
};

type UserSettingsState = {
  settings: UserSettings;
  lastSavedAt: string | null;
  recoveredFromBackup: boolean;
};

type UserSettingsAction =
  | { type: "set-industry"; preferredIndustry: IndustryOption }
  | { type: "set-appearance"; appearance: UserSettings["appearance"] }
  | { type: "set-card-view-mode"; cardViewMode: UserSettings["cardViewMode"] }
  | { type: "sync"; payload: UserSettingsState };

type UserSettingsContextValue = {
  settings: UserSettings;
  lastSavedAt: string | null;
  recoveredFromBackup: boolean;
  setPreferredIndustry: (preferredIndustry: IndustryOption) => void;
  setAppearance: (appearance: UserSettings["appearance"]) => void;
  setCardViewMode: (cardViewMode: UserSettings["cardViewMode"]) => void;
};

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null);

function createLocalSettingsState(settings: UserSettings): UserSettingsState {
  return {
    settings,
    lastSavedAt: new Date().toISOString(),
    recoveredFromBackup: false,
  };
}

function userSettingsReducer(
  state: UserSettingsState,
  action: UserSettingsAction,
): UserSettingsState {
  if (action.type === "sync") {
    return action.payload;
  }

  if (action.type === "set-industry") {
    return createLocalSettingsState({
      ...state.settings,
      preferredIndustry: action.preferredIndustry,
    });
  }

  if (action.type === "set-card-view-mode") {
    return createLocalSettingsState({
      ...state.settings,
      cardViewMode: action.cardViewMode,
    });
  }

  return createLocalSettingsState({
    ...state.settings,
    appearance: action.appearance,
  });
}

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userSettingsReducer, undefined, () =>
    readSettingsFromStorage(defaultSettings),
  );
  const { settings, lastSavedAt, recoveredFromBackup } = state;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    saveSettingsToStorage(settings);
  }, [settings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKeys.settings || !event.newValue) {
        return;
      }

      const nextState = readSettingsFromStorage(defaultSettings);
      dispatch({ type: "sync", payload: nextState });
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const value = useMemo<UserSettingsContextValue>(
    () => ({
      settings,
      lastSavedAt,
      recoveredFromBackup,
      setPreferredIndustry: (preferredIndustry) => {
        dispatch({ type: "set-industry", preferredIndustry });
      },
      setAppearance: (appearance) => {
        dispatch({ type: "set-appearance", appearance });
      },
      setCardViewMode: (cardViewMode) => {
        dispatch({ type: "set-card-view-mode", cardViewMode });
      },
    }),
    [lastSavedAt, recoveredFromBackup, settings],
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
