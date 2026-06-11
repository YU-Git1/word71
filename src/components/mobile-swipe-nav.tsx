"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const PAGE_ORDER = ["/words", "/insights"] as const;
const MOBILE_MAX_WIDTH = 768;
const SWIPE_THRESHOLD = 72;
const VERTICAL_TOLERANCE = 44;

function getPageIndex(pathname: string) {
  return PAGE_ORDER.findIndex((path) => pathname.startsWith(path));
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      "input, textarea, select, button, a, [role='dialog'], [data-no-swipe='true']",
    ),
  );
}

export function MobileSwipeNav() {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const blockedRef = useRef(false);

  useEffect(() => {
    const currentIndex = getPageIndex(pathname);
    if (currentIndex === -1) {
      return;
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (window.innerWidth > MOBILE_MAX_WIDTH || event.touches.length !== 1) {
        blockedRef.current = true;
        return;
      }

      if (isInteractiveTarget(event.target)) {
        blockedRef.current = true;
        return;
      }

      blockedRef.current = false;
      touchStartXRef.current = event.touches[0].clientX;
      touchStartYRef.current = event.touches[0].clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (blockedRef.current || event.changedTouches.length !== 1) {
        return;
      }

      const deltaX = event.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = event.changedTouches[0].clientY - touchStartYRef.current;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaY) > VERTICAL_TOLERANCE) {
        return;
      }

      if (deltaX < 0 && currentIndex < PAGE_ORDER.length - 1) {
        router.push(PAGE_ORDER[currentIndex + 1]);
      }

      if (deltaX > 0 && currentIndex > 0) {
        router.push(PAGE_ORDER[currentIndex - 1]);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pathname, router]);

  return null;
}
