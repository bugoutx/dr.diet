"use client";

import Image from "next/image";
import { useCallback } from "react";
import { useLang } from "@/lib/LangContext";
import { NAV_ITEMS, scrollToSection } from "@/lib/navLinks";

type FooterSettings = {
  instagramUrl?: string | null;
  instagramHandle?: string | null;
};

export default function FooterSection({ settings }: { settings?: FooterSettings | null }) {
  const { lang } = useLang();
  const instagramHref = settings?.instagramUrl || "https://instagram.com/dr.diet.sy";
  const instagramLabel = settings?.instagramHandle || "Instagram";
  const isRtl = lang === "ar";
  const year = new Date().getFullYear();

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    scrollToSection(sectionId, isMobile);
  }, []);

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="relative bg-drd-primary-dark border-t border-drd-accent/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-12 lg:px-8">
        <div className="flex flex-col items-center gap-10 text-center md:grid md:grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,auto)] md:items-center md:gap-6 md:text-start lg:gap-10">
          {/* Logo + slogan */}
          <div
            className={`flex w-full max-w-sm flex-col items-center gap-2 md:max-w-none md:w-auto ${
              isRtl ? "md:items-end md:text-right" : "md:items-start md:text-left"
            }`}
          >
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "hero")}
              className="inline-flex shrink-0 transition-opacity hover:opacity-85"
              aria-label={isRtl ? "د.دايت — الصفحة الرئيسية" : "Dr.Diet — Home"}
            >
              <Image
                src="/images/logo-text-green-cut.png"
                alt="Dr.Diet"
                width={160}
                height={46}
                className="h-9 w-auto object-contain md:h-10"
              />
            </a>
            <p className="font-heading text-sm font-medium italic leading-snug text-white/80">
              {isRtl ? "لا تأكل أقل، كل صح" : "Don't eat less, eat Right."}
            </p>
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-xs font-medium text-white/70 transition-colors hover:text-white"
            >
              {instagramLabel}
            </a>
          </div>

          {/* Section links */}
          <nav
            aria-label={isRtl ? "روابط الأقسام" : "Section links"}
            className="flex w-full max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-2.5 md:max-w-none"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-sm font-medium tracking-tight text-white/80 transition-colors hover:text-white underline-offset-4 hover:underline decoration-white/30"
              >
                {isRtl ? item.labelAr : item.labelEn}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <div
            className={`w-full border-t border-white/10 pt-8 md:w-auto md:border-t-0 md:pt-0 ${
              isRtl ? "md:text-left" : "md:text-right"
            }`}
          >
            <p className="text-xs leading-relaxed text-white/60">
              {isRtl ? (
                <>
                  © {year} د.دايت. جميع الحقوق محفوظة
                  <br />
                  <span className="text-white/40">مصمم لحياة صحية</span>
                </>
              ) : (
                <>
                  © {year} DR.DIET. All rights reserved.
                  <br />
                  <span className="text-white/40">Designed for healthy living</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
