"use client";

import { usePathname } from "next/navigation";
import OverflowDebugger from "./OverflowDebugger";

/**
 * Only runs the overflow debugger on public (non-admin) routes.
 */
export default function OverflowDebugWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <OverflowDebugger />;
}

