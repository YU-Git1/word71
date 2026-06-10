"use client";

import { useFeedback } from "@/hooks/use-feedback";

export function FeedbackToast() {
  const { feedback, clearFeedback } = useFeedback();

  if (!feedback) {
    return null;
  }

  const toneStyles =
    feedback.tone === "success"
      ? {
          background:
            "linear-gradient(135deg, color-mix(in srgb, #86efac 24%, var(--panel-strong)) 0%, var(--panel-strong) 100%)",
          color: "var(--text-primary)",
          borderColor: "color-mix(in srgb, #22c55e 32%, var(--border-strong))",
        }
      : feedback.tone === "error"
        ? {
            background:
              "linear-gradient(135deg, color-mix(in srgb, #fca5a5 22%, var(--panel-strong)) 0%, var(--panel-strong) 100%)",
            color: "var(--text-primary)",
            borderColor: "color-mix(in srgb, #ef4444 34%, var(--border-strong))",
          }
        : {
            background: "var(--panel-strong)",
            color: "var(--text-primary)",
            borderColor: "var(--border-strong)",
          };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[70] flex justify-center px-4">
      <div
        className="pointer-events-auto flex max-w-xl items-center gap-4 rounded-full border px-5 py-3 shadow-[0_18px_60px_rgba(15,20,27,0.24)] backdrop-blur-xl"
        style={toneStyles}
      >
        <p className="text-sm font-semibold">{feedback.message}</p>
        <button
          type="button"
          onClick={clearFeedback}
          className="theme-soft-card text-secondary flex h-8 w-8 items-center justify-center rounded-full border text-sm"
          style={{ borderColor: "var(--border-strong)" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
