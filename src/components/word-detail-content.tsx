"use client";

import { useMemo, useRef, useState } from "react";
import { useUserSettings } from "@/hooks/use-user-settings";
import { sortMeaningsByPreference } from "@/lib/word-meanings";
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
  const { settings } = useUserSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const sortedMeanings = useMemo(
    () => sortMeaningsByPreference(word.meanings, settings.preferredIndustry),
    [settings.preferredIndustry, word.meanings],
  );

  const playPronunciation = async () => {
    if (typeof window === "undefined") {
      return;
    }

    if (word.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(word.audioUrl);
        audioRef.current.onended = () => setPlaying(false);
        audioRef.current.onpause = () => setPlaying(false);
        audioRef.current.onerror = () => setPlaying(false);
      }

      audioRef.current.currentTime = 0;
      setPlaying(true);

      try {
        await audioRef.current.play();
        return;
      } catch {
        setPlaying(false);
        audioRef.current = null;
      }
    }

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = "en-US";
      utterance.rate = 0.92;
      utterance.onend = () => setPlaying(false);
      utterance.onerror = () => setPlaying(false);
      window.speechSynthesis.cancel();
      setPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={`theme-panel relative max-h-[88vh] overflow-hidden rounded-[2rem] ${compact ? "" : ""}`}
    >
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

      <div className="max-h-[88vh] overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="theme-title text-4xl font-semibold">{word.word}</h2>
              <button
                type="button"
                aria-label={`朗读 ${word.word}`}
                onClick={() => {
                  void playPronunciation();
                }}
                className={`text-secondary flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5 ${
                  playing ? "word-audio-button is-playing" : ""
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`h-[18px] w-[18px] ${playing ? "word-audio-icon is-playing" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 10v4h3l4 3V7l-4 3H5Z" />
                  <path d="M15.5 9.5a4 4 0 0 1 0 5" />
                  <path d="M17.8 7.2a7 7 0 0 1 0 9.6" />
                </svg>
              </button>
            </div>
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
              <div className="mt-3 space-y-4">
                {sortedMeanings.map((meaning) => (
                  <div key={meaning.id} className="theme-title text-lg leading-8">
                    <p>{meaning.meaningZh}</p>
                    <p className="theme-muted mt-2 text-sm">{meaning.partOfSpeech}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="theme-soft-card rounded-[1.5rem] p-5">
              <p className="accent-text text-sm font-semibold uppercase tracking-[0.2em]">
                例句
              </p>
              <p className="theme-title mt-3 text-lg leading-8">{word.exampleSentence}</p>
              <p className="theme-muted mt-3 text-sm leading-7">{word.exampleSentenceZh}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
