"use client";

import { seedWords } from "@/lib/seed-words";
import { IndustryOption, UserSettings, WordCard } from "@/types/word";

const WORDS_STORAGE_KEY = "pro-vocab-library";
const WORDS_BACKUP_KEY = "pro-vocab-library-backups";
const SETTINGS_STORAGE_KEY = "pro-vocab-settings";
const SETTINGS_BACKUP_KEY = "pro-vocab-settings-backups";
const STORAGE_VERSION = 2;
const MAX_BACKUP_SNAPSHOTS = 12;

const VALID_INDUSTRIES: IndustryOption[] = [
  "general",
  "uiux",
  "frontend",
  "product",
  "marketing",
  "business",
];

type PersistedWordsPayload = {
  version: number;
  savedAt: string;
  words: Array<Partial<WordCard>>;
};

type PersistedSettingsPayload = {
  version: number;
  savedAt: string;
  settings: Partial<UserSettings>;
};

type PersistedWordBackup = {
  version: number;
  savedAt: string;
  words: WordCard[];
};

type PersistedSettingsBackup = {
  version: number;
  savedAt: string;
  settings: UserSettings;
};

type ReadWordsResult = {
  lastSavedAt: string | null;
  recoveredFromBackup: boolean;
  words: WordCard[];
};

type ReadSettingsResult = {
  lastSavedAt: string | null;
  recoveredFromBackup: boolean;
  settings: UserSettings;
};

type SaveResult = {
  lastSavedAt: string;
};

export const storageKeys = {
  settings: SETTINGS_STORAGE_KEY,
  words: WORDS_STORAGE_KEY,
} as const;

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

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
    meanings:
      partial.meanings?.map((meaning, meaningIndex) => ({
        id: meaning.id || `meaning-${meaningIndex + 1}`,
        partOfSpeech: meaning.partOfSpeech || partial.partOfSpeech || "unknown / 未分类",
        definitionEn: meaning.definitionEn || "",
        meaningZh: meaning.meaningZh || partial.meaningZh || "暂未生成释义。",
      })) || [
        {
          id: "meaning-1",
          partOfSpeech: partial.partOfSpeech || "unknown / 未分类",
          definitionEn: "",
          meaningZh: partial.meaningZh || "暂未生成释义。",
        },
      ],
    exampleSentence: partial.exampleSentence || "No example available yet.",
    exampleSentenceZh: partial.exampleSentenceZh || "暂未生成例句释义。",
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

function normalizeSettings(
  defaultSettings: UserSettings,
  partial: Partial<UserSettings> | null | undefined,
) {
  return {
    preferredIndustry: VALID_INDUSTRIES.includes(
      partial?.preferredIndustry as IndustryOption,
    )
      ? (partial?.preferredIndustry as IndustryOption)
      : defaultSettings.preferredIndustry,
    appearance:
      partial?.appearance === "light" ||
      partial?.appearance === "dark" ||
      partial?.appearance === "system"
        ? partial.appearance
        : defaultSettings.appearance,
    cardViewMode:
      partial?.cardViewMode === "compact" || partial?.cardViewMode === "detailed"
        ? partial.cardViewMode
        : defaultSettings.cardViewMode,
  } satisfies UserSettings;
}

function readWordBackupSnapshots() {
  const parsed = safeJsonParse<PersistedWordBackup[]>(
    window.localStorage.getItem(WORDS_BACKUP_KEY),
  );

  if (!parsed) {
    return [];
  }

  return parsed
    .filter((snapshot) => Array.isArray(snapshot.words) && typeof snapshot.savedAt === "string")
    .map((snapshot) => ({
      ...snapshot,
      words: sortWords(snapshot.words.map((item, index) => normalizeWord(item, index))),
    }))
    .sort(
      (left, right) =>
        new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime(),
    );
}

function writeWordBackups(backups: PersistedWordBackup[]) {
  window.localStorage.setItem(
    WORDS_BACKUP_KEY,
    JSON.stringify(backups.slice(0, MAX_BACKUP_SNAPSHOTS)),
  );
}

function readSettingsBackupSnapshots(defaultSettings: UserSettings) {
  const parsed = safeJsonParse<PersistedSettingsBackup[]>(
    window.localStorage.getItem(SETTINGS_BACKUP_KEY),
  );

  if (!parsed) {
    return [];
  }

  return parsed
    .filter(
      (snapshot) =>
        snapshot &&
        typeof snapshot.savedAt === "string" &&
        typeof snapshot.settings === "object",
    )
    .map((snapshot) => ({
      ...snapshot,
      settings: normalizeSettings(defaultSettings, snapshot.settings),
    }))
    .sort(
      (left, right) =>
        new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime(),
    );
}

function writeSettingsBackups(backups: PersistedSettingsBackup[]) {
  window.localStorage.setItem(
    SETTINGS_BACKUP_KEY,
    JSON.stringify(backups.slice(0, MAX_BACKUP_SNAPSHOTS)),
  );
}

export function readWordsFromStorage(): ReadWordsResult {
  if (typeof window === "undefined") {
    return {
      lastSavedAt: null,
      recoveredFromBackup: false,
      words: seedWords,
    };
  }

  const raw = safeJsonParse<PersistedWordsPayload | Array<Partial<WordCard>>>(
    window.localStorage.getItem(WORDS_STORAGE_KEY),
  );

  if (Array.isArray(raw)) {
    return {
      lastSavedAt: null,
      recoveredFromBackup: false,
      words: sortWords(raw.map((item, index) => normalizeWord(item, index))),
    };
  }

  if (raw && Array.isArray(raw.words)) {
    return {
      lastSavedAt: raw.savedAt || null,
      recoveredFromBackup: false,
      words: sortWords(raw.words.map((item, index) => normalizeWord(item, index))),
    };
  }

  const backups = readWordBackupSnapshots();
  if (backups.length > 0) {
    const latest = backups[0];
    window.localStorage.setItem(
      WORDS_STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        savedAt: latest.savedAt,
        words: latest.words,
      } satisfies PersistedWordsPayload),
    );

    return {
      lastSavedAt: latest.savedAt,
      recoveredFromBackup: true,
      words: latest.words,
    };
  }

  const fallbackSavedAt = new Date().toISOString();
  const fallbackWords = sortWords(seedWords.map((item, index) => normalizeWord(item, index)));
  window.localStorage.setItem(
    WORDS_STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_VERSION,
      savedAt: fallbackSavedAt,
      words: fallbackWords,
    } satisfies PersistedWordsPayload),
  );
  writeWordBackups([
    {
      version: STORAGE_VERSION,
      savedAt: fallbackSavedAt,
      words: fallbackWords,
    },
  ]);

  return {
    lastSavedAt: fallbackSavedAt,
    recoveredFromBackup: false,
    words: fallbackWords,
  };
}

export function saveWordsToStorage(words: WordCard[]): SaveResult {
  const savedAt = new Date().toISOString();
  const normalizedWords = sortWords(words.map((item, index) => normalizeWord(item, index)));
  const payload: PersistedWordsPayload = {
    version: STORAGE_VERSION,
    savedAt,
    words: normalizedWords,
  };

  window.localStorage.setItem(WORDS_STORAGE_KEY, JSON.stringify(payload));

  const nextBackups = [
    {
      version: STORAGE_VERSION,
      savedAt,
      words: normalizedWords,
    },
    ...readWordBackupSnapshots().filter((snapshot) => snapshot.savedAt !== savedAt),
  ];

  writeWordBackups(nextBackups);

  return { lastSavedAt: savedAt };
}

export function readSettingsFromStorage(
  defaultSettings: UserSettings,
): ReadSettingsResult {
  if (typeof window === "undefined") {
    return {
      lastSavedAt: null,
      recoveredFromBackup: false,
      settings: defaultSettings,
    };
  }

  const raw = safeJsonParse<PersistedSettingsPayload | Partial<UserSettings>>(
    window.localStorage.getItem(SETTINGS_STORAGE_KEY),
  );

  if (raw && "settings" in raw) {
    return {
      lastSavedAt: raw.savedAt || null,
      recoveredFromBackup: false,
      settings: normalizeSettings(defaultSettings, raw.settings),
    };
  }

  if (raw) {
    return {
      lastSavedAt: null,
      recoveredFromBackup: false,
      settings: normalizeSettings(defaultSettings, raw),
    };
  }

  const backups = readSettingsBackupSnapshots(defaultSettings);
  if (backups.length > 0) {
    const latest = backups[0];
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        savedAt: latest.savedAt,
        settings: latest.settings,
      } satisfies PersistedSettingsPayload),
    );

    return {
      lastSavedAt: latest.savedAt,
      recoveredFromBackup: true,
      settings: latest.settings,
    };
  }

  const savedAt = new Date().toISOString();
  window.localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_VERSION,
      savedAt,
      settings: defaultSettings,
    } satisfies PersistedSettingsPayload),
  );
  writeSettingsBackups([
    {
      version: STORAGE_VERSION,
      savedAt,
      settings: defaultSettings,
    },
  ]);

  return {
    lastSavedAt: savedAt,
    recoveredFromBackup: false,
    settings: defaultSettings,
  };
}

export function saveSettingsToStorage(settings: UserSettings): SaveResult {
  const savedAt = new Date().toISOString();
  const normalizedSettings = normalizeSettings(settings, settings);
  const payload: PersistedSettingsPayload = {
    version: STORAGE_VERSION,
    savedAt,
    settings: normalizedSettings,
  };

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));

  const nextBackups = [
    {
      version: STORAGE_VERSION,
      savedAt,
      settings: normalizedSettings,
    },
    ...readSettingsBackupSnapshots(normalizedSettings).filter(
      (snapshot) => snapshot.savedAt !== savedAt,
    ),
  ];

  writeSettingsBackups(nextBackups);

  return { lastSavedAt: savedAt };
}
