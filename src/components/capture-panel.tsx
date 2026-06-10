"use client";

import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useWordLibrary } from "@/hooks/use-word-library";
import { EnrichedWord, WordCard } from "@/types/word";

type RequestState =
  | { type: "idle"; message: string }
  | { type: "loading"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

function buildWordCard(enriched: EnrichedWord): WordCard {
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

export function CapturePanel() {
  const { words, addWord, hasWord, ready } = useWordLibrary();
  const { settings } = useUserSettings();
  const [value, setValue] = useState("");
  const [requestState, setRequestState] = useState<RequestState>({
    type: "idle",
    message: "输入单词后回车，系统会自动生成学习卡片。",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const recentWords = useMemo(() => words.slice(0, 5), [words]);

  const submitWord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextValue = value.trim();

    if (!nextValue) {
      setRequestState({ type: "error", message: "先输入一个英文单词再提交。" });
      return;
    }

    if (hasWord(nextValue)) {
      setRequestState({
        type: "error",
        message: `"${nextValue}" 已存在，换一个新单词试试。`,
      });
      inputRef.current?.focus();
      return;
    }

    try {
      setRequestState({ type: "loading", message: `正在生成 ${nextValue} 的词卡...` });

      const response = await fetch("/api/words/enrich", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: nextValue,
          industry: settings.preferredIndustry,
        }),
      });

      const payload = (await response.json()) as
        | { data: EnrichedWord }
        | { error: string };

      if (!response.ok || !("data" in payload)) {
        throw new Error("error" in payload ? payload.error : "生成词卡失败。");
      }

      addWord(buildWordCard(payload.data));
      setValue("");
      setRequestState({
        type: "success",
        message: `"${nextValue}" 已加入词卡学习页。继续输入下一个单词吧。`,
      });
      inputRef.current?.focus();
    } catch (error) {
      setRequestState({
        type: "error",
        message: error instanceof Error ? error.message : "网络出了点问题，请稍后再试。",
      });
    }
  };

  const learnedCount = words.filter((item) => item.reviewCount > 0).length;

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
      <section className="theme-panel-accent rounded-[2rem] p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="accent-text text-sm font-semibold uppercase tracking-[0.3em]">
            极致录入效率
          </p>
          <h2 className="theme-title mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            打开就录，回车就生成卡片。
          </h2>
          <p className="theme-body mt-4 max-w-xl text-base leading-8 sm:text-lg">
            这一页只做一件事: 让你最快把单词收进自己的专业词汇库。输入单词本身，系统会自动补全音标、词性、中文含义和例句。
          </p>
        </div>

        <form onSubmit={submitWord} className="mt-10 space-y-4">
          <label htmlFor="word" className="theme-body text-sm font-medium">
            输入英文单词
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="word"
              ref={inputRef}
              autoFocus
              autoComplete="off"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="例如: resilient"
              className="theme-input h-16 flex-1 rounded-[1.4rem] px-5 text-xl outline-none transition focus:ring-4"
            />
            <button
              type="submit"
              disabled={!ready || requestState.type === "loading"}
              className="theme-button-primary h-16 rounded-[1.4rem] px-8 text-base font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {requestState.type === "loading" ? "生成中..." : "保存并生成"}
            </button>
          </div>
          <p
            className={`text-sm ${
              requestState.type === "error"
                ? "text-[#b91c1c]"
                : requestState.type === "success"
                  ? "text-[#047857]"
                  : "text-[#6b7280]"
            }`}
          >
            {requestState.message}
          </p>
        </form>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="theme-card rounded-[1.5rem] p-5">
            <p className="theme-muted text-sm">词库总量</p>
            <p className="theme-title mt-2 text-3xl font-semibold">{words.length}</p>
          </div>
          <div className="theme-card rounded-[1.5rem] p-5">
            <p className="theme-muted text-sm">已学习词数</p>
            <p className="theme-title mt-2 text-3xl font-semibold">{learnedCount}</p>
          </div>
          <div className="theme-card rounded-[1.5rem] p-5">
            <p className="theme-muted text-sm">释义策略</p>
            <p className="theme-title mt-2 text-xl font-semibold">行业优先</p>
          </div>
        </div>
      </section>

      <aside className="theme-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="accent-text text-sm font-semibold uppercase tracking-[0.25em]">
              最近录入
            </p>
            <h3 className="theme-title mt-2 text-2xl font-semibold">
              刚刚收进去的词卡
            </h3>
          </div>
          <Link
            href="/words"
            className="theme-button-secondary rounded-full px-4 py-2 text-sm font-medium"
          >
            去学习页
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {recentWords.map((item) => (
            <div
              key={item.id}
              className="theme-soft-card rounded-[1.4rem] border p-4"
              style={{ borderColor: "var(--border-strong)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="theme-title text-lg font-semibold">{item.word}</p>
                  <p className="theme-muted mt-1 text-sm">{item.phonetic}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-text)" }}>
                  {item.category}
                </span>
              </div>
              <p className="theme-body mt-3 line-clamp-2 text-sm leading-6">
                {item.meaningZh}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
