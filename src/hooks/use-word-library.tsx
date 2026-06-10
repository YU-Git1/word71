"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedWords } from "@/lib/seed-words";
import { IndustryOption, UserSettings, WordCard } from "@/types/word";

const STORAGE_KEY = "pro-vocab-library";
const BACKUP_KEY = "pro-vocab-library-backup";
const VALID_INDUSTRIES: IndustryOption[] = [
  "general",
  "uiux",
  "frontend",
  "product",
  "marketing",
  "business",
];

type WordLibraryContextValue = {
  words: WordCard[];
  ready: boolean;
  categories: string[];
  addWord: (word: WordCard) => void;
  deleteWord: (id: string) => void;
  hasWord: (word: string) => boolean;
  markAsReviewed: (id: string) => void;
  getWordById: (id: string) => WordCard | undefined;
  exportLibrary: (settings?: UserSettings) => void;
};

const WordLibraryContext = createContext<WordLibraryContextValue | null>(null);

function sortWords(words: WordCard[]) {
  return [...words].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function normalizeWord(partial: Partial<WordCard>, index: number): WordCard {
  const now = new Date().toISOString();
  const fallbackWord = partial.word?.trim() || `word-${index + 1}`;
  const normalizedIndustry = VALID_INDUSTRIES.includes(
    partial.industry as IndustryOption,
  )
    ? (partial.industry as IndustryOption)
    : "general";

  return {
    id: partial.id || `migrated-${fallbackWord}-${index}`,
    word: fallbackWord,
    phonetic: partial.phonetic || "/-/",
    partOfSpeech: partial.partOfSpeech || "unknown / 未分类",
    meaningZh: partial.meaningZh || "暂未生成释义。",
    exampleSentence: partial.exampleSentence || "No example available yet.",
    category: partial.category || "未分类",
    industry: normalizedIndustry,
    audioUrl: partial.audioUrl,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || partial.createdAt || now,
    reviewCount: typeof partial.reviewCount === "number" ? partial.reviewCount : 0,
    lastReviewedAt: partial.lastReviewedAt || null,
    source: partial.source === "generated" ? "generated" : "seed",
  };
}

function readStorage() {
  if (typeof window === "undefined") {
    return seedWords;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedWords));
    return seedWords;
  }

  try {
    const parsed = JSON.parse(raw) as Array<Partial<WordCard>>;
    return sortWords(parsed.map((item, index) => normalizeWord(item, index)));
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedWords));
    return seedWords;
  }
}

export function WordLibraryProvider({ children }: { children: ReactNode }) {
  const [words, setWords] = useState<WordCard[]>(() => readStorage());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    window.localStorage.setItem(
      BACKUP_KEY,
      JSON.stringify({
        exportedAt: new Date().toISOString(),
        words,
      }),
    );
  }, [words]);

  const categories = useMemo(() => {
    const values = new Set(words.map((item) => item.category));
    return Array.from(values).sort((left, right) => left.localeCompare(right));
  }, [words]);

  const addWord = useCallback((word: WordCard) => {
    setWords((current) => sortWords([word, ...current]));
  }, []);

  const deleteWord = useCallback((id: string) => {
    setWords((current) => current.filter((item) => item.id !== id));
  }, []);

  const hasWord = useCallback(
    (word: string) =>
      words.some((item) => item.word.toLowerCase() === word.trim().toLowerCase()),
    [words],
  );

  const markAsReviewed = useCallback((id: string) => {
    setWords((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              reviewCount: item.reviewCount + 1,
              lastReviewedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
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
      addWord,
      deleteWord,
      hasWord,
      markAsReviewed,
      getWordById,
      exportLibrary,
    }),
    [addWord, categories, deleteWord, exportLibrary, getWordById, hasWord, markAsReviewed, words],
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
