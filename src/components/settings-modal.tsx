"use client";

import { useEffect } from "react";
import { industryOptions } from "@/lib/industry";
import { SelectMenu } from "@/components/select-menu";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useWordLibrary } from "@/hooks/use-word-library";

const appearanceOptions = [
  { value: "system", label: "跟随系统" },
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
] as const;

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const {
    settings,
    setPreferredIndustry,
    setAppearance,
  } = useUserSettings();
  const {
    exportLibrary,
    words,
  } = useWordLibrary();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6 sm:px-6">
      <button
        type="button"
        aria-label="关闭设置弹窗"
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "var(--overlay)" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="theme-modal relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] p-6 sm:p-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 id="settings-modal-title" className="text-primary text-3xl font-semibold">
              设置
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="theme-soft-card text-secondary flex h-11 w-11 items-center justify-center rounded-full border text-lg font-semibold transition hover:scale-[1.03]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            ×
          </button>
        </div>

        <div className="mt-8 grid gap-6">
          <section className="theme-modal-section rounded-[1.6rem] p-5">
            <p className="accent-text text-sm font-semibold uppercase tracking-[0.18em]">
              领域偏好
            </p>
            <SelectMenu
              value={settings.preferredIndustry}
              onChange={(nextValue) => setPreferredIndustry(nextValue)}
              options={industryOptions.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              ariaLabel="选择领域偏好"
              className="mt-4"
              menuClassName="max-h-64 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            />
          </section>

          <section className="theme-modal-section rounded-[1.6rem] p-5">
            <p className="accent-text text-sm font-semibold uppercase tracking-[0.18em]">
              外观设置
            </p>
            <SelectMenu
              value={settings.appearance}
              onChange={(nextValue) => setAppearance(nextValue)}
              options={appearanceOptions.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              ariaLabel="选择外观设置"
              className="mt-4"
            />
          </section>

          <section className="theme-modal-section rounded-[1.6rem] p-5">
            <div>
              <div>
                <p className="accent-text text-sm font-semibold uppercase tracking-[0.18em]">
                  数据安全
                </p>
                <p className="text-secondary mt-2 text-sm leading-7">
                  自动保存到本地，并保留备份。
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="theme-modal-stat flex h-12 items-center rounded-[1.4rem] px-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-muted text-sm">当前词数</p>
                  <p className="text-primary text-lg font-semibold">{words.length}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => exportLibrary(settings)}
                className="theme-button-secondary h-12 rounded-full px-5 text-sm font-semibold transition hover:opacity-90 sm:justify-self-end"
              >
                导出备份
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
