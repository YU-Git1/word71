import { DEFAULT_CATEGORY } from "@/lib/seed-words";
import { EnrichedWord, IndustryOption } from "@/types/word";

type DictionaryApiResponse = Array<{
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings?: Array<{
    partOfSpeech?: string;
    definitions?: Array<{
      definition?: string;
      example?: string;
    }>;
  }>;
}>;

const partOfSpeechMap: Record<string, string> = {
  noun: "名词",
  verb: "动词",
  adjective: "形容词",
  adverb: "副词",
  pronoun: "代词",
  preposition: "介词",
  conjunction: "连词",
  interjection: "感叹词",
  article: "冠词",
};

function normalizeWord(value: string) {
  return value.trim().toLowerCase();
}

function buildFallbackExample(word: string, definition: string) {
  return `While studying, I wrote down "${word}" to remember that it means ${definition.toLowerCase()}.`;
}

async function translateToChinese(text: string) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text,
  )}&langpair=en|zh-CN`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("翻译服务暂时不可用。");
  }

  const payload = (await response.json()) as {
    responseData?: { translatedText?: string };
  };

  return payload.responseData?.translatedText?.trim() || text;
}

async function createIndustryMeaning(
  word: string,
  definition: string,
) {
  const text = `${word}: ${definition}`;
  return translateToChinese(text);
}

export async function enrichWord(
  wordInput: string,
  industry: IndustryOption = "general",
): Promise<EnrichedWord> {
  const normalizedWord = normalizeWord(wordInput);

  if (!normalizedWord) {
    throw new Error("请输入一个有效单词。");
  }

  const dictionaryResponse = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
      normalizedWord,
    )}`,
    {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!dictionaryResponse.ok) {
    throw new Error("没有查到这个单词，请检查拼写后再试。");
  }

  const entries = (await dictionaryResponse.json()) as DictionaryApiResponse;
  const entry = entries[0];
  const phonetic =
    entry.phonetic ||
    entry.phonetics?.find((item) => item.text)?.text ||
    "暂无音标";
  const audioUrl = entry.phonetics?.find((item) => item.audio)?.audio;
  const meaning = entry.meanings?.find((item) => item.definitions?.length);
  const definition =
    meaning?.definitions?.find((item) => item.example || item.definition) ||
    meaning?.definitions?.[0];

  if (!meaning || !definition?.definition) {
    throw new Error("词典返回的数据不完整，请稍后重试。");
  }

  const translatedMeaning = await createIndustryMeaning(
    normalizedWord,
    definition.definition,
  );
  const partOfSpeech = meaning.partOfSpeech || "unknown";
  const partOfSpeechLabel = partOfSpeechMap[partOfSpeech] || "未分类词性";

  return {
    word: entry.word || normalizedWord,
    phonetic,
    partOfSpeech: `${partOfSpeech} / ${partOfSpeechLabel}`,
    meaningZh: translatedMeaning,
    exampleSentence:
      definition.example || buildFallbackExample(normalizedWord, definition.definition),
    category: DEFAULT_CATEGORY,
    industry,
    audioUrl,
  };
}
