"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeMotionWidth(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(max-width: 768px)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMotionDurationSnapshot(): number {
  if (typeof window === "undefined") return 0.55;
  return window.matchMedia("(max-width: 768px)").matches ? 0.42 : 0.55;
}

/**
 * Returns true when the user prefers reduced motion (system or browser setting).
 * When true, animations should use opacity-only or be disabled.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
}

/**
 * Returns duration in seconds: shorter on mobile for snappier feel.
 * Desktop: 0.45–0.7s, Mobile: 0.35–0.5s.
 */
export function useMotionDuration(): number {
  return useSyncExternalStore(
    subscribeMotionWidth,
    getMotionDurationSnapshot,
    () => 0.55
  );
}

/**
 * Single hook for reveal animations: reduced motion + duration.
 */
export function useMotionConfig(): {
  reducedMotion: boolean;
  duration: number;
} {
  const reducedMotion = useReducedMotion();
  const duration = useMotionDuration();
  return { reducedMotion, duration };
}
