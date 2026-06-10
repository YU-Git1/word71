"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type FeedbackTone = "success" | "error" | "info";

type FeedbackItem = {
  id: number;
  message: string;
  tone: FeedbackTone;
};

type FeedbackContextValue = {
  feedback: FeedbackItem | null;
  showFeedback: (input: { message: string; tone: FeedbackTone }) => void;
  clearFeedback: () => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<FeedbackItem | null>(null);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const showFeedback = useCallback(
    ({ message, tone }: { message: string; tone: FeedbackTone }) => {
      setFeedback({
        id: Date.now(),
        message,
        tone,
      });
    },
    [],
  );

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFeedback((current) => (current?.id === feedback.id ? null : current));
    }, 2600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [feedback]);

  const value = useMemo<FeedbackContextValue>(
    () => ({
      feedback,
      showFeedback,
      clearFeedback,
    }),
    [clearFeedback, feedback, showFeedback],
  );

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
}

export function useFeedback() {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider.");
  }

  return context;
}
