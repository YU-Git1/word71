"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useWordLibrary } from "@/hooks/use-word-library";
import { useFeedback } from "@/hooks/use-feedback";
import { buildWordCard } from "@/lib/word-builders";
import { EnrichedWord } from "@/types/word";

const enabledPaths = ["/words", "/insights"];

export function GlobalCaptureBar() {
  const pathname = usePathname();
  const { settings } = useUserSettings();
  const { addWord, hasWord, ready } = useWordLibrary();
  const { showFeedback } = useFeedback();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const enabled = enabledPaths.some((path) => pathname.startsWith(path));

  if (!enabled) {
    return null;
  }

  const submitWord = async () => {
    const nextValue = value.trim();

    if (!nextValue) {
      showFeedback({ tone: "error", message: "先输入一个英文单词再录入。" });
      inputRef.current?.focus();
      return;
    }

    if (hasWord(nextValue)) {
      showFeedback({ tone: "error", message: `"${nextValue}" 已存在，换一个新词试试。` });
      inputRef.current?.focus();
      return;
    }

    try {
      setSubmitting(true);

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
      showFeedback({
        tone: "success",
        message: `"${nextValue}" 已录入成功，词卡已自动加入学习列表。`,
      });
      inputRef.current?.focus();
    } catch (error) {
      showFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "录入失败，请稍后再试。",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitWord();
  };

  const handleInputKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();

    if (submitting || !ready) {
      return;
    }

    await submitWord();
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:bottom-5">
      <div className="pointer-events-auto w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="theme-panel mx-auto flex items-center gap-3 rounded-[1.8rem] px-4 py-4 shadow-[0_18px_60px_rgba(15,20,27,0.2)] backdrop-blur-xl sm:px-5"
        >
          <div className="min-w-0 flex-1">
            <p className="accent-text text-[11px] font-semibold uppercase tracking-[0.24em]">
              随时录入
            </p>
            <input
              ref={inputRef}
              autoComplete="off"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="输入单词，回车或点击右侧按钮即可快速生成词卡"
              className="theme-title mt-2 w-full bg-transparent text-base outline-none placeholder:theme-muted sm:text-lg"
              disabled={!ready || submitting}
            />
          </div>

          <button
            type="submit"
            disabled={!ready || submitting}
            className="theme-button-primary shrink-0 rounded-[1.2rem] px-5 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
          >
            {submitting ? "录入中..." : "录入"}
          </button>
        </form>
      </div>
    </div>
  );
}
