"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SelectMenu } from "@/components/select-menu";
import { WordDetailModal } from "@/components/word-detail-modal";
import { useFeedback } from "@/hooks/use-feedback";
import { useWordLibrary } from "@/hooks/use-word-library";
import { WordCard } from "@/components/word-card";

export function WordsClient() {
  const { words, categories, ready, getWordById, markAsReviewed, deleteWord } = useWordLibrary();
  const { showFeedback } = useFeedback();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部分类");
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [menuState, setMenuState] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const reviewedOpenIdRef = useRef<string | null>(null);

  const filteredWords = useMemo(() => {
    return words.filter((item) => {
      const matchesQuery =
        !query ||
        item.word.toLowerCase().includes(query.trim().toLowerCase()) ||
        item.meaningZh.includes(query.trim()) ||
        item.partOfSpeech.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory =
        selectedCategory === "全部分类" || item.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory, words]);

  const selectedWord = selectedWordId ? getWordById(selectedWordId) ?? null : null;
  const menuWord = menuState ? getWordById(menuState.id) ?? null : null;
  const pendingDeleteWord = pendingDeleteId ? getWordById(pendingDeleteId) ?? null : null;

  useEffect(() => {
    if (!selectedWord || !ready || reviewedOpenIdRef.current === selectedWord.id) {
      return;
    }

    reviewedOpenIdRef.current = selectedWord.id;
    markAsReviewed(selectedWord.id);
  }, [markAsReviewed, ready, selectedWord]);

  const openWord = (id: string) => {
    reviewedOpenIdRef.current = null;
    setSelectedWordId(id);
  };

  const closeWord = () => {
    reviewedOpenIdRef.current = null;
    setSelectedWordId(null);
  };

  useEffect(() => {
    if (!menuState) {
      return;
    }

    const closeMenu = () => {
      setMenuState(null);
    };

    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [menuState]);

  const requestMenu = ({ id, x, y }: { id: string; x: number; y: number }) => {
    const maxX = Math.max(window.innerWidth - 172, 12);
    const maxY = Math.max(window.innerHeight - 84, 12);

    setMenuState({
      id,
      x: Math.min(x, maxX),
      y: Math.min(y, maxY),
    });
  };

  const requestDelete = (id: string) => {
    setMenuState(null);
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (!pendingDeleteWord) {
      setPendingDeleteId(null);
      return;
    }

    if (selectedWordId === pendingDeleteWord.id) {
      closeWord();
    }

    deleteWord(pendingDeleteWord.id);
    showFeedback({
      tone: "success",
      message: `"${pendingDeleteWord.word}" 已删除。`,
    });
    setPendingDeleteId(null);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 pb-36 sm:px-6 sm:pb-40 lg:px-8">
        <section className="theme-panel rounded-[2rem] p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="grid gap-3 md:min-w-0 md:flex-1 sm:grid-cols-[minmax(0,1fr)_220px]">
              <div className="theme-input relative flex h-14 items-center rounded-[1.2rem] pl-4 pr-2">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索单词、含义或词性"
                  className="h-full min-w-0 flex-1 bg-transparent pr-4 text-base outline-none"
                />
                <button
                  type="button"
                  aria-label="搜索词卡"
                  className="rounded-[1rem] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  搜索
                </button>
              </div>
              <SelectMenu
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: "全部分类", label: "全部分类" },
                  ...categories.map((category) => ({
                    value: category,
                    label: category,
                  })),
                ]}
                ariaLabel="选择分类"
              />
            </div>
            <div className="flex justify-end md:flex-none">
              <div
                className="flex items-center gap-1 rounded-full px-1 py-1"
                style={{
                  border: "1px solid var(--border-soft)",
                  backgroundColor: "color-mix(in srgb, var(--panel-strong) 82%, transparent)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("compact")}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition"
                  style={
                    viewMode === "compact"
                      ? {
                          backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
                          color: "var(--accent-text)",
                        }
                      : {
                          color: "var(--text-secondary)",
                        }
                  }
                >
                  简约
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("detailed")}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition"
                  style={
                    viewMode === "detailed"
                      ? {
                          backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
                          color: "var(--accent-text)",
                        }
                      : {
                          color: "var(--text-secondary)",
                        }
                  }
                >
                  详细
                </button>
              </div>
            </div>
          </div>
        </section>

        {!ready ? (
          <div className="theme-panel theme-muted mt-8 rounded-[2rem] border-dashed p-10 text-center">
            正在载入你的词库...
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="theme-panel mt-8 rounded-[2rem] border-dashed p-10 text-center">
            <p className="theme-title text-lg font-semibold">暂时没有匹配到词卡</p>
            <p className="theme-body mt-3 text-sm leading-7">
              可以换个关键词搜索，或者先去快速录入页新增几个单词。
            </p>
          </div>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredWords.map((item) => (
              <WordCard
                key={item.id}
                item={item}
                onOpen={openWord}
                onRequestMenu={requestMenu}
                viewMode={viewMode}
              />
            ))}
          </section>
        )}
      </div>

      {menuState && menuWord ? (
        <div
          className="fixed z-50"
          style={{
            left: menuState.x,
            top: menuState.y,
          }}
        >
          <div
            className="theme-panel rounded-[1.2rem] p-2 shadow-[0_18px_50px_rgba(15,20,27,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => requestDelete(menuWord.id)}
              className="w-full rounded-[0.9rem] px-4 py-3 text-left text-sm font-semibold transition hover:opacity-90"
              style={{ color: "#ef4444" }}
            >
              删除词卡
            </button>
          </div>
        </div>
      ) : null}

      {pendingDeleteWord ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="关闭删除确认弹窗"
            onClick={() => setPendingDeleteId(null)}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: "var(--overlay)" }}
          />
          <div className="theme-modal relative z-10 w-full max-w-md rounded-[1.8rem] p-6 sm:p-7">
            <p className="accent-text text-sm font-semibold uppercase tracking-[0.2em]">
              删除确认
            </p>
            <h3 className="theme-title mt-3 text-2xl font-semibold">
              删除 “{pendingDeleteWord.word}” ?
            </h3>
            <p className="theme-body mt-3 text-sm leading-7">
              删除后会从你的词库中移除，这个操作不可撤销。
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="theme-button-secondary rounded-full px-5 py-3 text-sm font-semibold"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-full px-5 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: "#dc2626" }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <WordDetailModal word={selectedWord} open={Boolean(selectedWord)} onClose={closeWord} />
    </>
  );
}

