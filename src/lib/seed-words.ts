import { WordCard } from "@/types/word";

export const DEFAULT_CATEGORY = "未分类";

export const seedWords: WordCard[] = [
  {
    id: "seed-resilient",
    word: "resilient",
    phonetic: "/rɪˈzɪl.i.ənt/",
    partOfSpeech: "adjective / 形容词",
    meaningZh: "有韧性的；能迅速恢复的；适应力强的。",
    meanings: [
      {
        id: "1-1",
        partOfSpeech: "adjective / 形容词",
        definitionEn: "Able to recover quickly from difficulties.",
        meaningZh: "有韧性的；能迅速恢复的；适应力强的。",
      },
      {
        id: "1-2",
        partOfSpeech: "adjective / 形容词",
        definitionEn: "Able to return to its original shape after bending.",
        meaningZh: "有弹性的；受压后能恢复原状的。",
      },
    ],
    exampleSentence:
      "Small teams stay resilient when they learn quickly from setbacks.",
    exampleSentenceZh: "小团队如果能迅速从挫折中学习，就能保持韧性。",
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
    meanings: [
      {
        id: "1-1",
        partOfSpeech: "verb / 动词",
        definitionEn: "Try to reach an agreement by formal discussion.",
        meaningZh: "协商；谈判；通过沟通达成一致。",
      },
      {
        id: "1-2",
        partOfSpeech: "verb / 动词",
        definitionEn: "Successfully travel along or over a difficult route.",
        meaningZh: "设法越过；顺利通过复杂路径。",
      },
    ],
    exampleSentence:
      "She had to negotiate the deadline with the client before Friday.",
    exampleSentenceZh: "她必须在周五前和客户协商截止时间。",
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
    meanings: [
      {
        id: "1-1",
        partOfSpeech: "verb / 动词",
        definitionEn: "Distribute resources or duties for a purpose.",
        meaningZh: "分配；拨给；按计划安排资源。",
      },
      {
        id: "1-2",
        partOfSpeech: "verb / 动词",
        definitionEn: "Assign something formally to someone.",
        meaningZh: "正式分派；指定归属。",
      },
    ],
    exampleSentence:
      "We should allocate more time to reviewing difficult vocabulary.",
    exampleSentenceZh: "我们应该分配更多时间来复习难记的词汇。",
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
    meanings: [
      {
        id: "1-1",
        partOfSpeech: "verb / 动词",
        definitionEn: "Make a statement easier to understand.",
        meaningZh: "澄清；讲清楚；使更易理解。",
      },
      {
        id: "1-2",
        partOfSpeech: "verb / 动词",
        definitionEn: "Remove impurities from a liquid.",
        meaningZh: "使澄清；去除液体中的杂质。",
      },
    ],
    exampleSentence:
      "Please clarify the meaning before adding the word to your notes.",
    exampleSentenceZh: "在把这个词记进笔记前，请先澄清它的含义。",
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
    meanings: [
      {
        id: "1-1",
        partOfSpeech: "adjective / 形容词",
        definitionEn: "Marked by exactness and clear expression.",
        meaningZh: "准确的；精确的；表达清晰且不含糊的。",
      },
      {
        id: "1-2",
        partOfSpeech: "adjective / 形容词",
        definitionEn: "Strictly defined or fixed in detail.",
        meaningZh: "明确界定的；细节上严格确定的。",
      },
    ],
    exampleSentence:
      "A precise definition helps you remember the word much faster.",
    exampleSentenceZh: "一个准确的定义能帮助你更快记住这个单词。",
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
    meanings: [
      {
        id: "1-1",
        partOfSpeech: "verb / 动词",
        definitionEn: "Cause or enable a condition to continue.",
        meaningZh: "维持；保持；持续让某种状态存在。",
      },
      {
        id: "1-2",
        partOfSpeech: "verb / 动词",
        definitionEn: "Keep something in good condition by checking or repairing it.",
        meaningZh: "保养；维修；使处于良好状态。",
      },
    ],
    exampleSentence:
      "It is easier to maintain a vocabulary habit with quick capture.",
    exampleSentenceZh: "借助快速录入，更容易保持记单词的习惯。",
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
