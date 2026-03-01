"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/LangContext";
import { signOutAction } from "./actions";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/meals", label: "Meals" },
  { href: "/admin/loved-plates", label: "Loved Plates" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export default function AdminNavbar() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link
          href="/admin"
          className="font-heading text-lg font-bold text-drd-text shrink-0 hover:text-drd-primary transition-colors"
        >
          Dr.Diet Admin
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {ADMIN_LINKS.map(({ href, label }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-drd-primary/10 text-drd-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-drd-text"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="ml-2 flex shrink-0 items-center gap-1 border-l border-slate-200 pl-3">
            <div className="flex items-center gap-0.5 rounded-full border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  lang === "en"
                    ? "bg-drd-primary text-white"
                    : "text-slate-500 hover:text-drd-primary"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("ar")}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  lang === "ar"
                    ? "bg-drd-primary text-white"
                    : "text-slate-500 hover:text-drd-primary"
                }`}
              >
                AR
              </button>
            </div>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-drd-primary"
            >
              View Site
            </Link>
            <form action={signOutAction} className="inline">
              <button
                type="submit"
                className="rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-drd-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </div>
    </header>
  );
}
