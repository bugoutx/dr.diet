"use client";

import { createContext, useContext, type ReactNode } from "react";

const InAppBrowserContext = createContext(false);

/** Provides whether the page is being viewed inside a social-app in-app browser. */
export function InAppBrowserProvider({
  value,
  children,
}: {
  value: boolean;
  children: ReactNode;
}) {
  return <InAppBrowserContext.Provider value={value}>{children}</InAppBrowserContext.Provider>;
}

/** True when rendered inside an in-app browser (Instagram, Facebook, etc.). */
export function useIsInAppBrowser(): boolean {
  return useContext(InAppBrowserContext);
}
