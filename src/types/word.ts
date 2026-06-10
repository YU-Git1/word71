export type WordSource = "seed" | "generated";

export type IndustryOption =
  | "general"
  | "uiux"
  | "frontend"
  | "product"
  | "marketing"
  | "business";

export type UserSettings = {
  preferredIndustry: IndustryOption;
  appearance: "system" | "light" | "dark";
};

export type WordCard = {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningZh: string;
  exampleSentence: string;
  category: string;
  industry: IndustryOption;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
  reviewCount: number;
  lastReviewedAt: string | null;
  source: WordSource;
};

export type EnrichedWord = Omit<
  WordCard,
  "id" | "createdAt" | "updatedAt" | "reviewCount" | "lastReviewedAt" | "source"
>;
