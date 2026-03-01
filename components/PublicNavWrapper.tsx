"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

/**
 * Renders the landing page Navbar only on public routes.
 * On /admin/* routes nothing is rendered so AdminNavbar (in admin layout) is the only nav.
 */
export default function PublicNavWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Navbar />;
}
