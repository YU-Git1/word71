"use client";

import { useMemo } from "react";
import { useWordLibrary } from "@/hooks/use-word-library";
import { WordCard } from "@/types/word";

function getWeekNumber(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function aggregate(
  words: WordCard[],
  buildKey: (date: Date) => string,
  formatter: (key: string) => string,
) {
  const counts = new Map<string, number>();

  words.forEach((item) => {
    const key = buildKey(new Date(item.createdAt));
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([key, count]) => ({
      key,
      label: formatter(key),
      count,
    }));
}

function Sparkline({
  data,
  idPrefix,
  stroke,
  fill,
}: {
  data: Array<{ key?: string; label: string; count: number }>;
  idPrefix: string;
  stroke: string;
  fill: string;
}) {
  if (!data.length) {
    return null;
  }

  const width = 360;
  const height = 140;
  const max = Math.max(...data.map((item) => item.count), 1);
  const stepX = data.length === 1 ? width : width / (data.length - 1);
  const points = data
    .map((item, index) => {
      const x = index * stepX;
      const y = height - (item.count / max) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const gradientId = `${idPrefix}-gradient`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.4" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M ${areaPoints}`} fill={`url(#${gradientId})`} />
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {data.map((item, index) => {
        const x = index * stepX;
        const y = height - (item.count / max) * (height - 20) - 10;
        return <circle key={item.key || item.label} cx={x} cy={y} r="4.5" fill={stroke} />;
      })}
    </svg>
  );
}

export function InsightsClient() {
  const { words, ready } = useWordLibrary();

  const stats = useMemo(() => {
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentYear = now.getFullYear();
    const currentMonth = `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const learnedWords = words.filter((item) => item.reviewCount > 0);
    const weeklyCount = words.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return (
        createdAt.getFullYear() === currentYear &&
        getWeekNumber(createdAt) === currentWeek
      );
    }).length;
    const monthlyCount = words.filter((item) => {
      const createdAt = new Date(item.createdAt);
      const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
      return key === currentMonth;
    }).length;

    const weeks = aggregate(
      words,
      (date) => `${date.getFullYear()}-W${String(getWeekNumber(date)).padStart(2, "0")}`,
      (key) => key.replace("-W", " 第 ") + " 周",
    );
    const months = aggregate(
      words,
      (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      (key) => `${key.replace("-", " 年 ")} 月`,
    );

    return {
      total: words.length,
      learned: learnedWords.length,
      weekly: weeklyCount,
      monthly: monthlyCount,
      weeks,
      months,
      learnedWords,
    };
  }, [words]);

  if (!ready) {
    return (
      <div className="theme-muted mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        正在分析你的词汇数据...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-36 sm:px-6 sm:pb-40 lg:px-8">
      <section className="grid gap-6">
        <div className="theme-panel rounded-[2rem] p-6">
          <h3 className="theme-title text-xl font-semibold">学习状态</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="theme-soft-card rounded-[1.4rem] p-4">
              <p className="theme-muted text-sm">总词数</p>
              <p className="theme-title mt-2 text-3xl font-semibold">{stats.total}</p>
            </div>
            <div
              className="rounded-[1.4rem] p-4"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--chart-teal) 18%, var(--panel-strong))",
              }}
            >
              <p className="text-sm" style={{ color: "var(--chart-teal)" }}>已学习</p>
              <p className="mt-2 text-3xl font-semibold" style={{ color: "var(--chart-teal)" }}>
                {stats.learned}
              </p>
            </div>
            <div className="rounded-[1.4rem] p-4" style={{ backgroundColor: "var(--accent-soft)" }}>
              <p className="text-sm" style={{ color: "var(--accent-text)" }}>待学习</p>
              <p className="mt-2 text-3xl font-semibold" style={{ color: "var(--accent-text)" }}>
                {Math.max(stats.total - stats.learned, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="theme-panel rounded-[2rem] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="theme-title text-2xl font-semibold">近阶段录入趋势</h3>
            </div>
            <div className="flex gap-3">
              <div
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--chart-teal) 18%, var(--panel-strong))",
                  color: "var(--chart-teal)",
                }}
              >
                本周 {stats.weekly}
              </div>
              <div
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-text)",
                }}
              >
                本月 {stats.monthly}
              </div>
            </div>
          </div>

          <div
            className="mt-6 rounded-[1.8rem] p-4"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--chart-teal) 10%, var(--panel-strong)) 0%, var(--panel-soft) 100%)",
            }}
          >
            <Sparkline
              data={stats.weeks.slice(-8)}
              idPrefix="weekly"
              stroke="var(--chart-teal)"
              fill="var(--chart-teal-fill)"
            />
            <div className="theme-muted mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              {stats.weeks.slice(-4).map((item) => (
                <div key={item.key} className="theme-card rounded-xl px-3 py-2">
                  <p>{item.label}</p>
                  <p className="theme-title mt-1 text-base font-semibold">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="theme-panel rounded-[2rem] p-6">
          <h3 className="theme-title text-2xl font-semibold">月度积累曲线</h3>
          <div
            className="mt-6 rounded-[1.8rem] p-4"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--accent) 12%, var(--panel-strong)) 0%, var(--panel-soft) 100%)",
            }}
          >
            <Sparkline
              data={stats.months}
              idPrefix="monthly"
              stroke="var(--chart-orange)"
              fill="var(--chart-orange-fill)"
            />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {stats.months.slice(-3).map((item) => (
              <div key={item.key} className="theme-soft-card rounded-xl px-4 py-3">
                <p className="theme-muted text-sm">{item.label}</p>
                <p className="theme-title mt-2 text-2xl font-semibold">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="theme-panel rounded-[2rem] p-6">
          <h3 className="theme-title text-2xl font-semibold">已学词汇清单</h3>
          {stats.learnedWords.length === 0 ? (
            <p className="theme-body mt-4 text-sm leading-7">暂无学习记录。</p>
          ) : (
            <div className="mt-6 flex flex-wrap gap-3">
              {stats.learnedWords.map((item) => (
                <div
                  key={item.id}
                  className="rounded-full px-4 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent-text)",
                  }}
                >
                  {item.word}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
