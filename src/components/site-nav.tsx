"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsModal } from "@/components/settings-modal";

const navigationItems = [
  { href: "/words", label: "学习" },
  { href: "/insights", label: "数据" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-xl"
        style={{
          borderColor: "var(--border-soft)",
          backgroundColor: "color-mix(in srgb, var(--panel-strong) 82%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-muted text-xs font-semibold uppercase tracking-[0.28em]">
              Personal Vocabulary
            </p>
            <h1 className="text-primary text-lg font-semibold">专业词汇库</h1>
          </div>
          <div className="flex items-center gap-3">
            <nav
              className="flex items-center gap-2 rounded-full p-1 shadow-[0_12px_35px_rgba(120,95,75,0.08)]"
              style={{
                border: "1px solid var(--border-soft)",
                backgroundColor: "color-mix(in srgb, var(--panel-strong) 75%, transparent)",
              }}
              >
              {navigationItems.map((item) => {
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "shadow-[0_12px_20px_rgba(217,119,69,0.3)]"
                        : "text-secondary"
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor: "var(--accent)",
                            color: "#ffffff",
                          }
                        : {
                            backgroundColor: "transparent",
                          }
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              aria-label="打开用户设置"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full shadow-[0_12px_35px_rgba(120,95,75,0.08)] transition hover:-translate-y-0.5"
              style={{
                border: "1px solid var(--border-soft)",
                backgroundColor: "color-mix(in srgb, var(--panel-strong) 80%, transparent)",
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
              >
                <circle cx="12" cy="8" r="3.2" className="text-secondary" />
                <path
                  d="M5.5 19.2c1.5-3 4-4.5 6.5-4.5s5 1.5 6.5 4.5"
                  className="text-secondary"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <SettingsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
