"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/lib/LangContext";
import { formatMacros } from "@/lib/formatMacro";
import { formatNumber } from "@/lib/formatNumber";
import { tField } from "@/lib/tField";

export type MealTagShape = { labelEn: string; labelAr: string; tone: "green" | "orange" };

export type MenuItem = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  proteinG?: number;
  carbsG?: number;
  calories?: number;
  price?: string;
  tags?: MealTagShape[];
  image: string;
};

export type MenuCategory = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  items: MenuItem[];
};

// Fallback when DB has no categories (bilingual + structured macros)
const FALLBACK_CATEGORIES: MenuCategory[] = [
  {
    id: "salads",
    nameEn: "Salads",
    nameAr: "سلطات",
    descriptionEn: "Fresh, crisp salads packed with premium vegetables, proteins, and our house-made dressings.",
    descriptionAr: undefined,
    items: [
      { id: "california-salad", nameEn: "California Salad", nameAr: "سلطة كاليفورنيا", descriptionEn: "Arugula, tomato, avocado, rice, corn & grilled chicken", descriptionAr: undefined, proteinG: 35, carbsG: 22, calories: 473, tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" as const }], image: "/images/hero-california-salad.jpg" },
      { id: "mediterranean-quinoa", nameEn: "Mediterranean Quinoa", nameAr: "كينوا متوسطية", descriptionEn: "Quinoa, cucumber, feta, olives & lemon-herb dressing", descriptionAr: undefined, proteinG: 28, calories: 420, tags: [{ labelEn: "High Fiber", labelAr: "ألياف عالية", tone: "green" as const }], image: "/images/hero-energy-plate.jpg" },
      { id: "garden-fresh-bowl", nameEn: "Garden Fresh Bowl", nameAr: "سلطة الحديقة", descriptionEn: "Mixed greens, cherry tomatoes, bell peppers & tahini", descriptionAr: undefined, proteinG: 22, calories: 320, tags: [{ labelEn: "Low Cal", labelAr: "سعرات منخفضة", tone: "orange" as const }], image: "/images/hero-radiance-smoothie.jpg" },
    ],
  },
  {
    id: "energy-dishes",
    nameEn: "Energy Dishes",
    nameAr: "أطباق الطاقة",
    descriptionEn: "High-protein plates featuring grilled chicken, lean meats, or fresh fish.",
    descriptionAr: undefined,
    items: [
      { id: "energy-plate", nameEn: "Dr.Diet Energy Plate", nameAr: "طبق الطاقة", descriptionEn: "Grilled chicken, sautéed vegetables & smart carbs", descriptionAr: undefined, proteinG: 48, calories: 350, tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" as const }], image: "/images/hero-energy-plate.jpg" },
      { id: "grilled-salmon", nameEn: "Grilled Salmon Delight", nameAr: "سلمون مشوي", descriptionEn: "Fresh salmon, roasted vegetables & lemon herb sauce", descriptionAr: undefined, proteinG: 42, calories: 380, tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" as const }], image: "/images/hero-california-salad.jpg" },
      { id: "beef-power-bowl", nameEn: "Beef Power Bowl", nameAr: "طبق لحم بقري", descriptionEn: "Lean beef, brown rice, broccoli & teriyaki glaze", descriptionAr: undefined, proteinG: 45, calories: 420, tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" as const }], image: "/images/hero-radiance-smoothie.jpg" },
    ],
  },
  {
    id: "sandwiches",
    nameEn: "Sandwiches",
    nameAr: "سندويشات",
    descriptionEn: "Satisfying sandwiches made with quality bread and premium proteins.",
    descriptionAr: undefined,
    items: [
      { id: "chicken-avocado-wrap", nameEn: "Chicken Avocado Wrap", nameAr: "لفافة دجاج وأفوكادو", descriptionEn: "Grilled chicken, avocado, lettuce & whole grain wrap", descriptionAr: undefined, proteinG: 32, calories: 450, tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" as const }], image: "/images/hero-california-salad.jpg" },
      { id: "turkey-club", nameEn: "Turkey Club", nameAr: "تركي كلوب", descriptionEn: "Roasted turkey, bacon, lettuce, tomato & whole wheat", descriptionAr: undefined, proteinG: 28, calories: 380, tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" as const }], image: "/images/hero-energy-plate.jpg" },
      { id: "veggie-delight", nameEn: "Veggie Delight", nameAr: "نباتي لذيذ", descriptionEn: "Hummus, roasted vegetables, sprouts & multigrain bread", descriptionAr: undefined, proteinG: 18, calories: 320, tags: [{ labelEn: "Low Cal", labelAr: "سعرات منخفضة", tone: "orange" as const }], image: "/images/hero-radiance-smoothie.jpg" },
    ],
  },
  {
    id: "breakfast",
    nameEn: "Breakfast & Toast",
    nameAr: "فطور وتوست",
    descriptionEn: "Energizing breakfast options and artisanal toasts.",
    descriptionAr: undefined,
    items: [
      { id: "protein-power-toast", nameEn: "Protein Power Toast", nameAr: "توست البروتين", descriptionEn: "Whole grain toast, eggs, avocado & cherry tomatoes", descriptionAr: undefined, proteinG: 25, calories: 380, tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" as const }], image: "/images/hero-california-salad.jpg" },
      { id: "overnight-oats", nameEn: "Overnight Oats Bowl", nameAr: "شوفان ليلاً", descriptionEn: "Oats, Greek yogurt, berries & honey", descriptionAr: undefined, proteinG: 20, calories: 350, tags: [{ labelEn: "High Fiber", labelAr: "ألياف عالية", tone: "green" as const }], image: "/images/hero-energy-plate.jpg" },
      { id: "avocado-smash-toast", nameEn: "Avocado Smash Toast", nameAr: "توست أفوكادو", descriptionEn: "Sourdough, smashed avocado, feta & poached egg", descriptionAr: undefined, proteinG: 15, calories: 320, tags: [{ labelEn: "Low Cal", labelAr: "سعرات منخفضة", tone: "orange" as const }], image: "/images/hero-radiance-smoothie.jpg" },
    ],
  },
  {
    id: "smoothies",
    nameEn: "Smoothies & Juices",
    nameAr: "سموذي وعصائر",
    descriptionEn: "Fresh beverages packed with vitamins and nutrients.",
    descriptionAr: undefined,
    items: [
      { id: "radiance-smoothie", nameEn: "Radiance Smoothie", nameAr: "سموذي الإشراق", descriptionEn: "Low-fat milk, avocado, banana & honey", descriptionAr: undefined, proteinG: 12, calories: 343, tags: [{ labelEn: "High Fiber", labelAr: "ألياف عالية", tone: "green" as const }], image: "/images/hero-california-salad.jpg" },
      { id: "green-power-juice", nameEn: "Green Power Juice", nameAr: "عصير الطاقة الخضراء", descriptionEn: "Spinach, apple, cucumber, lemon & ginger", descriptionAr: undefined, proteinG: 5, calories: 180, tags: [{ labelEn: "Low Cal", labelAr: "سعرات منخفضة", tone: "orange" as const }], image: "/images/hero-energy-plate.jpg" },
      { id: "protein-boost-smoothie", nameEn: "Protein Boost Smoothie", nameAr: "سموذي البروتين", descriptionEn: "Protein powder, berries, almond milk & chia seeds", descriptionAr: undefined, proteinG: 28, calories: 320, tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" as const }], image: "/images/hero-radiance-smoothie.jpg" },
    ],
  },
  {
    id: "snacks",
    nameEn: "Smart Snacks",
    nameAr: "وجبات خفيفة",
    descriptionEn: "Healthy, satisfying snacks between meals.",
    descriptionAr: undefined,
    items: [
      { id: "protein-energy-balls", nameEn: "Protein Energy Balls", nameAr: "كرات الطاقة", descriptionEn: "Dates, almonds, protein powder & coconut", descriptionAr: undefined, proteinG: 8, calories: 120, tags: [{ labelEn: "High Protein", labelAr: "بروتين عالي", tone: "green" as const }], image: "/images/hero-california-salad.jpg" },
      { id: "veggie-sticks-hummus", nameEn: "Veggie Sticks & Hummus", nameAr: "خضار وحمص", descriptionEn: "Fresh vegetables & house-made hummus", descriptionAr: undefined, proteinG: 6, calories: 150, tags: [{ labelEn: "Low Cal", labelAr: "سعرات منخفضة", tone: "orange" as const }], image: "/images/hero-energy-plate.jpg" },
      { id: "trail-mix-delight", nameEn: "Trail Mix Delight", nameAr: "مزيج المكسرات", descriptionEn: "Nuts, seeds, dried fruits & dark chocolate chips", descriptionAr: undefined, proteinG: 10, calories: 200, tags: [{ labelEn: "High Fiber", labelAr: "ألياف عالية", tone: "green" as const }], image: "/images/hero-radiance-smoothie.jpg" },
    ],
  },
  {
    id: "sauces",
    nameEn: "Sauces",
    nameAr: "صلصات",
    descriptionEn: "House-made sauces with wholesome ingredients.",
    descriptionAr: undefined,
    items: [
      { id: "lemon-herb-dressing", nameEn: "Lemon Herb Dressing", nameAr: "صلصة الليمون والأعشاب", descriptionEn: "Fresh lemon, herbs, olive oil & garlic", descriptionAr: undefined, proteinG: 2, calories: 45, tags: [{ labelEn: "Low Cal", labelAr: "سعرات منخفضة", tone: "orange" as const }], image: "/images/hero-california-salad.jpg" },
      { id: "tahini-sauce", nameEn: "Tahini Sauce", nameAr: "صلصة الطحينية", descriptionEn: "Tahini, lemon, garlic & water", descriptionAr: undefined, proteinG: 4, calories: 80, tags: [{ labelEn: "High Fiber", labelAr: "ألياف عالية", tone: "green" as const }], image: "/images/hero-energy-plate.jpg" },
      { id: "spicy-chipotle", nameEn: "Spicy Chipotle", nameAr: "تشيبوتلي حار", descriptionEn: "Chipotle peppers, yogurt & lime", descriptionAr: undefined, proteinG: 1, calories: 35, tags: [{ labelEn: "Low Cal", labelAr: "سعرات منخفضة", tone: "orange" as const }], image: "/images/hero-radiance-smoothie.jpg" },
    ],
  },
];

// Animation variants for menu item cards
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -4, scale: 1.02 },
};

export default function MenuSection({ categories: propCategories }: { categories?: MenuCategory[] }) {
  const { lang } = useLang();
  const categories = (propCategories && propCategories.length > 0) ? propCategories : FALLBACK_CATEGORIES;
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [scrollState, setScrollState] = useState<
    Record<string, { canScrollLeft: boolean; canScrollRight: boolean }>
 >({});

  // Helper function to update scroll state for a category
  const updateScrollState = (id: string) => {
    const el = scrollRefs.current[id];
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth;
    const threshold = 4; // small tolerance for floats

    const canScrollLeft = scrollLeft > threshold;
    const canScrollRight = scrollLeft < maxScrollLeft - threshold;

    setScrollState((prev) => ({
      ...prev,
      [id]: { canScrollLeft, canScrollRight },
    }));
  };

  // IntersectionObserver to track which category block is in view
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find all sections that are intersecting
        const intersecting = entries.filter((entry) => entry.isIntersecting);

        if (intersecting.length === 0) return;

        // Sort by position in viewport (topmost first, but prefer ones closer to center)
        const sorted = intersecting.sort((a, b) => {
          const rectA = (a.target as HTMLElement).getBoundingClientRect();
          const rectB = (b.target as HTMLElement).getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          const distA = Math.abs(rectA.top + rectA.height / 2 - viewportCenter);
          const distB = Math.abs(rectB.top + rectB.height / 2 - viewportCenter);
          return distA - distB;
        });

        const target = sorted[0].target as HTMLElement;
        const id = target.dataset.categoryId;

        if (id) {
          setActiveId((current) => {
            // Only update if different
            return current === id ? current : id;
          });
        }
      },
      {
        root: null,
        // Make the section that is roughly in the middle of the viewport count as "active"
        rootMargin: "-30% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    const observer = observerRef.current;

    // Observe all sections - use setTimeout to ensure refs are set
    const observeAll = () => {
      categories.forEach((cat) => {
        const el = sectionRefs.current[cat.id];
        if (el && observer) {
          observer.observe(el);
        }
      });
    };

    // Try immediately and after a short delay
    observeAll();
    const timeoutId = setTimeout(observeAll, 200);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize scroll state for each category
  useEffect(() => {
    categories.forEach((cat) => {
      requestAnimationFrame(() => {
        updateScrollState(cat.id);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const NAV_OFFSET = 80; // approximate navbar height; tweak as needed

  const handleCategoryClick = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;

    // Use getBoundingClientRect for accurate position relative to viewport
    const rect = el.getBoundingClientRect();
    const offset = window.scrollY + rect.top - NAV_OFFSET;

    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });

    // Immediately update activeId for instant feedback
    setActiveId(id);
  };

  return (
    <section id="menu" className="relative bg-white py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl gap-10 px-4">
        {/* LEFT: sticky categories */}
        <aside className="hidden w-52 shrink-0 md:block">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-drd-text/60">
              Menu
            </h2>
            <nav className="space-y-1">
              {categories.map((cat) => {
                const isActive = activeId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex w-full items-center justify-between rounded-full px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-drd-primary text-white shadow-md"
                        : "bg-transparent text-drd-text/70 hover:bg-drd-primary/5"
                    }`}
                  >
                    <span dir={lang === "ar" ? "rtl" : "ltr"} className={lang === "ar" ? "text-right" : ""}>
                      {tField(lang, cat.nameEn, cat.nameAr)}
                    </span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* RIGHT: category sections with items */}
        <div className="flex-1 space-y-12">
          {categories.map((cat) => {
            const state = scrollState[cat.id] ?? { canScrollLeft: false, canScrollRight: true };

            return (
            <section
              key={cat.id}
              data-category-id={cat.id}
              ref={(el) => {
                sectionRefs.current[cat.id] = el;
                // Observe element immediately when ref is set
                if (el && observerRef.current) {
                  observerRef.current.observe(el);
                }
              }}
              className="scroll-mt-28"
            >
              <motion.header
                className="mb-4 flex items-center justify-between gap-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div dir={lang === "ar" ? "rtl" : "ltr"} className={lang === "ar" ? "text-right" : ""}>
                  <h3 className="text-xl md:text-2xl font-semibold font-heading text-drd-text mb-1">
                    {tField(lang, cat.nameEn, cat.nameAr)}
                  </h3>
                  {tField(lang, cat.descriptionEn, cat.descriptionAr) && (
                    <p className="text-sm text-drd-text/70 leading-relaxed">
                      {tField(lang, cat.descriptionEn, cat.descriptionAr)}
                    </p>
                  )}
                </div>
                {/* Item count */}
                <span className="hidden text-xs text-drd-text/60 sm:inline whitespace-nowrap">
                  {cat.items.length} items
                </span>
              </motion.header>

              {/* HORIZONTAL CAROUSEL */}
              <div className="flex items-center gap-2">
                {/* LEFT ARROW */}
                <button
                  type="button"
                  onClick={() => {
                    const el = scrollRefs.current[cat.id];
                    if (!el) return;
                    el.scrollBy({ left: -260, behavior: "smooth" });
                  }}
                  disabled={!state.canScrollLeft}
                  className={`hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-sm shadow-sm transition ${
                    state.canScrollLeft
                      ? "text-drd-text/80 hover:bg-drd-primary hover:text-white opacity-100"
                      : "text-slate-300 opacity-0 pointer-events-none"
                  }`}
                  aria-label="Scroll left"
                >
                  ‹
                </button>

                {/* SCROLLABLE CONTAINER (horizontal meals row) */}
                <div className="w-full">
                  <div
                    ref={(el) => {
                      scrollRefs.current[cat.id] = el;
                    }}
                    onScroll={() => updateScrollState(cat.id)}
                    className="
                      flex gap-4
                      overflow-x-auto overflow-y-hidden
                      scroll-smooth
                      snap-x snap-mandatory
                      touch-pan-x overscroll-x-contain
                      pb-3
                      px-4 -mx-4
                      md:px-0 md:mx-0
                      hide-scrollbar
                    "
                  >
                    {cat.items.map((item) => (
                      <motion.article
                        key={item.id}
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        whileHover="hover"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="
                          group
                          shrink-0
                          snap-start
                          w-[220px] sm:w-[240px] md:w-[260px]
                          max-w-[85vw]
                          rounded-3xl border border-slate-100 bg-white/80
                          shadow-sm shadow-black/5
                          transition
                          hover:border-drd-primary/60 hover:bg-emerald-50/60 hover:shadow-lg hover:shadow-drd-primary/15
                        "
                      >
                        {/* image */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
                          <Image
                            src={item.image}
                            alt={tField(lang, item.nameEn, item.nameAr) || item.id || "Menu item"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 220px, 260px"
                          />
                        </div>

                        {/* text */}
                        <div className={`p-3 ${lang === "ar" ? "text-right" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"}>
                          <h4 className="text-sm font-semibold font-heading text-drd-text mb-1">
                            {tField(lang, item.nameEn, item.nameAr)}
                          </h4>
                          {(() => {
                            const macros = formatMacros(lang, { proteinG: item.proteinG, carbsG: item.carbsG, calories: item.calories });
                            return macros.length > 0 ? (
                              <p className="mt-1 text-[11px] text-drd-text/60">
                                {macros.join(" · ")}
                              </p>
                            ) : null;
                          })()}
                          {tField(lang, item.descriptionEn, item.descriptionAr) && (
                            <p className="mt-2 text-xs text-drd-text/70 line-clamp-3 leading-relaxed">
                              {tField(lang, item.descriptionEn, item.descriptionAr)}
                            </p>
                          )}

                          {(item.tags?.length || item.price) && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {item.tags?.map((tag, idx) => {
                                const label = tField(lang, tag.labelEn, tag.labelAr);
                                const isOrange = tag.tone === "orange";
                                return (
                                  <span
                                    key={idx}
                                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide font-semibold ${
                                      isOrange ? "bg-drd-accent/20 text-drd-accent" : "bg-drd-primary/20 text-drd-primary"
                                    }`}
                                  >
                                    {label}
                                  </span>
                                );
                              })}
                              {item.price && (
                                <span className="ml-auto text-xs font-semibold text-drd-text">
                                  {formatNumber(item.price, lang)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>

                {/* RIGHT ARROW */}
                <button
                  type="button"
                  onClick={() => {
                    const el = scrollRefs.current[cat.id];
                    if (!el) return;
                    el.scrollBy({ left: 260, behavior: "smooth" });
                  }}
                  disabled={!state.canScrollRight}
                  className={`hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-sm shadow-sm transition ${
                    state.canScrollRight
                      ? "text-drd-text/80 hover:bg-drd-primary hover:text-white opacity-100"
                      : "text-slate-300 opacity-0 pointer-events-none"
                  }`}
                  aria-label="Scroll right"
                >
                  ›
                </button>
              </div>
            </section>
            );
          })}
        </div>
      </div>

      {/* MOBILE: categories as horizontal pills above list */}
      <div className="mt-8 px-4 md:hidden">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition ${
                    isActive
                      ? "bg-drd-primary text-white"
                      : "bg-slate-100 text-drd-text/70"
                  }`}
                >
                  {tField(lang, cat.nameEn, cat.nameAr)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

