"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "./actions";

export default function AdminNav() {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/admin" className="font-heading font-bold text-drd-text">
          Dr.Diet Admin
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/admin"
            className={`text-sm ${pathname === "/admin" ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/settings"
            className={`text-sm ${pathname === "/admin/settings" ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Settings
          </Link>
          <Link
            href="/admin/categories"
            className={`text-sm ${pathname?.startsWith("/admin/categories") ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Categories
          </Link>
          <Link
            href="/admin/meals"
            className={`text-sm ${pathname?.startsWith("/admin/meals") ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Meals
          </Link>
          <Link
            href="/admin/hero"
            className={`text-sm ${pathname?.startsWith("/admin/hero") ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Hero
          </Link>
          <Link
            href="/admin/plates"
            className={`text-sm ${pathname?.startsWith("/admin/plates") ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Plates
          </Link>
          <Link
            href="/admin/loved-plates"
            className={`text-sm ${pathname?.startsWith("/admin/loved-plates") ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Loved Plates
          </Link>
          <Link
            href="/admin/videos"
            className={`text-sm ${pathname?.startsWith("/admin/videos") ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Videos
          </Link>
          <Link
            href="/admin/testimonials"
            className={`text-sm ${pathname?.startsWith("/admin/testimonials") ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Testimonials
          </Link>
          <Link
            href="/admin/plans"
            className={`text-sm ${pathname?.startsWith("/admin/plans") ? "text-drd-primary font-medium" : "text-drd-text/70 hover:text-drd-primary"}`}
          >
            Plans
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-sm text-drd-text/70 hover:text-drd-primary"
          >
            View Site
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm text-drd-muted hover:text-drd-accent"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
