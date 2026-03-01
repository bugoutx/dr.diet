"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

export type HeroMealItem = {
  id: string;
  name: string;
  macros: string;
  description: string;
  image: string;
  badge?: string;
};

type HeroContent = {
  slogan: string;
  title: string;
  description: string;
};

type SiteSettings = {
  menuPdfUrl?: string | null;
  orderOnBeeorderUrl?: string | null;
  instagramUrl?: string | null;
  instagramHandle?: string | null;
};

const benefits = [
  { text: "Calorie-counted meals", icon: "🔥" },
  { text: "High protein options", icon: "💪" },
  { text: "Smart snacks & smoothies", icon: "🥤" },
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
  const items = meals.length > 0 ? meals : [
    { id: "fb1", name: "California Salad", macros: "35g protein · 473 cal", description: "Arugula, tomato, avocado, rice, corn & 100g grilled chicken.", image: "/images/hero-california-salad.jpg", badge: "Rotating signature meal" },
    { id: "fb2", name: "Dr.Diet Energy Plate", macros: "48g protein · 350 cal", description: "Grilled chicken with sautéed vegetables and smart carbs.", image: "/images/hero-energy-plate.jpg", badge: "Rotating signature meal" },
    { id: "fb3", name: "Radiance Smoothie", macros: "343 cal", description: "Low-fat milk, avocado, banana & honey for clean energy.", image: "/images/hero-radiance-smoothie.jpg", badge: "Rotating signature meal" },
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
  const instagramHref = settings?.instagramUrl || "https://instagram.com/dr.diet.sy";
  const instagramLabel = settings?.instagramHandle || "@dr.diet.sy";

  const handleOrderNow = () => {
    if (orderNowUrl) {
      window.location.href = orderNowUrl;
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-drd-bg via-white to-drd-bg"
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-white via-emerald-50/60 to-transparent blur-3xl z-0" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[60vw] max-w-[900px] bg-gradient-to-bl from-emerald-100/80 via-emerald-200/70 to-drd-primary/60 opacity-90 [clip-path:ellipse(75%_55%_at_100%_40%)] z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-drd-accent/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-drd-primary/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl space-y-6"
          >
            <p className="text-xl text-drd-accent italic tracking-wide font-medium">
              {tField(lang, heroContent.slogan, heroContent.slogan)}
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-drd-text uppercase tracking-tight leading-tight">
              {tField(lang, heroContent.title, heroContent.title)}
            </h2>
            <p className="text-lg text-drd-muted leading-relaxed">
              {tField(lang, heroContent.description, heroContent.description)}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {orderNowUrl ? (
                <button
                  onClick={handleOrderNow}
                  className="inline-flex items-center justify-center rounded-full bg-drd-primary px-8 py-4 text-base font-bold text-white shadow-md shadow-drd-primary/30 transition-transform hover:scale-[1.02] hover:shadow-lg hover:bg-drd-primary-dark"
                >
                  Order Now
                </button>
              ) : (
                <span
                  title="Coming soon"
                  className="inline-flex items-center justify-center rounded-full bg-drd-primary/70 px-8 py-4 text-base font-bold text-white cursor-not-allowed"
                >
                  Order Now (Coming soon)
                </span>
              )}
              {menuPdfUrl ? (
                <a
                  href={menuPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-drd-text/20 text-drd-text rounded-full font-bold hover:bg-drd-bg transition-colors text-center"
                >
                  View Full Menu (PDF)
                </a>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
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

            <div className="pt-2">
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-drd-muted hover:text-drd-accent transition-colors text-sm"
              >
                {instagramLabel}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-20 mt-12 lg:mt-0 flex-1 flex items-center justify-end overflow-visible"
          >
            <div className="pointer-events-none absolute -top-6 right-10 h-12 w-12 rounded-full border-2 border-emerald-200/80 bg-white/40 backdrop-blur-sm z-30" />
            <div className="pointer-events-none absolute -bottom-8 right-16 text-drd-primary/70 text-3xl font-bold z-30 select-none">+</div>
            <div className="pointer-events-none absolute top-1/3 -left-4 h-10 w-10 rounded-full border-4 border-drd-primary bg-white/50 z-30" />

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
                    className="h-full w-full"
                  >
                    <Image
                      src={activeMeal.image}
                      alt={tField(lang, activeMeal.name, activeMeal.name) || "Hero meal"}
                      fill
                      className="h-full w-full object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized={activeMeal.image.startsWith("http")}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full border-4 border-drd-accent/30 bg-white/50 backdrop-blur-sm z-30" />
              <div className="absolute top-1/4 -left-6 w-12 h-12 flex items-center justify-center z-30">
                <div className="w-8 h-8 rounded-full bg-drd-primary/20 border-2 border-drd-primary/40 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-drd-primary" />
                </div>
              </div>
              <div className="absolute bottom-1/4 -right-8 w-10 h-10 flex items-center justify-center z-30">
                <svg className="w-10 h-10 text-drd-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>

              <div className="absolute bottom-0 left-0 -translate-x-4 translate-y-4 max-w-xs w-full z-30">
                <div className="bg-white rounded-2xl p-4 shadow-xl border border-drd-primary/10">
                    <span className="inline-block px-2 py-1 bg-drd-primary/10 text-drd-primary text-xs font-medium rounded-full mb-3">
                    {tField(lang, activeMeal.badge ?? "Rotating signature meal", activeMeal.badge ?? "Rotating signature meal")}
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
                      <h3 className="font-bold text-drd-text text-lg mb-1">{tField(lang, activeMeal.name, activeMeal.name)}</h3>
                      <p className="font-medium text-drd-muted text-xs mb-1">{activeMeal.macros}</p>
                      <p className="text-drd-muted text-xs leading-relaxed">{tField(lang, activeMeal.description, activeMeal.description)}</p>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-drd-bg">
                    {items.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === activeIndex ? "w-5 h-1.5 bg-drd-primary" : "w-1.5 h-1.5 bg-drd-primary/30 hover:bg-drd-primary/50"
                        }`}
                        aria-label={`Switch to ${items[index].name}`}
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
