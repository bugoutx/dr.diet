"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartImage from "@/components/SmartImage";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";
import { formatMacros } from "@/lib/formatMacro";
import DecorativeVeggies from "@/components/DecorativeVeggies";

// Section title/subtitle from admin (optional)
export type LovedPlatesSectionTitle = {
  titleEn: string;
  titleAr?: string;
  subtitleEn: string;
  subtitleAr?: string;
};

// DB-driven loved plate shape (from getSiteData.lovedPlates)
export type LovedPlateItem = {
  id: string;
  nameEn: string;
  nameAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image: string;
  galleryUrls?: string[];
  proteinG?: number;
  carbsG?: number;
  calories?: number;
  tags: { labelEn: string; labelAr: string; tone: "green" | "orange" }[];
  ingredientsEn?: string;
  ingredientsAr?: string;
};

// Internal slide type: normalized for rendering (lang applied in component)
type PlateSlide = {
  id: string;
  nameEn: string;
  nameAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image: string;
  proteinG?: number;
  carbsG?: number;
  calories?: number;
  tags: { labelEn: string; labelAr: string; tone: "green" | "orange" }[];
  ingredientsEn?: string;
  ingredientsAr?: string;
};

// Fallback when DB has no loved plates
const FALLBACK_PLATES: PlateSlide[] = [
  {
    id: "energy-plate",
    nameEn: "Dr.Diet Energy Plate",
    nameAr: "طبق الطاقة",
    subtitleEn: "Energy Dish · Chicken",
    subtitleAr: "طبق طاقة · دجاج",
    descriptionEn: "Grilled chicken with sautéed vegetables and smart carbs for sustained energy throughout your day.",
    descriptionAr: "",
    image: "/images/hero-energy-plate.jpg",
    proteinG: 48,
    calories: 350,
    carbsG: 25,
    tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" }, { labelEn: "Low Cal", labelAr: "سعرات منخفضة", tone: "orange" }],
  },
  {
    id: "california-salad",
    nameEn: "California Salad",
    nameAr: "سلطة كاليفورنيا",
    subtitleEn: "Salad · High Protein",
    subtitleAr: "سلطة · بروتين عالي",
    descriptionEn: "Arugula, tomato, avocado, rice, corn & 100g grilled chicken. Fresh, crisp, and perfectly balanced.",
    descriptionAr: "",
    image: "/images/hero-california-salad.jpg",
    proteinG: 35,
    calories: 473,
    carbsG: 42,
    tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" }, { labelEn: "High Fiber", labelAr: "ألياف عالية", tone: "green" }],
  },
  {
    id: "radiance-smoothie",
    nameEn: "Radiance Smoothie",
    nameAr: "سموذي الإشراق",
    subtitleEn: "Smoothie · Energy",
    subtitleAr: "سموذي · طاقة",
    descriptionEn: "Low-fat milk, avocado, banana & honey for clean energy. Perfect for breakfast or a midday boost.",
    descriptionAr: "",
    image: "/images/hero-radiance-smoothie.jpg",
    proteinG: 12,
    calories: 343,
    carbsG: 52,
    tags: [{ labelEn: "High Fiber", labelAr: "ألياف عالية", tone: "green" }],
  },
];

function MacroProteinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function MacroCaloriesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  );
}

// Helper component for Macro Tile
function MacroTile({ label, value, unit, iconType, isOrange = false }: { label: string; value: number; unit: string; iconType: "protein" | "calories"; isOrange?: boolean }) {
  const iconColor = isOrange ? "text-drd-accent" : "text-drd-primary";
  const iconClass = `w-5 h-5 ${iconColor}`;

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 hover:border-drd-primary/40 overflow-hidden">
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-drd-primary/20 via-transparent to-drd-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          {iconType === "protein" ? <MacroProteinIcon className={iconClass} /> : <MacroCaloriesIcon className={iconClass} />}
          <span className="text-xs font-semibold text-drd-text/60 uppercase tracking-wide">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${isOrange ? "text-drd-accent" : "text-drd-primary"}`}>{value}</span>
          <span className="text-sm text-drd-text/60 font-medium">{unit}</span>
        </div>
      </div>
    </div>
  );
}

// Helper component for Benefit Tile (tags with tone + bilingual label)
function BenefitTile({ tags, lang }: { tags: { labelEn: string; labelAr: string; tone: "green" | "orange" }[]; lang: "en" | "ar" }) {
  const displayTags = tags.slice(0, 5);
  return (
    <div className="relative bg-gradient-to-br from-emerald-50/60 via-emerald-50/40 to-drd-accent/10 backdrop-blur-sm rounded-2xl p-4 border border-emerald-200/40 shadow-sm hover:shadow-md transition-all duration-300 hover:border-drd-primary/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-drd-primary/5 via-transparent to-drd-accent/5 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">✨</span>
          <span className="text-xs font-semibold text-drd-text/70 uppercase tracking-wide">{tField(lang, "Benefits", "الفوائد")}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {displayTags.map((tag, idx) => (
            <span
              key={idx}
              className={`inline-block px-2 py-1 text-[10px] font-semibold rounded-full ${
                tag.tone === "orange"
                  ? "bg-drd-accent/15 text-drd-accent"
                  : "bg-drd-primary/15 text-drd-primary"
              }`}
            >
              {tField(lang, tag.labelEn, tag.labelAr)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Accordion component for additional info
function AccordionItem({ title, children, isOpen, onToggle }: { title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-t border-slate-200/60">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="text-sm font-medium text-drd-text/80 group-hover:text-drd-primary transition-colors">
          {title}
        </span>
        <motion.svg
          className="w-4 h-4 text-drd-text/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-3 text-sm text-drd-text/70 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Plate Slide Component (DB-driven loved plate)
function MealSlide({ plate }: { plate: PlateSlide }) {
  const { lang } = useLang();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const checkOverflow = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => checkOverflow());
    const el = contentRef.current;
    if (!el) return () => cancelAnimationFrame(id);
    const ro = new ResizeObserver(() => checkOverflow());
    ro.observe(el);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [plate, checkOverflow]);

  // Mobile scroll chaining: only preventDefault when inner container can scroll; otherwise let page scroll
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !isOverflowing) return;

    let startY = 0;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const dy = y - startY;

      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      const swipingDown = dy < 0;
      const swipingUp = dy > 0;

      if ((swipingDown && !atBottom) || (swipingUp && !atTop)) {
        e.preventDefault();
        el.scrollBy({ top: -dy });
        startY = y;
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, [plate.id, isOverflowing]);

  const name = tField(lang, plate.nameEn, plate.nameAr);
  const subtitle = tField(lang, plate.subtitleEn, plate.subtitleAr);
  const description = tField(lang, plate.descriptionEn, plate.descriptionAr);
  const tags = plate.tags ?? [];
  const macros = formatMacros(lang, { proteinG: plate.proteinG, carbsG: plate.carbsG, calories: plate.calories });
  const hasMacros = macros.length > 0;
  const ingredientsText = tField(lang, plate.ingredientsEn, plate.ingredientsAr);
  const hasIngredients = ingredientsText.trim().length > 0;

  const imageBlock = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-white/80 backdrop-blur-sm group hover:shadow-2xl hover:shadow-drd-primary/15 transition-all duration-300 flex-shrink-0"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-drd-primary/30 via-transparent to-drd-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-drd-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="relative w-full h-[260px] md:h-[320px]">
        <SmartImage
          src={plate.image}
          alt={name || "Dish"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </motion.div>
  );

  const macrosBlock = hasMacros ? (
    <div className="grid grid-cols-2 gap-4">
      {plate.proteinG != null && (
        <MacroTile
          label={lang === "ar" ? "بروتين" : "Protein"}
          value={plate.proteinG}
          unit={lang === "ar" ? "غ" : "g"}
          iconType="protein"
          isOrange={false}
        />
      )}
      {plate.calories != null && (
        <MacroTile
          label={lang === "ar" ? "كال" : "Calories"}
          value={plate.calories}
          unit={lang === "ar" ? "كال" : "cal"}
          iconType="calories"
          isOrange={true}
        />
      )}
    </div>
  ) : null;

  const benefitBlock = tags.length > 0 ? <BenefitTile tags={tags} lang={lang} /> : null;

  const detailsContent = (
    <>
      <div className="mb-4">
        <h3 className="text-3xl md:text-4xl font-bold font-heading text-drd-text mb-2 tracking-tight md:line-clamp-2" title={name}>
          {name}
        </h3>
        {(subtitle?.trim()) ? (
          <p className="text-sm font-medium text-drd-text/60 uppercase tracking-wide md:line-clamp-1">
            {subtitle}
          </p>
        ) : null}
      </div>

      {(description?.trim()) ? (
        <p className="text-base text-drd-text/80 leading-relaxed mb-6 md:line-clamp-4" title={description}>
          {description}
        </p>
      ) : null}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-300 ${
                tag.tone === "orange"
                  ? "bg-gradient-to-r from-drd-accent/15 to-drd-accent/10 text-drd-accent border-drd-accent/30"
                  : "bg-gradient-to-r from-drd-primary/15 to-drd-primary/10 text-drd-primary border-drd-primary/30"
              } hover:scale-105`}
            >
              {tField(lang, tag.labelEn, tag.labelAr)}
            </span>
          ))}
        </div>
      )}

      {hasMacros && (
        <div className="py-4 mb-6 border-y border-slate-200/60">
          <p className="text-sm text-drd-text/60 mb-1">{lang === "ar" ? "التغذية لكل حصة" : "Nutrition per serving"}</p>
          <p className="text-lg font-bold text-drd-primary">
            {macros.join(" · ")}
          </p>
        </div>
      )}

      <div className="space-y-0">
        {hasIngredients && (
          <AccordionItem
            title={lang === "ar" ? "المكونات" : "Ingredients"}
            isOpen={openAccordion === "ingredients"}
            onToggle={() => toggleAccordion("ingredients")}
          >
            <p className="text-drd-text/70 whitespace-pre-wrap">{ingredientsText}</p>
          </AccordionItem>
        )}
      </div>
    </>
  );

  const detailsCard = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/60 shadow-lg overflow-hidden lg:overflow-y-auto lg:overflow-x-hidden lg:min-h-0 lg:max-h-full"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-drd-primary/20 via-transparent to-drd-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-drd-primary via-drd-primary/60 to-drd-accent rounded-t-3xl" />
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-drd-accent/8 rounded-full blur-3xl pointer-events-none" />
      <div className="relative">{detailsContent}</div>
    </motion.div>
  );

  const ingredientsList = hasIngredients
    ? ingredientsText
        .split(/[,;\n&]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const sectionCardClass =
    "rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm shadow-black/5 p-4";

  const mobileOverview = (
    <div className={sectionCardClass}>
      <div className="space-y-2">
        <h3 className="text-xl font-bold font-heading text-drd-text tracking-tight">{name}</h3>
        {(subtitle?.trim()) ? (
          <p className="text-xs font-medium text-drd-text/60 uppercase tracking-wide">{subtitle}</p>
        ) : null}
        {(description?.trim()) ? (
          <p className="text-sm text-drd-text/80 leading-relaxed">{description}</p>
        ) : null}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
                  tag.tone === "orange"
                    ? "bg-drd-accent/10 text-drd-accent border-drd-accent/30"
                    : "bg-drd-primary/10 text-drd-primary border-drd-primary/30"
                }`}
              >
                {tField(lang, tag.labelEn, tag.labelAr)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const mobileIngredientsCard = hasIngredients && (
    <div className={sectionCardClass}>
      <div className="flex items-center gap-2 text-sm font-semibold text-drd-text">
        <svg className="h-4 w-4 text-drd-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <span>{lang === "ar" ? "المكونات" : "Ingredients"}</span>
      </div>
      <div className="mt-2 h-px w-full bg-slate-200/70" />
      {ingredientsList.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {ingredientsList.map((item, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-drd-text/70 whitespace-pre-wrap">{ingredientsText}</p>
      )}
    </div>
  );

  const mobileNutritionCard = hasMacros && (
    <div className={sectionCardClass}>
      <div className="flex items-center gap-2 text-sm font-semibold text-drd-text">
        <svg className="h-4 w-4 text-drd-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span>{lang === "ar" ? "القيم الغذائية" : "Nutrition"}</span>
      </div>
      <div className="mt-2 h-px w-full bg-slate-200/70" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        {plate.calories != null && (
          <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3">
            <p className="text-[11px] text-slate-500 font-medium">{lang === "ar" ? "السعرات" : "Calories"}</p>
            <p className="text-base font-bold text-drd-text mt-0.5">{plate.calories} <span className="text-xs font-normal text-slate-500">{lang === "ar" ? "كال" : "kcal"}</span></p>
          </div>
        )}
        {plate.proteinG != null && (
          <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3">
            <p className="text-[11px] text-slate-500 font-medium">{lang === "ar" ? "البروتين" : "Protein"}</p>
            <p className="text-base font-bold text-drd-text mt-0.5">{plate.proteinG} <span className="text-xs font-normal text-slate-500">{lang === "ar" ? "غ" : "g"}</span></p>
          </div>
        )}
        {plate.carbsG != null && (
          <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3">
            <p className="text-[11px] text-slate-500 font-medium">{lang === "ar" ? "الكربوهيدرات" : "Carbs"}</p>
            <p className="text-base font-bold text-drd-text mt-0.5">{plate.carbsG} <span className="text-xs font-normal text-slate-500">{lang === "ar" ? "غ" : "g"}</span></p>
          </div>
        )}
      </div>
    </div>
  );

  const mobileScrollAreaClass = isOverflowing
    ? "min-h-0 flex-1 overflow-y-auto hide-scrollbar px-5 pl-12 pr-12 pb-6"
    : "flex-1 overflow-visible px-5 pl-12 pr-12 pb-6 min-h-0";

  return (
    <div className="h-full w-full" style={{ touchAction: "pan-y" }}>
      <div className="h-full w-full min-h-0 flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:gap-12">
        {/* Mobile: image (fixed) then scrollable content. Desktop: two columns */}
        <div className="flex flex-col gap-4 min-h-0 shrink-0 lg:shrink">
          <div className="mb-4 lg:mb-0">
            {imageBlock}
          </div>
          {/* Desktop only: macros + benefits in left column */}
          <div className="hidden lg:block">
            {macrosBlock}
            <div className="mt-6">{benefitBlock}</div>
          </div>
        </div>

        {/* Mobile: only overflow-y-auto when content overflows; else overflow-visible so page scroll works. Desktop: right column. */}
        <div
          ref={contentRef}
          className={`${mobileScrollAreaClass} lg:overflow-visible lg:flex-initial lg:flex lg:flex-col lg:justify-center lg:px-0 lg:pb-0 lg:pl-0 lg:pr-0`}
        >
          {/* Mobile only: structured sections — extra top margin between macros and content below */}
          <div className="space-y-5 lg:hidden">
            {macrosBlock}
            <div className="mt-6 space-y-5">
              {mobileOverview}
              {mobileIngredientsCard}
              {mobileNutritionCard}
            </div>
          </div>
          {/* Desktop: details card unchanged */}
          <div className="hidden lg:flex lg:flex-col lg:justify-center lg:min-h-0">
            {detailsCard}
          </div>
          {/* Scroll hint only when content overflows (mobile) */}
          {isOverflowing && (
            <div className="pointer-events-none sticky bottom-0 h-10 bg-gradient-to-t from-white to-transparent lg:hidden" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}

// Dots Indicator Component
function DotsIndicator({ count, currentIndex, onDotClick }: { count: number; currentIndex: number; onDotClick: (index: number) => void }) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onDotClick(index)}
          className={`relative transition-all duration-300 rounded-full ${
            index === currentIndex
              ? "w-8 h-2 bg-drd-primary"
              : "w-2 h-2 bg-drd-primary/30 hover:bg-drd-primary/50"
          }`}
          aria-label={`Go to meal ${index + 1}`}
        >
          {index === currentIndex && (
            <div className="absolute inset-0 rounded-full bg-drd-accent/40 blur-sm -z-10" />
          )}
        </button>
      ))}
    </div>
  );
}

export default function SignatureDishesSection({
  plates: propPlates,
  sectionTitle,
}: {
  plates?: LovedPlateItem[];
  sectionTitle?: LovedPlatesSectionTitle;
}) {
  const { lang } = useLang();
  const plates: PlateSlide[] =
    propPlates && propPlates.length > 0
      ? propPlates.map((p) => ({
          id: p.id,
          nameEn: p.nameEn,
          nameAr: p.nameAr,
          subtitleEn: p.subtitleEn,
          subtitleAr: p.subtitleAr,
          descriptionEn: p.descriptionEn,
          descriptionAr: p.descriptionAr,
          image: p.image,
          proteinG: p.proteinG,
          carbsG: p.carbsG,
          calories: p.calories,
          tags: p.tags ?? [],
          ingredientsEn: p.ingredientsEn,
          ingredientsAr: p.ingredientsAr,
        }))
      : FALLBACK_PLATES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % plates.length);
  }, [plates.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + plates.length) % plates.length);
  }, [plates.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const lastIndex = plates.length - 1;
  const isRtl = lang === "ar";
  // RTL: left = forward (next), right = backward (prev). LTR: left = prev, right = next. Icons stay left/right; only logic swaps.
  const leftAction = isRtl ? nextSlide : prevSlide;
  const rightAction = isRtl ? prevSlide : nextSlide;
  const leftDisabled = isRtl ? currentIndex === lastIndex : currentIndex === 0;
  const rightDisabled = isRtl ? currentIndex === 0 : currentIndex === lastIndex;
  const motionOffset = isRtl ? -20 : 20;

  return (
    <section
      id="loved-plates"
      className="relative py-16 md:py-24 overflow-hidden bg-white"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(140, 191, 79, 0.10), transparent 55%),
          radial-gradient(circle at 80% 40%, rgba(255, 138, 42, 0.08), transparent 55%),
          linear-gradient(#ffffff, #ffffff)
        `,
      }}
    >
      <DecorativeVeggies section="loved-plates" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="mb-12 md:mb-16"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4 tracking-tight" dir={lang === "ar" ? "rtl" : "ltr"}>
              {sectionTitle
                ? tField(lang, sectionTitle.titleEn, sectionTitle.titleAr ?? sectionTitle.titleEn)
                : (lang === "ar" ? "أطباقنا المفضلة" : "Our Most-Loved Plates")}
            </h2>
            <p className="text-lg md:text-xl text-drd-text/70 max-w-2xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
              {sectionTitle
                ? tField(lang, sectionTitle.subtitleEn, sectionTitle.subtitleAr ?? sectionTitle.subtitleEn)
                : (lang === "ar" ? "الأكثر مبيعاً والمفضلة لدى عملائنا." : "Top sellers and crowd favorites that keep our customers coming back for more.")}
            </p>
          </div>
        </motion.div>

        {/* Carousel – fixed-height viewport so arrows never move */}
        <div
          ref={carouselRef}
          className="relative w-full"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Fixed-height positioning context: viewport + arrow overlay use same box */}
          <div className="relative w-full h-[78vh] md:h-[560px] lg:h-[600px]">
            {/* Slide track – fills viewport, overflow hidden so content never changes height */}
            <div className="absolute inset-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="h-full w-full"
                  initial={{ opacity: 0, x: motionOffset }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -motionOffset }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <MealSlide plate={plates[currentIndex]} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Arrow overlay – dir="ltr" keeps left/right placement; RTL swaps logic so left=next (active at start), right=prev */}
            <div className="absolute inset-0 z-20 pointer-events-none" dir="ltr">
              <button
                type="button"
                aria-label={isRtl ? "الطبق التالي" : "Previous meal"}
                onClick={leftAction}
                disabled={leftDisabled}
                className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 shadow-lg flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white enabled:hover:scale-110 enabled:hover:shadow-xl enabled:hover:shadow-drd-primary/30 enabled:hover:border-drd-primary/40"
              >
                <svg className="w-6 h-6 text-drd-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                aria-label={isRtl ? "الطبق السابق" : "Next meal"}
                onClick={rightAction}
                disabled={rightDisabled}
                className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 shadow-lg flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white enabled:hover:scale-110 enabled:hover:shadow-xl enabled:hover:shadow-drd-accent/30 enabled:hover:border-drd-accent/40"
              >
                <svg className="w-6 h-6 text-drd-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <DotsIndicator count={plates.length} currentIndex={currentIndex} onDotClick={goToSlide} />
        </div>
      </div>
    </section>
  );
}
