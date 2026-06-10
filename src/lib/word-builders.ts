import { EnrichedWord, WordCard } from "@/types/word";

export function buildWordCard(enriched: EnrichedWord): WordCard {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    reviewCount: 0,
    lastReviewedAt: null,
    source: "generated",
    ...enriched,
  };
}
