"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SectionNavVisibility } from "@/lib/sectionNavVisibility";

const SectionNavContext = createContext<SectionNavVisibility | null>(null);

export function SectionNavProvider({
  value,
  children,
}: {
  value: SectionNavVisibility;
  children: ReactNode;
}) {
  return <SectionNavContext.Provider value={value}>{children}</SectionNavContext.Provider>;
}

/** Visibility flags for landing-page section anchors (desktop nav, mobile menu, footer). */
export function useSectionNav(): SectionNavVisibility {
  const ctx = useContext(SectionNavContext);
  if (ctx) return ctx;
  // Safe default when provider is missing (e.g. isolated tests)
  return {
    menu: true,
    lovedPlates: true,
    market: true,
    science: true,
    reels: true,
    testimonials: true,
    plans: true,
    contact: true,
  };
}
