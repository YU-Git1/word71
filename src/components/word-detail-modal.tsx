"use client";

import { useEffect } from "react";
import { WordCard } from "@/types/word";
import { WordDetailContent } from "@/components/word-detail-content";

type WordDetailModalProps = {
  word: WordCard | null;
  open: boolean;
  onClose: () => void;
};

export function WordDetailModal({ word, open, onClose }: WordDetailModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open || !word) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6 sm:px-6">
      <button
        type="button"
        aria-label="关闭词卡详情弹窗"
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "var(--overlay)" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-detail-modal-title"
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="sr-only" id="word-detail-modal-title">
          {word.word} 词卡详情
        </div>
        <WordDetailContent word={word} onClose={onClose} compact />
      </div>
    </div>
  );
}
