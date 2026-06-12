import { scoreMeaningForIndustry } from "@/lib/industry";
import { IndustryOption, WordMeaning } from "@/types/word";

export function sortMeaningsByPreference(
  meanings: WordMeaning[],
  preferredIndustry: IndustryOption,
) {
  return [...meanings].sort((left, right) => {
    const rightScore = scoreMeaningForIndustry(
      `${right.meaningZh} ${right.definitionEn} ${right.partOfSpeech}`,
      preferredIndustry,
    );
    const leftScore = scoreMeaningForIndustry(
      `${left.meaningZh} ${left.definitionEn} ${left.partOfSpeech}`,
      preferredIndustry,
    );

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    return left.id.localeCompare(right.id);
  });
}

export function buildPrimaryMeaningText(
  meanings: WordMeaning[],
  preferredIndustry: IndustryOption,
  limit = 2,
) {
  return sortMeaningsByPreference(meanings, preferredIndustry)
    .slice(0, limit)
    .map((item) => item.meaningZh)
    .join("；");
}
