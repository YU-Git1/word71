"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  readWordsFromStorage,
  saveWordsToStorage,
  storageKeys,
} from "@/lib/local-persistence";
import { UserSettings, WordCard } from "@/types/word";

type WordLibraryContextValue = {
  words: WordCard[];
  ready: boolean;
  categories: string[];
  lastSavedAt: string | null;
  recoveredFromBackup: boolean;
  addWord: (word: WordCard) => void;
  deleteWord: (id: string) => void;
  hasWord: (word: string) => boolean;
  markAsReviewed: (id: string) => void;
  getWordById: (id: string) => WordCard | undefined;
  exportLibrary: (settings?: UserSettings) => void;
};

const WordLibraryContext = createContext<WordLibraryContextValue | null>(null);

type WordLibraryState = {
  words: WordCard[];
  lastSavedAt: string | null;
  recoveredFromBackup: boolean;
};

type WordLibraryAction =
  | { type: "add"; word: WordCard }
  | { type: "delete"; id: string }
  | { type: "mark-reviewed"; id: string }
  | { type: "sync"; payload: WordLibraryState };

function sortWords(words: WordCard[]) {
  return [...words].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function createLocalState(words: WordCard[]): WordLibraryState {
  return {
    words,
    lastSavedAt: new Date().toISOString(),
    recoveredFromBackup: false,
  };
}

function wordLibraryReducer(
  state: WordLibraryState,
  action: WordLibraryAction,
): WordLibraryState {
  if (action.type === "sync") {
    return action.payload;
  }

  if (action.type === "add") {
    return createLocalState(sortWords([action.word, ...state.words]));
  }

  if (action.type === "delete") {
    return createLocalState(state.words.filter((item) => item.id !== action.id));
  }

  return createLocalState(
    state.words.map((item) =>
      item.id === action.id
        ? {
            ...item,
            reviewCount: item.reviewCount + 1,
            lastReviewedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : item,
    ),
  );
}

export function WordLibraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wordLibraryReducer, undefined, () =>
    readWordsFromStorage(),
  );
  const { words, lastSavedAt, recoveredFromBackup } = state;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    saveWordsToStorage(words);
  }, [words]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKeys.words || !event.newValue) {
        return;
      }

      const nextState = readWordsFromStorage();
      dispatch({ type: "sync", payload: nextState });
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const categories = useMemo(() => {
    const values = new Set(words.map((item) => item.category));
    return Array.from(values).sort((left, right) => left.localeCompare(right));
  }, [words]);

  const addWord = useCallback((word: WordCard) => {
    dispatch({ type: "add", word });
  }, []);

  const deleteWord = useCallback((id: string) => {
    dispatch({ type: "delete", id });
  }, []);

  const hasWord = useCallback(
    (word: string) =>
      words.some((item) => item.word.toLowerCase() === word.trim().toLowerCase()),
    [words],
  );

  const markAsReviewed = useCallback((id: string) => {
    dispatch({ type: "mark-reviewed", id });
  }, []);

  const getWordById = useCallback(
    (id: string) => words.find((item) => item.id === id),
    [words],
  );

  const exportLibrary = useCallback(
    (settings?: UserSettings) => {
      const payload = {
        exportedAt: new Date().toISOString(),
        settings,
        words,
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `vocabulary-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    },
    [words],
  );

  const value = useMemo<WordLibraryContextValue>(
    () => ({
      words,
      ready: true,
      categories,
      lastSavedAt,
      recoveredFromBackup,
      addWord,
      deleteWord,
      hasWord,
      markAsReviewed,
      getWordById,
      exportLibrary,
    }),
    [
      addWord,
      categories,
      deleteWord,
      exportLibrary,
      getWordById,
      hasWord,
      lastSavedAt,
      markAsReviewed,
      recoveredFromBackup,
      words,
    ],
  );

  return <WordLibraryContext.Provider value={value}>{children}</WordLibraryContext.Provider>;
}

export function useWordLibrary() {
  const context = useContext(WordLibraryContext);

  if (!context) {
    throw new Error("useWordLibrary must be used within WordLibraryProvider.");
  }

  return context;
}
