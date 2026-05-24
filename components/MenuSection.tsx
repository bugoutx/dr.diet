"use client";

import { useEffect, useRef, useState } from "react";
import SmartImage from "@/components/SmartImage";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LangContext";
import { formatMacros } from "@/lib/formatMacro";
import { formatPrice } from "@/lib/formatNumber";
import { tField } from "@/lib/tField";
import { FixedMenuSidebar } from "@/components/menu/FixedMenuSidebar";
import DecorativeVeggies from "@/components/DecorativeVeggies";

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

/** Item count label: EN "1 item" / "5 items"; AR "1 عنصر" / "2 عنصران" / "5 عناصر" etc. */
function itemCountLabel(lang: "en" | "ar", count: number): string {
  if (lang === "ar") {
    if (count === 1) return "1 عنصر";
    if (count === 2) return "2 عنصران";
    if (count >= 3 && count <= 10) return `${count} عناصر`;
    return `${count} عنصر`;
  }
  return count === 1 ? "1 item" : `${count} items`;
}

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

// Mobile meal card (compact for carousel row)
function MobileMealCard({ item }: { item: MenuItem }) {
  const { lang } = useLang();
  return (
    <article
      className="group w-full rounded-3xl border border-slate-100 bg-white/80 shadow-sm shadow-black/5 overflow-hidden transition hover:border-drd-primary/60 hover:bg-emerald-50/60 hover:shadow-lg hover:shadow-drd-primary/15"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <SmartImage
          src={item.image}
          alt={tField(lang, item.nameEn, item.nameAr) || item.id || "Menu item"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="240px"
          unoptimized={item.image.startsWith("http")}
        />
      </div>
      <div
        className={`p-3 ${lang === "ar" ? "text-right" : ""}`}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <h4 className="text-sm font-semibold font-heading text-drd-text mb-1">
          {tField(lang, item.nameEn, item.nameAr)}
        </h4>
        {(() => {
          const macros = formatMacros(lang, {
            proteinG: item.proteinG,
            carbsG: item.carbsG,
            calories: item.calories,
          });
          return macros.length > 0 ? (
            <p className="mt-1 text-[11px] text-drd-text/60">
              {macros.join(" · ")}
            </p>
          ) : null;
        })()}
        {tField(lang, item.descriptionEn, item.descriptionAr) && (
          <p className="mt-2 text-xs text-drd-text/70 line-clamp-2 leading-relaxed">
            {tField(lang, item.descriptionEn, item.descriptionAr)}
          </p>
        )}
        {(item.tags?.length || item.price) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {item.tags?.slice(0, 3).map((tag, idx) => {
              const label = tField(lang, tag.labelEn, tag.labelAr);
              const isOrange = tag.tone === "orange";
              return (
                <span
                  key={idx}
                  className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide font-semibold ${
                    isOrange
                      ? "bg-drd-accent/20 text-drd-accent"
                      : "bg-drd-primary/20 text-drd-primary"
                  }`}
                >
                  {label}
                </span>
              );
            })}
                    {item.price && formatPrice(item.price, lang) && (
                      <span className="text-xs font-semibold text-drd-text">
                        {formatPrice(item.price, lang)}
                      </span>
                    )}
          </div>
        )}
      </div>
    </article>
  );
}

// Single category row: title + horizontal carousel of meals (mobile only)
function CategoryRowCarousel({ category }: { category: MenuCategory }) {
  const { lang } = useLang();
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasNudged = useRef(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);

  const meals = category.items;
  const categoryName = tField(lang, category.nameEn, category.nameAr);

  // Scroll hint: nudge once on mount
  useEffect(() => {
    if (hasNudged.current || !scrollRef.current || meals.length <= 1) return;
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
  }, [meals.length]);

  // Lock background scroll when View all modal is open (iOS-safe)
  useEffect(() => {
    if (!viewAllOpen) return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;

    const scrollY = window.scrollY;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [viewAllOpen]);

  // Escape key closes modal
  useEffect(() => {
    if (!viewAllOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewAllOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewAllOpen]);

  return (
    <section className="w-full border-b border-slate-100 last:border-b-0">
      {/* Mobile category header: Arabic = two-slot row (left: عرض الكل or spacer, right: title). English = title left, View all right. */}
      <div
        className="flex items-center justify-between w-full px-4 pt-6 pb-1"
        dir="ltr"
      >
        {lang === "ar" ? (
          <>
            <div className="min-w-[72px] shrink-0 text-left">
              {meals.length > 2 ? (
                <button
                  type="button"
                  onClick={() => setViewAllOpen(true)}
                  className="text-sm font-medium text-drd-primary hover:text-drd-primary-dark"
                  dir="rtl"
                >
                  عرض الكل
                </button>
              ) : (
                <span className="inline-block h-6 w-[72px]" aria-hidden />
              )}
            </div>
            <h3 className="min-w-0 flex-1 text-right text-lg font-semibold font-heading text-drd-text" dir="rtl">
              {categoryName}
            </h3>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold font-heading text-drd-text">
              {categoryName}
            </h3>
            {meals.length > 2 && (
              <button
                type="button"
                onClick={() => setViewAllOpen(true)}
                className="text-sm font-medium text-drd-primary hover:text-drd-primary-dark"
              >
                View all
              </button>
            )}
          </>
        )}
      </div>

      <div className="relative mt-3 w-full overflow-x-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent z-0"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent z-0"
          aria-hidden
        />
        <div
          ref={scrollRef}
          data-allow-x-scroll="true"
          className="relative z-10 flex gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory px-4 pb-4 pr-8 hide-scrollbar overscroll-x-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="snap-start shrink-0 w-[220px] sm:w-[240px]"
            >
              <MobileMealCard item={meal} />
            </div>
          ))}
        </div>
      </div>

      {/* View all modal: body scroll locked; only modal content scrolls; overscroll-contained */}
      <AnimatePresence>
        {viewAllOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm"
            onClick={() => setViewAllOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="View all meals"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full sm:max-w-2xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white shadow-xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
                  <h3
                    className="text-lg font-semibold font-heading text-drd-text"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    {categoryName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setViewAllOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 text-drd-text/70"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 hide-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {meals.map((meal) => (
                      <MobileMealCard key={meal.id} item={meal} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Mobile: vertical stack of category rows, each with horizontal meal carousel
function MenuSectionMobileRows({ categories }: { categories: MenuCategory[] }) {
  return (
    <div className="block md:hidden w-full py-8">
      {categories.map((cat) => (
        <CategoryRowCarousel key={cat.id} category={cat} />
      ))}
    </div>
  );
}

export default function MenuSection({ categories: propCategories }: { categories?: MenuCategory[] }) {
  const { lang } = useLang();
  const categories = (propCategories && propCategories.length > 0) ? propCategories : FALLBACK_CATEGORIES;
  const visibleCategories = categories.filter(
    (cat) => Array.isArray(cat.items) && cat.items.length > 0
  );

  const NAV_OFFSET = 112;
  const SIDEBAR_RIGHT_RTL = 32; // Fixed viewport right padding for desktop RTL so sidebar stays on the right
  const [activeId, setActiveId] = useState<string>(visibleCategories[0]?.id ?? "");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarLeft, setSidebarLeft] = useState(0);
  const [sidebarRight, setSidebarRight] = useState<number | undefined>(undefined);
  const langRef = useRef(lang);
  langRef.current = lang;
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const menuStartRef = useRef<HTMLDivElement | null>(null);
  const menuEndRef = useRef<HTMLDivElement | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const menuSectionRef = useRef<HTMLElement | null>(null);
  const menuOverflowCleanupRef = useRef<(() => void) | null>(null);
  const scrollTickingRef = useRef(false);
  const visibleCategoriesRef = useRef(visibleCategories);
  visibleCategoriesRef.current = visibleCategories;
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

  // Desktop: fixed sidebar visibility (90% viewport rule) + position + scroll-spy. Only sets state; never scrolls. rAF-throttled.
  const MENU_VISIBILITY_THRESHOLD = 0.9;

  useEffect(() => {
    const update = () => {
      const sectionEl = menuSectionRef.current;
      const endEl = menuEndRef.current;
      const containerEl = menuContainerRef.current;
      if (!sectionEl || !endEl || !containerEl) return;

      const rect = sectionEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      const ratio = vh > 0 ? visibleHeight / vh : 0;
      const endY = endEl.getBoundingClientRect().top + window.scrollY;
      const shouldShowSidebar = ratio >= MENU_VISIBILITY_THRESHOLD && window.scrollY < endY;
      setSidebarVisible(shouldShowSidebar);

      const containerRect = containerEl.getBoundingClientRect();
      // RTL: sidebar on RIGHT (right padding); LTR: sidebar on LEFT (container left)
      if (langRef.current === "ar") {
        setSidebarRight(SIDEBAR_RIGHT_RTL);
        setSidebarLeft(0);
      } else {
        setSidebarRight(undefined);
        setSidebarLeft(containerRect.left);
      }

      const triggerY = window.scrollY + NAV_OFFSET + 16;
      const cats = visibleCategoriesRef.current;
      let nextId = cats[0]?.id ?? "";
      for (let i = 0; i < cats.length; i++) {
        const el = sectionRefs.current[cats[i].id];
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= triggerY) nextId = cats[i].id;
      }
      setActiveId((current) => (current === nextId ? current : nextId));
    };

    const onScrollOrResize = () => {
      if (scrollTickingRef.current) return;
      scrollTickingRef.current = true;
      requestAnimationFrame(() => {
        scrollTickingRef.current = false;
        update();
      });
    };

    const t = setTimeout(update, 150);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [lang]);

  // Dev-only: detect horizontal overflow in Menu section (outline red + console.log)
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const check = () => {
      const root = menuSectionRef.current ?? document.getElementById("menu");
      if (!root) return;
      const walk = (node: Element) => {
        if (node.nodeType !== 1) return;
        const el = node as HTMLElement;
        if (el.dataset.allowXScroll === "true") {
          el.style.outline = "";
          for (let i = 0; i < el.children.length; i++) walk(el.children[i]);
          return;
        }
        if (el.scrollWidth > el.clientWidth + 1) {
          el.style.outline = "2px solid red";
          console.warn("[Menu overflow]", el, { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth });
        } else {
          el.style.outline = "";
        }
        for (let i = 0; i < el.children.length; i++) walk(el.children[i]);
      };
      walk(root);
    };
    const t = setTimeout(() => {
      check();
      const root = menuSectionRef.current ?? document.getElementById("menu");
      if (root) {
        const ro = new ResizeObserver(check);
        ro.observe(root);
        menuOverflowCleanupRef.current = () => ro.disconnect();
      }
    }, 100);
    return () => {
      clearTimeout(t);
      menuOverflowCleanupRef.current?.();
      menuOverflowCleanupRef.current = null;
    };
  }, []);

  // Initialize scroll state for each category
  useEffect(() => {
    visibleCategories.forEach((cat) => {
      requestAnimationFrame(() => {
        updateScrollState(cat.id);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update arrow state on window resize (desktop meals rows)
  useEffect(() => {
    const onResize = () => {
      visibleCategories.forEach((cat) => updateScrollState(cat.id));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // RTL desktop: one-time initial scroll to the right so first logical item appears on the right. Run only when lang is "ar" and we have categories; do NOT re-run on every render (was causing snap-back).
  const rtlScrollInitDoneRef = useRef(false);
  useEffect(() => {
    if (lang !== "ar") {
      rtlScrollInitDoneRef.current = false;
      return;
    }
    if (visibleCategories.length === 0 || rtlScrollInitDoneRef.current) return;
    const t = setTimeout(() => {
      visibleCategories.forEach((cat) => {
        const el = scrollRefs.current[cat.id];
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) el.scrollLeft = max;
        updateScrollState(cat.id);
      });
      rtlScrollInitDoneRef.current = true;
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, visibleCategories.length]);

  // No scroll side effects when activeId changes — scrollIntoView here caused page bounce

  const handleCategoryClick = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(`menu-cat-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (visibleCategories.length === 0) return null;

  return (
    <section
      id="menu"
      ref={menuSectionRef}
      className="w-full relative bg-white py-16 sm:py-20"
    >
      <DecorativeVeggies section="menu" />
      {/* Desktop (md+): fixed portal sidebar (shown only when menu in view); content grid with spacer */}
      <div
        ref={menuContainerRef}
        className="hidden md:block max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div ref={menuStartRef} aria-hidden className="pointer-events-none h-0 overflow-hidden" />
        <div className="pt-10 md:pt-14">
          <div className="block md:hidden">
            <h2 className="text-3xl font-bold font-heading text-drd-text">Menu</h2>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-8 items-start">
          <div className="col-span-3 min-w-0" aria-hidden />
          <div className="col-span-9 min-w-0 space-y-12 overflow-x-hidden">
          {visibleCategories.map((cat) => {
            const state = scrollState[cat.id] ?? { canScrollLeft: false, canScrollRight: true };
            const isRtl = lang === "ar";
            const scrollStep = 316;
            // RTL: render items reversed so first logical item appears on the RIGHT. Scroll: left btn = scroll left (-), right btn = scroll right (+).
            const renderedItems = isRtl ? [...cat.items].reverse() : cat.items;
            const leftScrollAmount = -scrollStep;
            const rightScrollAmount = scrollStep;
            const leftDisabled = !state.canScrollLeft;
            const rightDisabled = !state.canScrollRight;
            const leftIsNext = isRtl;

            const LeftChevron = () => (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            );
            const RightChevron = () => (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            );

            return (
            <section
              key={cat.id}
              id={`menu-cat-${cat.id}`}
              data-category-id={cat.id}
              ref={(el) => {
                sectionRefs.current[cat.id] = el;
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
                  {itemCountLabel(lang, cat.items.length)}
                </span>
              </motion.header>

              {/* HORIZONTAL MEALS ROW: for Arabic desktop with 1–3 items, use non-scrolling right-aligned row so meals start on the right. For 4+ items use scrollable row with buttons (unchanged). */}
              {isRtl && cat.items.length <= 3 ? (
                <div className="flex w-full justify-end px-4 py-2" dir="ltr">
                  <div className="flex w-fit gap-4">
                  {renderedItems.map((item) => (
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
                        w-[280px] lg:w-[300px]
                        rounded-3xl border border-slate-100 bg-white/80
                        shadow-sm shadow-black/5
                        transition
                        hover:border-drd-primary/60 hover:bg-emerald-50/60 hover:shadow-lg hover:shadow-drd-primary/15
                      "
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
                        <SmartImage
                          src={item.image}
                          alt={tField(lang, item.nameEn, item.nameAr) || item.id || "Menu item"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 220px, 300px"
                        />
                      </div>
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
                            {item.price && formatPrice(item.price, lang) && (
                              <span className="ml-auto text-xs font-semibold text-drd-text">
                                {formatPrice(item.price, lang)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.article>
                  ))}
                  </div>
                </div>
              ) : (
              <div className="relative w-full min-w-0 overflow-x-hidden">
                <button
                  type="button"
                  onClick={() => {
                    const el = scrollRefs.current[cat.id];
                    if (!el) return;
                    el.scrollBy({ left: leftScrollAmount, behavior: "smooth" });
                  }}
                  disabled={leftDisabled}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm shadow-md transition ${
                    !leftDisabled
                      ? "text-drd-text/80 hover:bg-drd-primary hover:text-white opacity-100"
                      : "text-slate-300 opacity-0 pointer-events-none"
                  }`}
                  aria-label={leftIsNext ? "Scroll next" : "Scroll previous"}
                >
                  <span dir="ltr" className="inline-block"><LeftChevron /></span>
                </button>

                <div
                  dir="ltr"
                  data-allow-x-scroll="true"
                  ref={(el) => {
                    scrollRefs.current[cat.id] = el;
                  }}
                  onScroll={() => updateScrollState(cat.id)}
                  className="
                    flex gap-4
                    overflow-x-auto overflow-y-hidden
                    scroll-smooth
                    hide-scrollbar
                    px-10 py-2
                  "
                >
                  {renderedItems.map((item) => (
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
                          w-[280px] lg:w-[300px]
                          rounded-3xl border border-slate-100 bg-white/80
                          shadow-sm shadow-black/5
                          transition
                          hover:border-drd-primary/60 hover:bg-emerald-50/60 hover:shadow-lg hover:shadow-drd-primary/15
                        "
                      >
                        {/* image */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
                          <SmartImage
                            src={item.image}
                            alt={tField(lang, item.nameEn, item.nameAr) || item.id || "Menu item"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 220px, 300px"
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
                              {item.price && formatPrice(item.price, lang) && (
                                <span className="ml-auto text-xs font-semibold text-drd-text">
                                  {formatPrice(item.price, lang)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.article>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const el = scrollRefs.current[cat.id];
                    if (!el) return;
                    el.scrollBy({ left: rightScrollAmount, behavior: "smooth" });
                  }}
                  disabled={rightDisabled}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm shadow-md transition ${
                    !rightDisabled
                      ? "text-drd-text/80 hover:bg-drd-primary hover:text-white opacity-100"
                      : "text-slate-300 opacity-0 pointer-events-none"
                  }`}
                  aria-label={leftIsNext ? "Scroll previous" : "Scroll next"}
                >
                  <span dir="ltr" className="inline-block"><RightChevron /></span>
                </button>
              </div>
              )}
            </section>
            );
          })}
          </div>
        </div>
        <div ref={menuEndRef} aria-hidden className="pointer-events-none h-0 overflow-hidden" />
      </div>

      <FixedMenuSidebar
        visible={sidebarVisible}
        left={sidebarRight === undefined ? sidebarLeft : undefined}
        right={sidebarRight}
        top={NAV_OFFSET}
        categories={visibleCategories}
        activeId={activeId}
        onCategoryClick={handleCategoryClick}
      />

      {/* Mobile layout: category rows + horizontal carousel per category */}
      <MenuSectionMobileRows categories={visibleCategories} />
    </section>
  );
}

