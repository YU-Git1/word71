import { useRef, useState } from "react";
import { useUserSettings } from "@/hooks/use-user-settings";
import { buildPrimaryMeaningText } from "@/lib/word-meanings";
import { WordCard as WordCardType } from "@/types/word";

type WordCardProps = {
  item: WordCardType;
  onOpen: (id: string) => void;
  onRequestMenu: (input: { id: string; x: number; y: number }) => void;
  viewMode: "compact" | "detailed";
};

export function WordCard({ item, onOpen, onRequestMenu, viewMode }: WordCardProps) {
  const compact = viewMode === "compact";
  const { settings } = useUserSettings();
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const primaryMeaningText = buildPrimaryMeaningText(item.meanings, settings.preferredIndustry);

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

  const playPronunciation = async () => {
    if (typeof window === "undefined") {
      return;
    }

    if (item.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(item.audioUrl);
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
      const utterance = new SpeechSynthesisUtterance(item.word);
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
          <div className="flex items-center gap-2">
            <p className="theme-title text-xl font-semibold">{item.word}</p>
            <button
              type="button"
              aria-label={`朗读 ${item.word}`}
              onClick={(event) => {
                event.stopPropagation();
                void playPronunciation();
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
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
          <div className="theme-muted mt-2 flex items-center gap-6 text-sm">
            <p>{item.phonetic}</p>
            <p>{item.partOfSpeech}</p>
          </div>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-text)" }}>
          {item.category}
        </span>
      </div>

      {compact ? (
        <>
          <p className="theme-body mt-4 line-clamp-2 text-sm leading-7">{primaryMeaningText}</p>
        </>
      ) : (
        <>
          <p className="theme-body mt-4 line-clamp-3 text-sm leading-7">{primaryMeaningText}</p>

          <div className="theme-soft-card theme-body mt-5 rounded-[1.2rem] p-4 text-sm leading-7">
            <p>{item.exampleSentence}</p>
            <p className="theme-muted mt-3">{item.exampleSentenceZh}</p>
          </div>
        </>
      )}
    </button>
  );
}
