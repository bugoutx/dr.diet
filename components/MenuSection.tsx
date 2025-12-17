"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  calories?: string;
  price?: string;
  tags?: string[];
  image: string;
};

export type MenuCategory = {
  id: string;
  label: string;
  description?: string;
  items: MenuItem[];
};

const categories: MenuCategory[] = [
  {
    id: "salads",
    label: "Salads",
    description:
      "Fresh, crisp salads packed with premium vegetables, proteins, and our house-made dressings. Each salad is carefully balanced for optimal nutrition and flavor.",
    items: [
      {
        id: "california-salad",
        name: "California Salad",
        description: "Arugula, tomato, avocado, rice, corn & grilled chicken",
        calories: "35g protein · 473 cal",
        tags: ["High Protein"],
        image: "/images/hero-california-salad.jpg",
      },
      {
        id: "mediterranean-quinoa",
        name: "Mediterranean Quinoa",
        description: "Quinoa, cucumber, feta, olives & lemon-herb dressing",
        calories: "28g protein · 420 cal",
        tags: ["High Fiber"],
        image: "/images/hero-energy-plate.jpg",
      },
      {
        id: "garden-fresh-bowl",
        name: "Garden Fresh Bowl",
        description: "Mixed greens, cherry tomatoes, bell peppers & tahini",
        calories: "22g protein · 320 cal",
        tags: ["Low Cal"],
        image: "/images/hero-radiance-smoothie.jpg",
      },
    ],
  },
  {
    id: "energy-dishes",
    label: "Energy Dishes",
    description:
      "High-protein plates featuring grilled chicken, lean meats, or fresh fish, paired with sautéed vegetables and smart carbohydrates for sustained energy.",
    items: [
      {
        id: "energy-plate",
        name: "Dr.Diet Energy Plate",
        description: "Grilled chicken, sautéed vegetables & smart carbs",
        calories: "48g protein · 350 cal",
        tags: ["High Protein"],
        image: "/images/hero-energy-plate.jpg",
      },
      {
        id: "grilled-salmon",
        name: "Grilled Salmon Delight",
        description: "Fresh salmon, roasted vegetables & lemon herb sauce",
        calories: "42g protein · 380 cal",
        tags: ["High Protein"],
        image: "/images/hero-california-salad.jpg",
      },
      {
        id: "beef-power-bowl",
        name: "Beef Power Bowl",
        description: "Lean beef, brown rice, broccoli & teriyaki glaze",
        calories: "45g protein · 420 cal",
        tags: ["High Protein"],
        image: "/images/hero-radiance-smoothie.jpg",
      },
    ],
  },
  {
    id: "sandwiches",
    label: "Sandwiches",
    description:
      "Satisfying sandwiches made with quality bread, fresh ingredients, and premium proteins. Perfect for a quick, nutritious meal on the go.",
    items: [
      {
        id: "chicken-avocado-wrap",
        name: "Chicken Avocado Wrap",
        description: "Grilled chicken, avocado, lettuce & whole grain wrap",
        calories: "32g protein · 450 cal",
        tags: ["High Protein"],
        image: "/images/hero-california-salad.jpg",
      },
      {
        id: "turkey-club",
        name: "Turkey Club",
        description: "Roasted turkey, bacon, lettuce, tomato & whole wheat",
        calories: "28g protein · 380 cal",
        tags: ["High Protein"],
        image: "/images/hero-energy-plate.jpg",
      },
      {
        id: "veggie-delight",
        name: "Veggie Delight",
        description: "Hummus, roasted vegetables, sprouts & multigrain bread",
        calories: "18g protein · 320 cal",
        tags: ["Low Cal"],
        image: "/images/hero-radiance-smoothie.jpg",
      },
    ],
  },
  {
    id: "breakfast",
    label: "Breakfast & Toast",
    description:
      "Start your day right with our energizing breakfast options and artisanal toasts. Fuel your morning with balanced nutrition and delicious flavors.",
    items: [
      {
        id: "protein-power-toast",
        name: "Protein Power Toast",
        description: "Whole grain toast, eggs, avocado & cherry tomatoes",
        calories: "25g protein · 380 cal",
        tags: ["High Protein"],
        image: "/images/hero-california-salad.jpg",
      },
      {
        id: "overnight-oats",
        name: "Overnight Oats Bowl",
        description: "Oats, Greek yogurt, berries & honey",
        calories: "20g protein · 350 cal",
        tags: ["High Fiber"],
        image: "/images/hero-energy-plate.jpg",
      },
      {
        id: "avocado-smash-toast",
        name: "Avocado Smash Toast",
        description: "Sourdough, smashed avocado, feta & poached egg",
        calories: "15g protein · 320 cal",
        tags: ["Low Cal"],
        image: "/images/hero-radiance-smoothie.jpg",
      },
    ],
  },
  {
    id: "smoothies",
    label: "Smoothies & Juices",
    description:
      "Fresh, natural beverages packed with vitamins and nutrients. Our smoothies and juices are made with real fruits and vegetables for clean, refreshing energy.",
    items: [
      {
        id: "radiance-smoothie",
        name: "Radiance Smoothie",
        description: "Low-fat milk, avocado, banana & honey",
        calories: "12g protein · 343 cal",
        tags: ["High Fiber"],
        image: "/images/hero-california-salad.jpg",
      },
      {
        id: "green-power-juice",
        name: "Green Power Juice",
        description: "Spinach, apple, cucumber, lemon & ginger",
        calories: "5g protein · 180 cal",
        tags: ["Low Cal"],
        image: "/images/hero-energy-plate.jpg",
      },
      {
        id: "protein-boost-smoothie",
        name: "Protein Boost Smoothie",
        description: "Protein powder, berries, almond milk & chia seeds",
        calories: "28g protein · 320 cal",
        tags: ["High Protein"],
        image: "/images/hero-radiance-smoothie.jpg",
      },
    ],
  },
  {
    id: "snacks",
    label: "Smart Snacks",
    description:
      "Healthy, satisfying snacks perfect for between meals. Nutrient-dense options that keep you energized without compromising your wellness goals.",
    items: [
      {
        id: "protein-energy-balls",
        name: "Protein Energy Balls",
        description: "Dates, almonds, protein powder & coconut",
        calories: "8g protein · 120 cal",
        tags: ["High Protein"],
        image: "/images/hero-california-salad.jpg",
      },
      {
        id: "veggie-sticks-hummus",
        name: "Veggie Sticks & Hummus",
        description: "Fresh vegetables & house-made hummus",
        calories: "6g protein · 150 cal",
        tags: ["Low Cal"],
        image: "/images/hero-energy-plate.jpg",
      },
      {
        id: "trail-mix-delight",
        name: "Trail Mix Delight",
        description: "Nuts, seeds, dried fruits & dark chocolate chips",
        calories: "10g protein · 200 cal",
        tags: ["High Fiber"],
        image: "/images/hero-radiance-smoothie.jpg",
      },
    ],
  },
  {
    id: "sauces",
    label: "Sauces",
    description:
      "Enhance your meals with our house-made sauces. Each sauce is crafted with wholesome ingredients to add flavor without excess calories.",
    items: [
      {
        id: "lemon-herb-dressing",
        name: "Lemon Herb Dressing",
        description: "Fresh lemon, herbs, olive oil & garlic",
        calories: "2g protein · 45 cal",
        tags: ["Low Cal"],
        image: "/images/hero-california-salad.jpg",
      },
      {
        id: "tahini-sauce",
        name: "Tahini Sauce",
        description: "Tahini, lemon, garlic & water",
        calories: "4g protein · 80 cal",
        tags: ["High Fiber"],
        image: "/images/hero-energy-plate.jpg",
      },
      {
        id: "spicy-chipotle",
        name: "Spicy Chipotle",
        description: "Chipotle peppers, yogurt & lime",
        calories: "1g protein · 35 cal",
        tags: ["Low Cal"],
        image: "/images/hero-radiance-smoothie.jpg",
      },
    ],
  },
];

// Animation variants for menu item cards
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -4, scale: 1.02 },
};

export default function MenuSection() {
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
                    <span>{cat.label}</span>
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
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold font-heading text-drd-text mb-1">
                    {cat.label}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-drd-text/70 leading-relaxed">
                      {cat.description}
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

                {/* SCROLLABLE CONTAINER */}
                <div
                  ref={(el) => {
                    scrollRefs.current[cat.id] = el;
                  }}
                  onScroll={() => updateScrollState(cat.id)}
                  className="flex gap-4 pb-2 overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                      className="group min-w-[220px] max-w-[260px] shrink-0 snap-start rounded-3xl border border-slate-100 bg-white/80 shadow-sm shadow-black/5 transition hover:border-drd-primary/60 hover:bg-emerald-50/60 hover:shadow-lg hover:shadow-drd-primary/15"
                    >
                      {/* image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 220px, 260px"
                        />
                      </div>

                      {/* text */}
                      <div className="p-3">
                        <h4 className="text-sm font-semibold font-heading text-drd-text mb-1">
                          {item.name}
                        </h4>
                        {item.calories && (
                          <p className="mt-1 text-[11px] text-drd-text/60">
                            {item.calories}
                          </p>
                        )}
                        {item.description && (
                          <p className="mt-2 text-xs text-drd-text/70 line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        {(item.tags?.length || item.price) && (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {item.tags?.map((tag) => {
                              const isHighProtein = tag === "High Protein";
                              const isLowCal = tag === "Low Cal";
                              return (
                                <span
                                  key={tag}
                                  className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide font-semibold ${
                                    isHighProtein
                                      ? "bg-drd-primary/20 text-drd-primary"
                                      : isLowCal
                                      ? "bg-drd-accent/20 text-drd-accent"
                                      : "bg-drd-primary/15 text-drd-primary-dark"
                                  }`}
                                >
                                  {tag}
                                </span>
                              );
                            })}
                            {item.price && (
                              <span className="ml-auto text-xs font-semibold text-drd-text">
                                {item.price}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.article>
                  ))}
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
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

