"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useWordLibrary } from "@/hooks/use-word-library";
import { useFeedback } from "@/hooks/use-feedback";
import { enrichWord } from "@/lib/dictionary";
import { buildWordCard } from "@/lib/word-builders";

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
      const enriched = await enrichWord(nextValue, settings.preferredIndustry);
      addWord(buildWordCard(enriched));
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
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="theme-panel mx-auto flex items-center gap-3 rounded-[1.8rem] border px-4 py-4 shadow-[0_24px_80px_rgba(15,20,27,0.16),0_10px_28px_rgba(120,95,75,0.12)] backdrop-blur-xl sm:px-5"
          style={{
            borderColor: "var(--border-strong)",
          }}
        >
          <div className="min-w-0 flex-1">
            <input
              ref={inputRef}
              autoComplete="off"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="输入单词，Enter / 点击录入即可生成单词卡"
              className="theme-title w-full bg-transparent text-base outline-none placeholder:theme-muted sm:text-lg"
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
