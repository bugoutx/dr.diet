"use client";

import { useEffect } from "react";
import { useIsInAppBrowser } from "@/lib/InAppBrowserContext";

/**
 * Safety net for social-app in-app browsers (Instagram, Facebook, …).
 *
 * Those webviews don't reliably fire IntersectionObserver, so framer-motion's
 * `whileInView` reveal animations never run and the wrapped media (hero images,
 * menu/market/best-seller photos, reel videos) stays stuck at `opacity: 0`.
 *
 * We (1) nudge any IntersectionObservers awake by dispatching scroll/resize, and
 * (2) as a fallback, force-reveal any element framer-motion left fully transparent.
 * Only `opacity` is touched (never `transform`) so carousel/3D layouts are unaffected.
 * Runs only inside in-app browsers — normal browsers are untouched.
 */
export default function InAppMediaReveal() {
  const inApp = useIsInAppBrowser();

  useEffect(() => {
    if (!inApp) return;

    const wake = () => {
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("resize"));
    };

    const forceReveal = () => {
      document.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
        // Exactly "0" is framer-motion's hidden reveal state — leave 0.x overlays alone.
        if (el.style.opacity === "0") {
          el.style.opacity = "1";
          // Clear the paired entrance transform (translate/rotate/scale) so the element
          // settles at its final resting position. Safe to do only on reveal-hidden
          // elements — carousel/3D positioning transforms are never at opacity 0.
          if (el.style.transform) el.style.transform = "none";
        }
      });
      // Reel videos gate playback on an IntersectionObserver flag that may never fire
      // in-app, leaving a blank frame. Nudge them into muted autoplay (allowed on iOS).
      document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
        v.muted = true;
        v.playsInline = true;
        if (v.paused) v.play().catch(() => {});
      });
    };

    wake();
    const timers = [250, 800, 1600, 2800, 4500].map((t) =>
      window.setTimeout(() => {
        wake();
        forceReveal();
      }, t)
    );

    return () => timers.forEach(clearTimeout);
  }, [inApp]);

  return null;
}
