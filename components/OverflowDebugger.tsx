"use client";

import { useEffect, useRef } from "react";

/**
 * Dev-only helper to highlight elements that cause PAGE-LEVEL horizontal overflow.
 * Only runs when document is actually wider than viewport (scrollWidth > innerWidth).
 * Ignores elements that are off-screen only because they sit inside a scrollable
 * carousel (overflow-x: auto) to avoid false positives.
 */
export default function OverflowDebugger() {
  const flaggedRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const scan = () => {
      const vw = window.innerWidth;
      const docEl = document.documentElement;
      const scrollWidth = docEl.scrollWidth;

      // Clear outlines from previous run
      flaggedRef.current.forEach((el) => {
        el.style.outline = "";
      });
      flaggedRef.current = [];

      // Only flag when the page actually overflows (no horizontal scroll on body)
      if (scrollWidth <= vw + 1) return;

      const newlyFlagged: HTMLElement[] = [];

      /** True if el is inside an ancestor that clips horizontally (overflow-x auto/scroll/hidden) */
      const isInsideScrollContainer = (el: HTMLElement): boolean => {
        let node: HTMLElement | null = el.parentElement;
        while (node && node !== document.body) {
          const style = getComputedStyle(node);
          const ox = style.overflowX;
          if (ox === "auto" || ox === "scroll" || ox === "hidden") return true;
          node = node.parentElement;
        }
        return false;
      };

      const all = Array.from(document.body.querySelectorAll<HTMLElement>("*"));
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        const overflowsLeft = rect.left < -1;
        const overflowsRight = rect.right > vw + 1;
        if (!overflowsLeft && !overflowsRight) continue;

        // Ignore elements that are only off-screen because they're inside a carousel/scroll area
        if (isInsideScrollContainer(el)) continue;

        el.style.outline = "2px solid red";
        newlyFlagged.push(el);
        console.warn("[OverflowDebugger] Page overflow element", {
          element: el,
          className: el.className,
          rect,
        });
      }

      flaggedRef.current = newlyFlagged;
    };

    // Initial scan and on resize/orientation changes
    scan();
    let resizeTimeout: number | undefined;
    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(scan, 150);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      flaggedRef.current.forEach((el) => {
        el.style.outline = "";
      });
      flaggedRef.current = [];
    };
  }, []);

  return null;
}

