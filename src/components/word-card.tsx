import { useRef } from "react";
import { getIndustryLabel } from "@/lib/industry";
import { WordCard as WordCardType } from "@/types/word";

type WordCardProps = {
  item: WordCardType;
  onOpen: (id: string) => void;
  onRequestMenu: (input: { id: string; x: number; y: number }) => void;
  viewMode: "compact" | "detailed";
};

export function WordCard({ item, onOpen, onRequestMenu, viewMode }: WordCardProps) {
  const compact = viewMode === "compact";
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const openMenu = (x: number, y: number) => {
    longPressTriggeredRef.current = true;
    onRequestMenu({ id: item.id, x, y });
  };

  return (
    <button
      type="button"
      onClick={() => {
        if (longPressTriggeredRef.current) {
          longPressTriggeredRef.current = false;
          return;
        }

        onOpen(item.id);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        openMenu(event.clientX, event.clientY);
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "touch") {
          return;
        }

        longPressTriggeredRef.current = false;
        clearLongPress();
        longPressTimerRef.current = window.setTimeout(() => {
          openMenu(event.clientX, event.clientY);
        }, 520);
      }}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
      className="theme-card group flex h-full w-full flex-col rounded-[1.6rem] p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(131,94,62,0.16)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="theme-title text-xl font-semibold">{item.word}</p>
          <p className="theme-muted mt-1 text-sm">{item.phonetic}</p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-text)" }}>
          {item.category}
        </span>
      </div>

      <div className="theme-body mt-4 flex items-center gap-2 text-sm">
        <span
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: "var(--panel-soft)" }}
        >
          {item.partOfSpeech}
        </span>
        <span
          className="rounded-full px-3 py-1"
          style={{
            backgroundColor: "color-mix(in srgb, var(--chart-teal) 18%, var(--panel-strong))",
            color: "var(--chart-teal)",
          }}
        >
          {getIndustryLabel(item.industry)}
        </span>
        {item.reviewCount > 0 ? (
          <span
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor:
                "color-mix(in srgb, #bbf7d0 20%, var(--panel-strong))",
              color: "color-mix(in srgb, #166534 75%, var(--text-primary))",
            }}
          >
            已学习 {item.reviewCount} 次
          </span>
        ) : (
          <span
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor:
                "color-mix(in srgb, #fde68a 24%, var(--panel-strong))",
              color: "color-mix(in srgb, #92400e 75%, var(--text-primary))",
            }}
          >
            待学习
          </span>
        )}
      </div>

      {compact ? (
        <div className="mt-5 flex items-end justify-between gap-4">
          <p className="theme-muted line-clamp-1 text-sm">点击卡片进入学习详情</p>
          <span className="accent-text text-sm font-medium">查看</span>
        </div>
      ) : (
        <>
          <p className="theme-body mt-4 line-clamp-3 text-sm leading-7">{item.meaningZh}</p>

          <div className="theme-soft-card theme-body mt-5 rounded-[1.2rem] p-4 text-sm leading-7">
            {item.exampleSentence}
          </div>

          <div className="accent-text mt-5 text-sm font-medium">点击卡片进入学习详情</div>
        </>
      )}
    </button>
  );
}
