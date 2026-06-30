"use client";

import { useEffect, useRef, useState } from "react";
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
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const clearResumeTimer = () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollYRef.current);

      if (currentScrollY <= 8) {
        setHidden(false);
        clearResumeTimer();
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (delta > 6) {
        setHidden(true);
        lastScrollYRef.current = currentScrollY;
      }

      clearResumeTimer();
      resumeTimerRef.current = window.setTimeout(() => {
        setHidden(false);
      }, 300);
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearResumeTimer();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-xl transition-all duration-300 ${
          hidden
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
        style={{
          borderColor: "var(--border-soft)",
          backgroundColor: "color-mix(in srgb, var(--panel-strong) 82%, transparent)",
          boxShadow: "0 10px 28px rgba(120,95,75,0.08)",
          transitionTimingFunction: hidden
            ? "cubic-bezier(0.4, 0, 1, 1)"
            : "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-primary text-lg font-semibold">我的单词卡</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav
              className="flex items-center gap-6 rounded-full px-2 py-1"
              style={{
                backgroundColor: "color-mix(in srgb, var(--panel-strong) 48%, transparent)",
              }}
            >
              {navigationItems.map((item) => {
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-1 py-2 text-base font-semibold transition"
                    style={
                      active
                        ? {
                            color: "var(--text-primary)",
                          }
                        : {
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    {item.label}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-[calc(100%_-_4px)] h-1 w-6 -translate-x-1/2 rounded-full"
                        style={{
                          backgroundColor: "var(--accent)",
                        }}
                      />
                    ) : null}
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
                viewBox="0 0 48 48"
                className="h-6 w-6"
                fill="none"
              >
                <path
                  d="M18.2838 43.1713C14.9327 42.1736 11.9498 40.3213 9.58787 37.867C10.469 36.8227 11 35.4734 11 34.0001C11 30.6864 8.31371 28.0001 5 28.0001C4.79955 28.0001 4.60139 28.01 4.40599 28.0292C4.13979 26.7277 4 25.3803 4 24.0001C4 21.9095 4.32077 19.8938 4.91579 17.9995C4.94381 17.9999 4.97188 18.0001 5 18.0001C8.31371 18.0001 11 15.3138 11 12.0001C11 11.0488 10.7786 10.1493 10.3846 9.35011C12.6975 7.1995 15.5205 5.59002 18.6521 4.72314C19.6444 6.66819 21.6667 8.00013 24 8.00013C26.3333 8.00013 28.3556 6.66819 29.3479 4.72314C32.4795 5.59002 35.3025 7.1995 37.6154 9.35011C37.2214 10.1493 37 11.0488 37 12.0001C37 15.3138 39.6863 18.0001 43 18.0001C43.0281 18.0001 43.0562 17.9999 43.0842 17.9995C43.6792 19.8938 44 21.9095 44 24.0001C44 25.3803 43.8602 26.7277 43.594 28.0292C43.3986 28.01 43.2005 28.0001 43 28.0001C39.6863 28.0001 37 30.6864 37 34.0001C37 35.4734 37.531 36.8227 38.4121 37.867C36.0502 40.3213 33.0673 42.1736 29.7162 43.1713C28.9428 40.752 26.676 39.0001 24 39.0001C21.324 39.0001 19.0572 40.752 18.2838 43.1713Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 31C27.866 31 31 27.866 31 24C31 20.134 27.866 17 24 17C20.134 17 17 20.134 17 24C17 27.866 20.134 31 24 31Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
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

