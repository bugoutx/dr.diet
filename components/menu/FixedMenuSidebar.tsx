"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

const SIDEBAR_WIDTH = 260;

export type FixedMenuSidebarCategory = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type Props = {
  visible: boolean;
  left?: number;
  right?: number;
  top: number;
  categories: FixedMenuSidebarCategory[];
  activeId: string;
  onCategoryClick: (id: string) => void;
};

export function FixedMenuSidebar({
  visible,
  left,
  right,
  top,
  categories,
  activeId,
  onCategoryClick,
}: Props) {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);

  /* Portal + document.body: defer render until after mount so SSR and first paint stay aligned. */
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  const sidebarTitle = lang === "ar" ? "القائمة" : "MENU";

  const sidebar = (
    <div
      dir="ltr"
      className={`fixed z-[100] hidden md:block w-[260px] bg-white/95 backdrop-blur-sm border-r border-slate-100 shadow-sm overflow-y-auto hide-scrollbar transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      style={{
        ...(right !== undefined ? { right: `${right}px` } : { left: `${left ?? 0}px` }),
        top: `${top}px`,
        width: SIDEBAR_WIDTH,
        maxHeight: `calc(100vh - ${top + 24}px)`,
      }}
    >
      <div className={`p-4 ${lang === "ar" ? "text-right" : "text-left"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-drd-text/60 mb-4">
          {sidebarTitle}
        </h2>
        <nav className="space-y-1" aria-label="Menu categories">
          {categories.map((cat) => {
            const isActive = activeId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryClick(cat.id)}
                className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-full py-2 pl-3 pr-3 text-sm transition-colors duration-200 ${lang === "ar" ? "text-right" : "text-left"} ${
                  isActive
                    ? "border-l-2 border-drd-primary bg-drd-primary font-semibold text-white shadow-md"
                    : "border-l-2 border-transparent bg-transparent font-medium text-drd-text/70 hover:bg-drd-primary/5"
                }`}
              >
                <span
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  className={`truncate max-w-full ${lang === "ar" ? "text-right" : ""}`}
                >
                  {tField(lang, cat.nameEn, cat.nameAr)}
                </span>
                {isActive && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return createPortal(sidebar, document.body);
}
