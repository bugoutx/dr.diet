"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { NAV_ITEMS, scrollToSection } from "@/lib/navLinks";
import { useSectionNav } from "@/lib/SectionNavContext";
import { filterNavItemsByVisibility } from "@/lib/sectionNavVisibility";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLang();
  const sectionNav = useSectionNav();
  const navItems = filterNavItemsByVisibility(NAV_ITEMS, sectionNav);
  const isRtl = lang === "ar";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      scrollToSection(sectionId, isMobile);
      setMobileOpen(false);
    },
    []
  );

  return (
    <nav
      dir={isRtl ? "rtl" : "ltr"}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#dfe8d6] shadow-sm"
          : "bg-white/85 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] md:h-[88px] max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, "hero")}
          className="flex items-center shrink-0"
          aria-label={isRtl ? "الدكتور دايت" : "Dr.Diet"}
        >
          <Image
            src="/images/logo-text-green-cut.png"
            alt="Dr.Diet"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className="px-3 py-2 text-sm font-medium tracking-tight text-drd-text/90 hover:text-drd-primary transition-colors rounded-lg hover:bg-drd-primary/5"
            >
              {isRtl ? item.labelAr : item.labelEn}
            </a>
          ))}
        </div>

        {/* Right: language switcher (desktop) + mobile menu button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-drd-primary/30 rounded-full p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${lang === "en" ? "bg-drd-primary text-white" : "text-drd-text/70 hover:text-drd-primary"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${lang === "ar" ? "bg-drd-primary text-white" : "text-drd-text/70 hover:text-drd-primary"}`}
            >
              AR
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-drd-text hover:bg-drd-primary/10 hover:text-drd-primary transition-colors"
            aria-expanded={mobileOpen}
            aria-label={isRtl ? "القائمة" : "Menu"}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md border-b border-[#dfe8d6] shadow-lg rounded-b-2xl overflow-hidden"
          role="dialog"
          aria-label={isRtl ? "روابط الأقسام" : "Section links"}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="block px-4 py-3 text-base font-medium text-drd-text hover:text-drd-primary hover:bg-drd-primary/5 rounded-xl transition-colors"
                >
                  {isRtl ? item.labelAr : item.labelEn}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
