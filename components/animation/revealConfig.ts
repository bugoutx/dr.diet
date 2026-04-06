/**
 * Shared animation config for landing page reveals.
 * Keeps movement subtle and durations short for performance.
 */

/** Premium ease-out: fast start, smooth end */
export const REVEAL_EASE = [0.25, 0.46, 0.45, 0.94] as const;

/** Viewport: trigger once, start when ~20–30% visible */
export const REVEAL_VIEWPORT = { once: true, amount: 0.25 } as const;

/** Max movement (px) to keep motion subtle */
export const REVEAL_DISTANCE = {
  y: 22,
  x: 16,
} as const;

/** Scale range for subtle zoom (0.97–1) */
export const REVEAL_SCALE = { from: 0.98, to: 1 } as const;

/** Stagger delay between children (s) */
export const STAGGER_DELAY = 0.08;

/** Reduced motion: duration for opacity-only */
export const REDUCED_MOTION_DURATION = 0.35;
