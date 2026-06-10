import { WordCard } from "@/types/word";

export const DEFAULT_CATEGORY = "未分类";

export const seedWords: WordCard[] = [
  {
    id: "seed-resilient",
    word: "resilient",
    phonetic: "/rɪˈzɪl.i.ənt/",
    partOfSpeech: "adjective / 形容词",
    meaningZh: "有韧性的；能迅速恢复的；适应力强的。",
    exampleSentence:
      "Small teams stay resilient when they learn quickly from setbacks.",
    category: "工作表达",
    industry: "business",
    audioUrl:
      "https://api.dictionaryapi.dev/media/pronunciations/en/resilient-us.mp3",
    createdAt: "2026-05-05T09:00:00.000Z",
    updatedAt: "2026-05-05T09:00:00.000Z",
    reviewCount: 2,
    lastReviewedAt: "2026-06-01T13:30:00.000Z",
    source: "seed",
  },
  {
    id: "seed-negotiate",
    word: "negotiate",
    phonetic: "/nɪˈɡəʊ.ʃi.eɪt/",
    partOfSpeech: "verb / 动词",
    meaningZh: "协商；谈判；通过沟通达成一致。",
    exampleSentence:
      "She had to negotiate the deadline with the client before Friday.",
    category: "商务沟通",
    industry: "business",
    audioUrl:
      "https://api.dictionaryapi.dev/media/pronunciations/en/negotiate-uk.mp3",
    createdAt: "2026-05-16T10:15:00.000Z",
    updatedAt: "2026-05-16T10:15:00.000Z",
    reviewCount: 1,
    lastReviewedAt: "2026-05-20T12:00:00.000Z",
    source: "seed",
  },
  {
    id: "seed-allocate",
    word: "allocate",
    phonetic: "/ˈæl.ə.keɪt/",
    partOfSpeech: "verb / 动词",
    meaningZh: "分配；拨给；按计划安排资源。",
    exampleSentence:
      "We should allocate more time to reviewing difficult vocabulary.",
    category: "项目管理",
    industry: "product",
    audioUrl:
      "https://api.dictionaryapi.dev/media/pronunciations/en/allocate-us.mp3",
    createdAt: "2026-05-27T08:40:00.000Z",
    updatedAt: "2026-05-27T08:40:00.000Z",
    reviewCount: 0,
    lastReviewedAt: null,
    source: "seed",
  },
  {
    id: "seed-clarify",
    word: "clarify",
    phonetic: "/ˈklær.ə.faɪ/",
    partOfSpeech: "verb / 动词",
    meaningZh: "澄清；讲清楚；使更易理解。",
    exampleSentence:
      "Please clarify the meaning before adding the word to your notes.",
    category: "学习表达",
    industry: "general",
    audioUrl:
      "https://api.dictionaryapi.dev/media/pronunciations/en/clarify-us.mp3",
    createdAt: "2026-06-02T07:20:00.000Z",
    updatedAt: "2026-06-02T07:20:00.000Z",
    reviewCount: 3,
    lastReviewedAt: "2026-06-09T11:10:00.000Z",
    source: "seed",
  },
  {
    id: "seed-precise",
    word: "precise",
    phonetic: "/prɪˈsaɪs/",
    partOfSpeech: "adjective / 形容词",
    meaningZh: "准确的；精确的；表达清晰且不含糊的。",
    exampleSentence:
      "A precise definition helps you remember the word much faster.",
    category: "写作表达",
    industry: "uiux",
    audioUrl:
      "https://api.dictionaryapi.dev/media/pronunciations/en/precise-us.mp3",
    createdAt: "2026-06-06T14:05:00.000Z",
    updatedAt: "2026-06-06T14:05:00.000Z",
    reviewCount: 1,
    lastReviewedAt: "2026-06-08T09:45:00.000Z",
    source: "seed",
  },
  {
    id: "seed-maintain",
    word: "maintain",
    phonetic: "/meɪnˈteɪn/",
    partOfSpeech: "verb / 动词",
    meaningZh: "维持；保持；持续让某种状态存在。",
    exampleSentence:
      "It is easier to maintain a vocabulary habit with quick capture.",
    category: "日常高频",
    industry: "general",
    audioUrl:
      "https://api.dictionaryapi.dev/media/pronunciations/en/maintain-us.mp3",
    createdAt: "2026-06-09T16:00:00.000Z",
    updatedAt: "2026-06-09T16:00:00.000Z",
    reviewCount: 0,
    lastReviewedAt: null,
    source: "seed",
  },
];
