"use client";

import { useRef, useState, useEffect } from "react";
import SmartImage from "@/components/SmartImage";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";
import { formatPrice } from "@/lib/formatNumber";
import { formatMacros } from "@/lib/formatMacro";
import MarketItemModal, { type MarketItemShape } from "@/components/MarketItemModal";
import DecorativeVeggies from "@/components/DecorativeVeggies";

/* Bottom overlay gradient: soft green-tinted dark to transparent (site palette) */
const OVERLAY_GRADIENT =
  "linear-gradient(to top, rgba(15,118,72,0.5), rgba(0,0,0,0.6), rgba(0,0,0,0))";

export type MarketCategoryShape = {
  id: string;
  nameEn: string;
  nameAr: string;
  order: number;
  items: {
    id: string;
    nameEn: string;
    nameAr: string;
    descriptionEn?: string | null;
    descriptionAr?: string | null;
    price?: number | null;
    image: string;
    protein?: number | null;
    carbs?: number | null;
    calories?: number | null;
    order: number;
  }[];
};

export type MarketSectionTitle = {
  titleEn: string;
  titleAr?: string;
  subtitleEn: string;
  subtitleAr?: string;
};

type Props = {
  categories: MarketCategoryShape[];
  sectionTitle?: MarketSectionTitle;
};

const CARD_WIDTH = 320;
const CARD_GAP = 16;
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

export default function MarketSection({ categories, sectionTitle }: Props) {
  const { lang } = useLang();
  /** User-picked tab; falls back to first category when unset or stale */
  const [pickedCategoryId, setPickedCategoryId] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<MarketItemShape | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasNudged = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const resolvedCategoryId =
    pickedCategoryId && categories.some((c) => c.id === pickedCategoryId)
      ? pickedCategoryId
      : categories[0]?.id ?? null;
  const activeCategory = resolvedCategoryId
    ? categories.find((c) => c.id === resolvedCategoryId)
    : undefined;
  const items = activeCategory?.items ?? [];

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }

  // Scroll hint: nudge once per category (same as Menu CategoryRowCarousel)
  useEffect(() => {
    if (hasNudged.current || !scrollRef.current || items.length <= 1) return;
    hasNudged.current = true;
    const el = scrollRef.current;
    const t = setTimeout(() => {
      el.scrollBy({ left: 8, behavior: "smooth" });
      const t2 = setTimeout(() => {
        el.scrollBy({ left: -8, behavior: "smooth" });
      }, 400);
      return () => clearTimeout(t2);
    }, 600);
    return () => clearTimeout(t);
  }, [items.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: 0 });
    hasNudged.current = false;
    updateScrollState();
  }, [resolvedCategoryId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [resolvedCategoryId, items.length]);

  // Dev self-check: row must have scrollWidth > clientWidth to be scrollable (remove after verifying)
  useEffect(() => {
    if (typeof process !== "undefined" && process.env.NODE_ENV !== "development") return;
    const el = scrollRef.current;
    if (!el || items.length === 0) return;
    const raf = requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      const { scrollWidth, clientWidth } = scrollRef.current;
      console.log("[MarketRow] scrollWidth/clientWidth", scrollWidth, clientWidth, scrollWidth > clientWidth ? "(scrollable)" : "(NOT scrollable - fix card widths)");
    });
    return () => cancelAnimationFrame(raf);
  }, [resolvedCategoryId, items.length]);

  const title = sectionTitle
    ? tField(lang, sectionTitle.titleEn, sectionTitle.titleAr ?? sectionTitle.titleEn)
    : (lang === "ar" ? "سوق د.دايت" : "Dr.Diet Market");
  const subtitle = sectionTitle
    ? tField(lang, sectionTitle.subtitleEn, sectionTitle.subtitleAr ?? sectionTitle.subtitleEn)
    : (lang === "ar" ? "وجبات خفيفة ومنتجات صحية لدعم أهدافك." : "Healthy snacks and products to support your goals.");

  if (categories.length === 0) return null;

  return (
    <section
      id="market"
      className="relative w-full min-w-0 overflow-x-hidden py-12 md:py-16 bg-drd-bg/50"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <DecorativeVeggies section="market" />
      <div className="relative z-10 mx-auto w-full max-w-6xl min-w-0 px-4 sm:px-6">
        <header className="mb-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-drd-text">
              {title}
            </h2>
            <p
              className="mt-3 text-base md:text-lg text-drd-muted text-center"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {subtitle}
            </p>
          </div>
        </header>

        {/* Category chips */}
        <div className="w-full min-w-0 overflow-x-auto hide-scrollbar pb-4" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="flex gap-2 justify-center md:justify-start min-w-max px-1">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategory?.id;
              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  onClick={() => setPickedCategoryId(cat.id)}
                  animate={{
                    scale: isActive ? 1.03 : 1,
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border ${
                    isActive
                      ? "bg-gradient-to-r from-drd-primary to-drd-accent text-white shadow-md"
                      : "bg-white/90 border-slate-200 text-drd-text hover:border-drd-primary/50 shadow-sm"
                  }`}
                >
                  {tField(lang, cat.nameEn, cat.nameAr)}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Items row: EXACT structure as Menu CategoryRowCarousel (outer wrapper, z-0 fades, z-10 scroller) */}
        <div className="relative mt-3 w-full overflow-x-hidden">
          {/* Left/right fades: MUST be pointer-events-none and z-0 so they don't block touch */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-drd-bg/80 to-transparent z-0"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-drd-bg/80 to-transparent z-0"
            aria-hidden
          />

          <div
            ref={scrollRef}
            data-allow-x-scroll="true"
            className="relative z-10 flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-4 pb-4 pr-8 hide-scrollbar overscroll-x-contain"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x pan-y pinch-zoom",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeCategory?.id ?? "empty"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex gap-4 shrink-0 w-max"
              >
                {items.map((item) => {
                  const macros = formatMacros(lang, {
                    proteinG: item.protein ?? undefined,
                    carbsG: item.carbs ?? undefined,
                    calories: item.calories ?? undefined,
                  });
                  const name = tField(lang, item.nameEn, item.nameAr);
                  const description = tField(lang, item.descriptionEn, item.descriptionAr);
                  return (
                    <div
                      key={item.id}
                      className="snap-start shrink-0 w-[260px] sm:w-[280px]"
                      style={{ touchAction: "pan-x pan-y pinch-zoom" }}
                    >
                    <button
                      type="button"
                      onClick={() => setModalItem(item)}
                      className="block w-full text-left rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-200/80 hover:border-drd-primary/50 bg-slate-100"
                    >
                      {/* Full-bleed card: single aspect-ratio container, image + overlays only */}
                      <div className="relative w-full aspect-[3/4] md:aspect-[4/5]">
                        <SmartImage
                          src={item.image}
                          alt={name || item.id}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 260px, 320px"
                        />
                        {/* Bottom overlay: gradient + name, description, price */}
                        <div
                          className={`absolute inset-x-0 bottom-0 z-10 p-3 md:p-4 flex flex-col justify-end ${lang === "ar" ? "text-right items-end" : "text-left items-start"}`}
                          style={{ background: OVERLAY_GRADIENT }}
                          dir={lang === "ar" ? "rtl" : "ltr"}
                        >
                          <h3 className={`font-bold font-heading text-white text-base leading-tight line-clamp-1 w-full ${lang === "ar" ? "text-right" : "text-left"}`}>
                            {name}
                          </h3>
                          {description?.trim() && (
                            <p className={`mt-1 text-white/80 text-xs leading-snug line-clamp-2 w-full ${lang === "ar" ? "text-right" : "text-left"}`}>
                              {description}
                            </p>
                          )}
                          {item.price != null && (
                            <p className={`mt-2 text-sm font-bold text-white w-full ${lang === "ar" ? "text-right" : "text-left"}`}>
                              {formatPrice(item.price, lang)}
                            </p>
                          )}
                        </div>
                        {/* Nutrition chips: top-left, semi-transparent pills */}
                        {macros.length > 0 && (
                          <div className="absolute left-2 top-2 flex flex-wrap gap-1 max-w-[70%]">
                            {macros.map((label, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/25 backdrop-blur-sm border border-white/20 text-white"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows: desktop only (hidden on mobile so they don't block touch) */}
          <button
            type="button"
            onClick={() => scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" })}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-drd-text shadow-md transition ${
              canScrollLeft ? "hover:bg-drd-primary hover:text-white hover:border-drd-primary" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollRef.current?.scrollBy({ left: SCROLL_STEP, behavior: "smooth" })}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-drd-text shadow-md transition ${
              canScrollRight ? "hover:bg-drd-primary hover:text-white hover:border-drd-primary" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <MarketItemModal item={modalItem} onClose={() => setModalItem(null)} />
    </section>
  );
}
