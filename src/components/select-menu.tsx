"use client";

import { useEffect, useId, useRef, useState } from "react";

type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectMenuProps<T extends string> = {
  value: T;
  options: Array<SelectOption<T>>;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  menuClassName?: string;
};

export function SelectMenu<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
  triggerClassName,
  triggerStyle,
  menuClassName,
}: SelectMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleEscape as unknown as EventListener, true);
    window.addEventListener("resize", handleEscape as unknown as EventListener);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleEscape as unknown as EventListener, true);
      window.removeEventListener("resize", handleEscape as unknown as EventListener);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={`theme-select-trigger h-14 w-full rounded-[1.2rem] pl-4 pr-14 text-left text-base outline-none ${triggerClassName ?? ""}`}
        style={triggerStyle}
      >
        <span className="block truncate">{selectedOption?.label}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute right-5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[0.9rem] text-secondary transition ${open ? "rotate-180" : ""}`}
        >
          ˅
        </span>
      </button>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className={`theme-select-menu absolute left-0 right-0 top-[calc(100%+0.65rem)] z-30 rounded-[1.4rem] p-2 ${menuClassName ?? ""}`}
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`theme-select-option w-full rounded-[1rem] px-4 py-3 text-left text-sm font-medium ${active ? "is-active" : ""}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
