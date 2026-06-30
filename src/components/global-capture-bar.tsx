"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
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
  const [mobileHint, setMobileHint] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);

  const enabled = enabledPaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const syncHint = () => setMobileHint(mediaQuery.matches);

    syncHint();
    mediaQuery.addEventListener("change", syncHint);

    return () => {
      mediaQuery.removeEventListener("change", syncHint);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const clearResumeTimer = () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollYRef.current);

      if (currentScrollY <= 8) {
        setScrollHidden(false);
        clearResumeTimer();
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (delta > 6) {
        setScrollHidden(true);
        lastScrollYRef.current = currentScrollY;
      }

      clearResumeTimer();
      resumeTimerRef.current = window.setTimeout(() => {
        setScrollHidden(false);
      }, 300);
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearResumeTimer();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleSearchFocusChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ active?: boolean }>;
      setSearchActive(Boolean(customEvent.detail?.active));
    };

    window.addEventListener("search-focus-change", handleSearchFocusChange as EventListener);

    return () => {
      window.removeEventListener(
        "search-focus-change",
        handleSearchFocusChange as EventListener,
      );
    };
  }, []);

  if (!enabled) {
    return null;
  }

  const hiddenOnMobile = (mobileHint && searchActive) || scrollHidden;

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
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-3 transition-all duration-300 ${
        hiddenOnMobile ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{
        transitionTimingFunction: hiddenOnMobile
          ? "cubic-bezier(0.4, 0, 1, 1)"
          : "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div
        className={`w-full max-w-3xl transition-all duration-300 ${
          hiddenOnMobile
            ? "pointer-events-none scale-[0.97] opacity-0"
            : "pointer-events-auto scale-100 opacity-100"
        }`}
        style={{
          transitionTimingFunction: hiddenOnMobile
            ? "cubic-bezier(0.4, 0, 1, 1)"
            : "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
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
              placeholder={
                mobileHint
                  ? "输入单词即可生成单词卡"
                  : "输入单词，Enter / 点击录入即可生成单词卡"
              }
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
