"use client";

import Image, { type ImageProps } from "next/image";
import { useIsInAppBrowser } from "@/lib/InAppBrowserContext";

/**
 * Drop-in replacement for next/image that loads eagerly inside in-app browsers
 * (Instagram, Facebook, …), where native `loading="lazy"` is unreliable and can
 * leave images blank. Outside in-app browsers it behaves exactly like next/image.
 */
export default function SmartImage(props: ImageProps) {
  const inApp = useIsInAppBrowser();
  // `priority` images are already eager; never set `loading` alongside it (next/image throws).
  const loading = inApp && !props.priority ? "eager" : props.loading;
  return <Image {...props} loading={loading} />;
}
