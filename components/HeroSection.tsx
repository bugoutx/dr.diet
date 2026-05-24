"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SmartImage from "@/components/SmartImage";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";
import { formatMacros } from "@/lib/formatMacro";
import { MAX_HERO_MEALS } from "@/lib/heroMeals";
import DecorativeVeggies from "@/components/DecorativeVeggies";

export type HeroMealItem = {
  id: string;
  nameEn: string;
  nameAr?: string;
  subtitleEn?: string;
  subtitleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  protein?: number;
  calories?: number;
  image: string;
  badgeEn?: string;
  badgeAr?: string;
};

type HeroContent = {
  slogan: string;
  sloganAr?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  ctaLabelEn?: string;
  ctaLabelAr?: string;
};

type SiteSettings = {
  menuPdfUrl?: string | null;
  orderOnBeeorderUrl?: string | null;
  instagramUrl?: string | null;
  instagramHandle?: string | null;
  facebookUrl?: string | null;
  facebookHandle?: string | null;
};

const benefitsEn = [
  { text: "Calorie-counted meals", icon: "🔥" },
  { text: "High protein options", icon: "💪" },
  { text: "Smart snacks & smoothies", icon: "🥤" },
];
const benefitsAr = [
  { text: "وجبات محسوبة السعرات", icon: "🔥" },
  { text: "خيارات بروتين عالي", icon: "💪" },
  { text: "وجبات خفيفة وسموذي", icon: "🥤" },
];

export default function HeroSection({
  heroContent,
  meals,
  settings,
}: {
  heroContent: HeroContent;
  meals: HeroMealItem[];
  settings?: SiteSettings | null;
}) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const benefits = isRtl ? benefitsAr : benefitsEn;
  const items: HeroMealItem[] = meals.length > 0 ? meals.slice(0, MAX_HERO_MEALS) : [
    { id: "fb1", nameEn: "California Salad", nameAr: "سلطة كاليفورنيا", subtitleEn: "Salad", descriptionEn: "Arugula, tomato, avocado, rice, corn & 100g grilled chicken.", protein: 35, calories: 473, image: "/images/hero-california-salad.jpg", badgeEn: "Rotating signature meal", badgeAr: "طبق مميز" },
    { id: "fb2", nameEn: "Dr.Diet Energy Plate", nameAr: "طبق الطاقة", subtitleEn: "Energy Dish", descriptionEn: "Grilled chicken with sautéed vegetables and smart carbs.", protein: 48, calories: 350, image: "/images/hero-energy-plate.jpg", badgeEn: "Rotating signature meal", badgeAr: "طبق مميز" },
    { id: "fb3", nameEn: "Radiance Smoothie", nameAr: "سموذي الإشراق", subtitleEn: "Smoothie", descriptionEn: "Low-fat milk, avocado, banana & honey for clean energy.", calories: 343, image: "/images/hero-radiance-smoothie.jpg", badgeEn: "Rotating signature meal", badgeAr: "طبق مميز" },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  const activeMeal = items[activeIndex];
  const orderNowUrl = settings?.orderOnBeeorderUrl?.trim() || null;
  const menuPdfUrl = settings?.menuPdfUrl?.trim() || null;
  const instagramHref = settings?.instagramUrl?.trim() || "https://instagram.com/dr.diet.sy";
  const instagramLabel = settings?.instagramHandle?.trim() || "@dr.diet.sy";
  const facebookHref = settings?.facebookUrl?.trim() || null;
  const facebookLabel =
    settings?.facebookHandle?.trim() || tField(lang, "Facebook", "فيسبوك");

  const instagramLinkClass =
    "text-sm font-medium transition-opacity hover:opacity-90 hover:underline underline-offset-2 decoration-1 " +
    "text-[#c13584] supports-[background-clip:text]:bg-gradient-to-r supports-[background-clip:text]:from-[#f58529] " +
    "supports-[background-clip:text]:via-[#dd2a7b] supports-[background-clip:text]:to-[#8134af] supports-[background-clip:text]:bg-clip-text " +
    "supports-[background-clip:text]:text-transparent";

  const facebookLinkClass =
    "text-sm font-medium text-[#1877F2] transition-opacity hover:opacity-90 hover:underline underline-offset-2 decoration-1";
  const ctaLabel = tField(lang, heroContent.ctaLabelEn ?? "Order Now", heroContent.ctaLabelAr ?? "اطلب الآن");
  const menuPdfLabel = lang === "ar" ? "القائمة (PDF)" : "View Full Menu (PDF)";

  const handleOrderNow = () => {
    if (orderNowUrl) {
      window.location.href = orderNowUrl;
    }
  };

  return (
    <section
      id="hero"
      dir={isRtl ? "rtl" : "ltr"}
      className="relative overflow-visible md:overflow-hidden bg-gradient-to-br from-drd-bg via-white to-drd-bg"
    >
      {/* Decorative blobs: mirror position for RTL */}
      <div className={`pointer-events-none absolute -top-24 h-64 w-64 rounded-full bg-gradient-to-bl from-white via-emerald-50/60 to-transparent blur-3xl z-0 ${isRtl ? "left-0" : "right-0"}`} />
      <div
        className={`pointer-events-none absolute inset-y-0 w-[60vw] max-w-[900px] bg-gradient-to-bl from-emerald-100/80 via-emerald-200/70 to-drd-primary/60 opacity-90 z-0 ${isRtl ? "left-0 [clip-path:ellipse(75%_55%_at_0%_40%)]" : "right-0 [clip-path:ellipse(75%_55%_at_100%_40%)]"}`}
      />
      <div className={`absolute top-0 w-96 h-96 bg-drd-accent/5 rounded-full blur-3xl pointer-events-none z-0 ${isRtl ? "left-0" : "right-0"}`} />
      <div className={`absolute bottom-0 w-80 h-80 bg-drd-primary/5 rounded-full blur-3xl pointer-events-none z-0 ${isRtl ? "right-0" : "left-0"}`} />

      <DecorativeVeggies section="hero" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col items-center gap-6 md:gap-12 px-4 pt-16 sm:pt-20 pb-8 md:py-16 lg:flex-row lg:gap-12 lg:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-center w-full overflow-visible">
          {/* Text column: EN = left (order-1), AR = right (order-1 in RTL grid) — same order so RTL places it right */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl space-y-6 lg:order-1 min-w-0 pt-4 sm:pt-6 md:pt-0"
          >
            <p className={`block text-xl text-drd-accent italic tracking-wide font-medium mt-0 mb-3 md:mb-4 ${isRtl ? "text-right" : ""}`}>
              {tField(lang, heroContent.slogan, heroContent.sloganAr ?? heroContent.slogan)}
            </p>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-drd-text uppercase tracking-tight leading-tight ${isRtl ? "text-right" : ""}`}>
              {tField(lang, heroContent.title, heroContent.titleAr ?? heroContent.title)}
            </h2>
            <p className={`text-lg text-drd-muted leading-relaxed ${isRtl ? "text-right" : ""}`}>
              {tField(lang, heroContent.description, heroContent.descriptionAr ?? heroContent.description)}
            </p>

            {/* CTA + chips: full-width container, Arabic: right, English: left. dir="ltr" so justify-end/items-end mean right in RTL. */}
            <div
              className={`hidden md:flex w-full flex-col pt-2 ${
                lang === "ar"
                  ? "items-end text-right"
                  : "items-start text-left"
              }`}
              dir="ltr"
            >
              <div
                className={`w-full flex ${
                  lang === "ar" ? "justify-end" : "justify-start"
                }`}
                dir="ltr"
              >
                {orderNowUrl ? (
                  <button
                    onClick={handleOrderNow}
                    className="inline-flex items-center justify-center rounded-full bg-drd-primary px-8 py-4 text-base font-bold text-white shadow-md shadow-drd-primary/30 transition-transform hover:scale-[1.02] hover:shadow-lg hover:bg-drd-primary-dark"
                  >
                    {ctaLabel}
                  </button>
                ) : (
                  <span
                    title={lang === "ar" ? "قريباً" : "Coming soon"}
                    className="inline-flex items-center justify-center rounded-full bg-drd-primary/70 px-8 py-4 text-base font-bold text-white cursor-not-allowed"
                  >
                    {ctaLabel} {lang === "ar" ? "(قريباً)" : "(Coming soon)"}
                  </span>
                )}
              </div>

              <div
                className={`mt-6 flex w-full flex-wrap gap-3 ${
                  lang === "ar" ? "justify-end" : "justify-start"
                }`}
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs text-drd-text/80 shadow-sm border border-emerald-100/70 hover:shadow-md hover:border-drd-primary/60 transition"
                  >
                    <span className="text-sm">{benefit.icon}</span>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu PDF link — same alignment as CTA */}
            {menuPdfUrl ? (
              <div
                className={`hidden md:flex w-full pt-4 ${
                  lang === "ar" ? "justify-end" : "justify-start"
                }`}
              >
                <a
                  href={menuPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-drd-text/20 text-drd-text rounded-full font-bold hover:bg-drd-bg transition-colors text-center"
                >
                  {menuPdfLabel}
                </a>
              </div>
            ) : null}

            <div
              className={`flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 ${
                isRtl ? "justify-end" : "justify-start"
              }`}
            >
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className={instagramLinkClass}
              >
                {instagramLabel}
              </a>
              {facebookHref ? (
                <>
                  <span className="text-drd-muted/40 select-none text-xs" aria-hidden>
                    ·
                  </span>
                  <a
                    href={facebookHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={facebookLinkClass}
                  >
                    {facebookLabel}
                  </a>
                </>
              ) : null}
            </div>
          </motion.div>

          {/* Image/carousel column: EN = right (order-2), AR = left (order-2 in RTL grid) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`relative z-20 mt-6 md:mt-12 lg:mt-0 flex-1 flex items-center overflow-visible lg:order-2 ${isRtl ? "lg:justify-start" : "justify-end"}`}
          >
            <div className={`pointer-events-none absolute -top-6 h-12 w-12 rounded-full border-2 border-emerald-200/80 bg-white/40 backdrop-blur-sm z-30 ${isRtl ? "left-10" : "right-10"}`} />
            <div className={`pointer-events-none absolute -bottom-8 text-drd-primary/70 text-3xl font-bold z-30 select-none ${isRtl ? "left-16" : "right-16"}`}>+</div>
            <div className={`pointer-events-none absolute top-1/3 h-10 w-10 rounded-full border-4 border-drd-primary bg-white/50 z-30 ${isRtl ? "-right-4" : "-left-4"}`} />

            <div className="relative w-full max-w-lg aspect-square z-20">
              <motion.div
                className="relative z-20 aspect-square max-w-lg rounded-full overflow-hidden shadow-2xl shadow-black/10"
                animate={{ y: [0, -6, 0, 4, 0], rotate: [0, -1.5, 0, 1.5, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMeal.id}
                    initial={{ opacity: 0, rotate: -8, scale: 0.95 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 8, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative h-full w-full"
                  >
                    <SmartImage
                      src={activeMeal.image}
                      alt={tField(lang, activeMeal.nameEn, activeMeal.nameAr ?? activeMeal.nameEn) || "Hero meal"}
                      fill
                      className="h-full w-full object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized={activeMeal.image.startsWith("http")}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <div className={`absolute -top-4 w-16 h-16 rounded-full border-4 border-drd-accent/30 bg-white/50 backdrop-blur-sm z-30 ${isRtl ? "-left-4" : "-right-4"}`} />
              <div className={`absolute top-1/4 w-12 h-12 flex items-center justify-center z-30 ${isRtl ? "-right-6" : "-left-6"}`}>
                <div className="w-8 h-8 rounded-full bg-drd-primary/20 border-2 border-drd-primary/40 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-drd-primary" />
                </div>
              </div>
              <div className={`absolute bottom-1/4 w-10 h-10 flex items-center justify-center z-30 ${isRtl ? "-left-8" : "-right-8"}`}>
                <svg className="w-10 h-10 text-drd-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>

              <div className={`absolute bottom-0 max-w-xs w-full z-30 ${isRtl ? "right-0 translate-x-4 translate-y-4" : "left-0 -translate-x-4 translate-y-4"}`}>
                <div className={`bg-white rounded-2xl p-4 shadow-xl border border-drd-primary/10 ${isRtl ? "text-right" : ""}`} dir={isRtl ? "rtl" : "ltr"}>
                  <span className="inline-block px-2 py-1 bg-drd-primary/10 text-drd-primary text-xs font-medium rounded-full mb-3">
                    {tField(lang, activeMeal.badgeEn ?? "Rotating signature meal", activeMeal.badgeAr ?? "طبق مميز")}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeMeal.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="space-y-2"
                    >
                      <h3 className="font-bold text-drd-text text-lg mb-1">{tField(lang, activeMeal.nameEn, activeMeal.nameAr ?? activeMeal.nameEn)}</h3>
                      <p className="font-medium text-drd-muted text-xs mb-1">
                        {formatMacros(lang, { proteinG: activeMeal.protein, calories: activeMeal.calories }).join(" · ") || "—"}
                      </p>
                      <p className="text-drd-muted text-xs leading-relaxed">
                        {tField(lang, activeMeal.descriptionEn ?? activeMeal.subtitleEn ?? activeMeal.nameEn, activeMeal.descriptionAr ?? activeMeal.subtitleAr ?? activeMeal.nameAr ?? activeMeal.nameEn)}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  <div
                    className={`flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-drd-bg max-w-full ${isRtl ? "justify-end" : ""}`}
                  >
                    {items.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === activeIndex ? "w-5 h-1.5 bg-drd-primary" : "w-1.5 h-1.5 bg-drd-primary/30 hover:bg-drd-primary/50"
                        }`}
                        aria-label={lang === "ar" ? `انتقل إلى ${tField(lang, items[index].nameEn, items[index].nameAr)}` : `Switch to ${tField(lang, items[index].nameEn, items[index].nameAr)}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
