"use client";

import { useEffect } from "react";
import { industryOptions } from "@/lib/industry";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useWordLibrary } from "@/hooks/use-word-library";

const appearanceOptions = [
  { value: "system", label: "跟随系统", hint: "自动跟随设备当前主题" },
  { value: "light", label: "浅色", hint: "始终保持浅色界面" },
  { value: "dark", label: "深色", hint: "始终保持深色界面" },
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
    lastSavedAt: settingsLastSavedAt,
    recoveredFromBackup: settingsRecoveredFromBackup,
  } = useUserSettings();
  const {
    exportLibrary,
    lastSavedAt: wordsLastSavedAt,
    recoveredFromBackup: wordsRecoveredFromBackup,
    words,
  } = useWordLibrary();
  const currentIndustry = industryOptions.find(
    (item) => item.value === settings.preferredIndustry,
  );
  const currentAppearance = appearanceOptions.find(
    (item) => item.value === settings.appearance,
  );
  const latestSavedAt = [wordsLastSavedAt, settingsLastSavedAt]
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];
  const hasRecoveredFromBackup = wordsRecoveredFromBackup || settingsRecoveredFromBackup;
  const savedTimeLabel = latestSavedAt
    ? new Intl.DateTimeFormat("zh-CN", {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        month: "2-digit",
      }).format(new Date(latestSavedAt))
    : "刚刚";

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
        className="theme-modal relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-muted text-sm font-semibold uppercase tracking-[0.22em]">
              用户中心
            </p>
            <h2 id="settings-modal-title" className="text-primary mt-2 text-3xl font-semibold">
              设置与个人偏好
            </h2>
            <p className="text-secondary mt-3 max-w-2xl text-sm leading-7">
              行业语境、外观模式和数据备份都收在这里，主界面保持更轻更专注。
            </p>
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
              行业设置
            </p>
            <p className="text-secondary mt-2 text-sm leading-7">
              录入新单词时，系统会优先按照你所在行业解释含义和使用场景。
            </p>
            <select
              value={settings.preferredIndustry}
              onChange={(event) =>
                setPreferredIndustry(event.target.value as typeof settings.preferredIndustry)
              }
              className="theme-modal-input mt-5 h-14 w-full rounded-[1.2rem] px-4 text-base outline-none transition focus:ring-4"
              style={{
                borderColor: "var(--border-strong)",
                boxShadow: "0 0 0 0 rgba(0,0,0,0)",
              }}
            >
              {industryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-muted mt-3 text-sm">
              当前：{currentIndustry?.label}，{currentIndustry?.hint}
            </p>
          </section>

          <section className="theme-modal-section rounded-[1.6rem] p-5">
            <p className="accent-text text-sm font-semibold uppercase tracking-[0.18em]">
              外观设置
            </p>
            <p className="text-secondary mt-2 text-sm leading-7">
              你可以选择跟随系统，也可以固定使用浅色或深色模式。
            </p>
            <select
              value={settings.appearance}
              onChange={(event) =>
                setAppearance(event.target.value as typeof settings.appearance)
              }
              className="theme-modal-input mt-5 h-14 w-full rounded-[1.2rem] px-4 text-base outline-none transition focus:ring-4"
              style={{
                borderColor: "var(--border-strong)",
                boxShadow: "0 0 0 0 rgba(0,0,0,0)",
              }}
            >
              {appearanceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-muted mt-3 text-sm">
              当前：{currentAppearance?.label}
            </p>
            <p className="text-secondary mt-2 text-sm leading-7">
              {currentAppearance?.hint}
            </p>
          </section>

          <section className="theme-modal-section rounded-[1.6rem] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="accent-text text-sm font-semibold uppercase tracking-[0.18em]">
                  数据安全
                </p>
                <p className="text-secondary mt-2 text-sm leading-7">
                  关键数据会自动写入 localStorage，并保留多份本地滚动备份。主数据异常时，会优先用最近备份自动恢复。
                </p>
              </div>
              <button
                type="button"
                onClick={() => exportLibrary(settings)}
                className="theme-button-secondary rounded-full px-5 py-3 text-sm font-semibold transition hover:opacity-90"
              >
                导出备份
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="theme-modal-stat rounded-[1.4rem] p-4">
                <p className="text-muted text-sm">当前词数</p>
                <p className="text-primary mt-2 text-3xl font-semibold">
                  {words.length}
                </p>
              </div>
              <div className="theme-modal-stat rounded-[1.4rem] p-4">
                <p className="text-muted text-sm">保存方式</p>
                <p className="text-primary mt-2 text-lg font-semibold">
                  localStorage
                </p>
              </div>
              <div className="theme-modal-stat rounded-[1.4rem] p-4">
                <p className="text-muted text-sm">最近保存</p>
                <p className="text-primary mt-2 text-lg font-semibold">
                  {savedTimeLabel}
                </p>
              </div>
            </div>
            <p className="text-muted mt-4 text-sm leading-7">
              {hasRecoveredFromBackup
                ? "检测到最近一次已通过本地备份恢复，当前数据已经重新写回主存储。"
                : "当前处于自动保存状态，词卡与设置改动会立即写入本地存储。"}{" "}
              你也可以随时导出一份 JSON 备份。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
