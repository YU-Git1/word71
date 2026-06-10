"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useWordLibrary } from "@/hooks/use-word-library";
import { WordDetailContent } from "@/components/word-detail-content";

export function WordDetailClient() {
  const params = useParams<{ id: string }>();
  const { ready, getWordById, markAsReviewed } = useWordLibrary();
  const word = getWordById(params.id);
  const hasMarkedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!word || !ready || hasMarkedRef.current === word.id) {
      return;
    }

    hasMarkedRef.current = word.id;
    markAsReviewed(word.id);
  }, [markAsReviewed, ready, word]);

  if (!ready) {
    return (
      <div className="theme-muted mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
        正在打开词卡详情...
      </div>
    );
  }

  if (!word) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="theme-panel rounded-[2rem] border-dashed p-10 text-center">
          <p className="theme-title text-2xl font-semibold">这张词卡不存在</p>
          <p className="theme-body mt-3 text-sm leading-7">
            可能是浏览器本地数据被清空了，或者当前链接已经失效。
          </p>
          <Link
            href="/words"
            className="theme-button-primary mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold"
          >
            返回词卡列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <WordDetailContent word={word} />
      <Link
        href="/words"
        className="theme-button-primary mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition hover:opacity-90"
      >
        返回词卡列表
      </Link>
    </div>
  );
}
