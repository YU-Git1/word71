"use client";

import { getIndustryLabel } from "@/lib/industry";
import { cleanMeaningText } from "@/lib/word-text";
import { WordCard } from "@/types/word";

function formatDate(value: string | null) {
  if (!value) {
    return "还没有学习记录";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type WordDetailContentProps = {
  word: WordCard;
  onClose?: () => void;
  compact?: boolean;
};

export function WordDetailContent({
  word,
  onClose,
  compact = false,
}: WordDetailContentProps) {
  const cleanedMeaning = cleanMeaningText(word.meaningZh);

  return (
    <div className={`theme-panel relative rounded-[2rem] p-6 sm:p-8 ${compact ? "" : ""}`}>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭词卡详情"
          className="theme-soft-card text-secondary absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border text-lg font-semibold transition hover:scale-[1.03] sm:right-8 sm:top-8"
          style={{ borderColor: "var(--border-strong)" }}
        >
          ×
        </button>
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="accent-text text-sm font-semibold uppercase tracking-[0.25em]">
            词卡详情
          </p>
          <h2 className="theme-title mt-2 text-4xl font-semibold">{word.word}</h2>
          <p className="theme-muted mt-3 text-lg">{word.phonetic}</p>
        </div>

        <div className="flex flex-wrap items-start gap-2 pr-16 sm:pr-18">
          <span
            className="rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent-text)",
            }}
          >
            {word.category}
          </span>
          <span
            className="rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: "color-mix(in srgb, var(--chart-teal) 18%, var(--panel-strong))",
              color: "var(--chart-teal)",
            }}
          >
            {getIndustryLabel(word.industry)}
          </span>
          <span className="theme-soft-card theme-body rounded-full px-4 py-2 text-sm">
            学习 {word.reviewCount} 次
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <section className="theme-soft-card rounded-[1.5rem] p-5">
            <p className="accent-text text-sm font-semibold uppercase tracking-[0.2em]">
              词性
            </p>
            <p className="theme-title mt-3 text-lg">{word.partOfSpeech}</p>
          </section>

          <section className="theme-soft-card rounded-[1.5rem] p-5">
            <p className="accent-text text-sm font-semibold uppercase tracking-[0.2em]">
              中文含义
            </p>
            <p className="theme-title mt-3 text-lg leading-8">{cleanedMeaning}</p>
            <p className="theme-muted mt-3 text-sm leading-7">
              当前优先行业语境：{getIndustryLabel(word.industry)}
            </p>
          </section>

          <section className="theme-soft-card rounded-[1.5rem] p-5">
            <p className="accent-text text-sm font-semibold uppercase tracking-[0.2em]">
              例句
            </p>
            <p className="theme-title mt-3 text-lg leading-8">{word.exampleSentence}</p>
          </section>
        </div>

        <div className="space-y-5">
          <section
            className="rounded-[1.5rem] p-5"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <p className="accent-text text-sm font-semibold uppercase tracking-[0.2em]">
              学习记录
            </p>
            <dl className="theme-body mt-4 space-y-4 text-sm">
              <div>
                <dt className="theme-muted font-medium">首次录入</dt>
                <dd className="theme-title mt-1 text-base">{formatDate(word.createdAt)}</dd>
              </div>
              <div>
                <dt className="theme-muted font-medium">最近学习</dt>
                <dd className="theme-title mt-1 text-base">
                  {formatDate(word.lastReviewedAt)}
                </dd>
              </div>
            </dl>
          </section>

          {word.audioUrl ? (
            <section className="theme-soft-card rounded-[1.5rem] p-5">
              <p className="accent-text text-sm font-semibold uppercase tracking-[0.2em]">
                发音
              </p>
              <audio controls className="mt-4 w-full">
                <source src={word.audioUrl} />
              </audio>
            </section>
          ) : null}

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="theme-button-primary inline-flex rounded-full px-5 py-3 text-sm font-semibold transition hover:opacity-90"
            >
              返回词卡列表继续学习
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
