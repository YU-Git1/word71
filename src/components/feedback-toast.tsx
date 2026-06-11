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

  const successDecor =
    feedback.tone === "success" ? (
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span className="feedback-success-glow absolute left-6 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full" />
        <span className="feedback-success-dot absolute left-9 top-4" />
        <span className="feedback-success-dot delay-1 absolute left-12 top-11" />
        <span className="feedback-success-dot delay-2 absolute left-15 top-7" />
      </div>
    ) : null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[70] flex justify-center px-4">
      <div
        className={`pointer-events-auto relative flex max-w-xl items-center gap-4 rounded-full border px-5 py-3 shadow-[0_18px_60px_rgba(15,20,27,0.24)] backdrop-blur-xl ${
          feedback.tone === "success" ? "feedback-toast-success" : "feedback-toast-enter"
        }`}
        style={toneStyles}
      >
        {successDecor}
        {feedback.tone === "success" ? (
          <div className="feedback-success-badge relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#15803d] shadow-[0_10px_24px_rgba(34,197,94,0.22)]">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
              <path
                d="M4.5 10.2 8 13.7l7.5-7.4"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : null}
        <p className="text-sm font-semibold">{feedback.message}</p>
        <button
          type="button"
          onClick={clearFeedback}
          className="text-secondary flex h-8 w-8 items-center justify-center text-sm"
        >
          ×
        </button>
      </div>
    </div>
  );
}
