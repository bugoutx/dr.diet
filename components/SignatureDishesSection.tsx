"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Meal = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  protein: number; // in grams
  calories: number;
  carbs?: number; // in grams
  tags: string[];
  ingredients?: string[];
  allergens?: string[];
  nutritionFacts?: {
    fat?: number;
    fiber?: number;
    sugar?: number;
  };
  isMostLoved?: boolean;
};

const meals: Meal[] = [
  {
    id: "energy-plate",
    name: "Dr.Diet Energy Plate",
    subtitle: "Energy Dish · Chicken",
    description: "Grilled chicken with sautéed vegetables and smart carbs for sustained energy throughout your day.",
    image: "/images/hero-energy-plate.jpg",
    protein: 48,
    calories: 350,
    carbs: 25,
    tags: ["High Protein", "Low Cal", "Balanced", "Gluten-Free"],
    ingredients: ["Grilled chicken breast", "Sautéed vegetables", "Brown rice", "Lemon herb sauce"],
    allergens: ["None"],
    nutritionFacts: {
      fat: 8,
      fiber: 6,
      sugar: 3,
    },
    isMostLoved: true,
  },
  {
    id: "california-salad",
    name: "California Salad",
    subtitle: "Salad · High Protein",
    description: "Arugula, tomato, avocado, rice, corn & 100g grilled chicken. Fresh, crisp, and perfectly balanced.",
    image: "/images/hero-california-salad.jpg",
    protein: 35,
    calories: 473,
    carbs: 42,
    tags: ["High Protein", "High Fiber", "Fresh", "Vegetables"],
    ingredients: ["Arugula", "Cherry tomatoes", "Avocado", "Brown rice", "Corn", "Grilled chicken"],
    allergens: ["None"],
    nutritionFacts: {
      fat: 18,
      fiber: 8,
      sugar: 5,
    },
    isMostLoved: true,
  },
  {
    id: "radiance-smoothie",
    name: "Radiance Smoothie",
    subtitle: "Smoothie · Energy",
    description: "Low-fat milk, avocado, banana & honey for clean energy. Perfect for breakfast or a midday boost.",
    image: "/images/hero-radiance-smoothie.jpg",
    protein: 12,
    calories: 343,
    carbs: 52,
    tags: ["High Fiber", "Natural", "Energy Boost", "Dairy"],
    ingredients: ["Low-fat milk", "Avocado", "Banana", "Honey", "Ice"],
    allergens: ["Dairy"],
    nutritionFacts: {
      fat: 10,
      fiber: 7,
      sugar: 38,
    },
  },
  {
    id: "salmon-delight",
    name: "Grilled Salmon Delight",
    subtitle: "Energy Dish · Fish",
    description: "Fresh salmon with roasted vegetables and lemon herb sauce. Rich in omega-3 and protein.",
    image: "/images/hero-energy-plate.jpg",
    protein: 42,
    calories: 380,
    carbs: 22,
    tags: ["High Protein", "Omega-3", "Low Cal", "Seafood"],
    ingredients: ["Fresh salmon fillet", "Roasted vegetables", "Lemon herb sauce", "Quinoa"],
    allergens: ["Fish"],
    nutritionFacts: {
      fat: 15,
      fiber: 4,
      sugar: 2,
    },
  },
  {
    id: "quinoa-bowl",
    name: "Mediterranean Quinoa Bowl",
    subtitle: "Salad · Vegetarian",
    description: "Quinoa, cucumber, feta, olives & lemon-herb dressing. A complete plant-based meal.",
    image: "/images/hero-california-salad.jpg",
    protein: 28,
    calories: 420,
    carbs: 48,
    tags: ["Vegetarian", "High Fiber", "Balanced", "Plant-Based"],
    ingredients: ["Quinoa", "Cucumber", "Feta cheese", "Kalamata olives", "Lemon-herb dressing"],
    allergens: ["Dairy"],
    nutritionFacts: {
      fat: 16,
      fiber: 9,
      sugar: 4,
    },
  },
];

// Helper component for Macro Tile
function MacroTile({ label, value, unit, icon }: { label: string; value: number; unit: string; icon: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 hover:border-drd-primary/40">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-semibold text-drd-text/60 uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-drd-primary">{value}</span>
        <span className="text-sm text-drd-text/60 font-medium">{unit}</span>
      </div>
    </div>
  );
}

// Helper component for Benefit Tile
function BenefitTile({ benefits }: { benefits: string[] }) {
  return (
    <div className="bg-gradient-to-br from-emerald-50/80 via-emerald-50/60 to-white/80 backdrop-blur-sm rounded-2xl p-4 border border-emerald-200/40 shadow-sm hover:shadow-md transition-all duration-300 hover:border-drd-primary/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">✨</span>
        <span className="text-xs font-semibold text-drd-text/70 uppercase tracking-wide">Benefits</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {benefits.slice(0, 3).map((benefit, idx) => (
          <span
            key={idx}
            className="inline-block px-2 py-1 bg-drd-primary/15 text-drd-primary text-[10px] font-semibold rounded-full"
          >
            {benefit}
          </span>
        ))}
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

// Meal Slide Component
function MealSlide({ meal }: { meal: Meal }) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const topTags = meal.tags.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* LEFT COLUMN: Media Stack */}
      <div className="space-y-4">
        {/* Large Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-white/70 backdrop-blur-sm group hover:shadow-2xl hover:shadow-drd-primary/10 transition-all duration-300"
        >
          {meal.isMostLoved && (
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-drd-primary shadow-lg border border-drd-primary/20">
                <span>⭐</span>
                <span>Most Loved</span>
              </span>
            </div>
          )}
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </motion.div>

        {/* Two Smaller Tiles */}
        <div className="grid grid-cols-2 gap-4">
          {/* Macro Highlights Tile */}
          <MacroTile
            label="Protein"
            value={meal.protein}
            unit="g"
            icon="💪"
          />
          <MacroTile
            label="Calories"
            value={meal.calories}
            unit="cal"
            icon="🔥"
          />
        </div>

        {/* Benefit Tile (full width) */}
        <BenefitTile benefits={meal.tags} />
      </div>

      {/* RIGHT COLUMN: Details Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="flex flex-col justify-center"
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/60 shadow-lg">
          {/* Title & Subtitle */}
          <div className="mb-4">
            <h3 className="text-3xl md:text-4xl font-bold font-heading text-drd-text mb-2 tracking-tight">
              {meal.name}
            </h3>
            <p className="text-sm font-medium text-drd-text/60 uppercase tracking-wide">
              {meal.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-base text-drd-text/80 leading-relaxed mb-6">
            {meal.description}
          </p>

          {/* Nutrition Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {topTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 bg-drd-primary/10 text-drd-primary text-xs font-semibold rounded-full border border-drd-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Price & Calories Line */}
          <div className="flex items-center justify-between py-4 mb-6 border-y border-slate-200/60">
            <div>
              <p className="text-sm text-drd-text/60 mb-1">Nutrition per serving</p>
              <p className="text-lg font-bold text-drd-primary">
                {meal.protein}g protein · {meal.calories} cal
                {meal.carbs && ` · ${meal.carbs}g carbs`}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              type="button"
              className="flex-1 px-6 py-3.5 bg-drd-primary text-white rounded-full font-semibold hover:bg-drd-primary-dark transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-drd-primary/30 hover:scale-[1.02]"
            >
              Order Now
            </button>
            <button
              type="button"
              className="flex-1 px-6 py-3.5 bg-white border-2 border-drd-primary text-drd-primary rounded-full font-semibold hover:bg-drd-primary/5 transition-all duration-300"
            >
              View Details
            </button>
          </div>

          {/* Accordions */}
          <div className="space-y-0">
            {meal.ingredients && (
              <AccordionItem
                title="Ingredients"
                isOpen={openAccordion === "ingredients"}
                onToggle={() => toggleAccordion("ingredients")}
              >
                <ul className="list-disc list-inside space-y-1 text-drd-text/70">
                  {meal.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </AccordionItem>
            )}

            {meal.allergens && (
              <AccordionItem
                title="Allergens"
                isOpen={openAccordion === "allergens"}
                onToggle={() => toggleAccordion("allergens")}
              >
                <p className="text-drd-text/70">
                  {meal.allergens.length > 0 && meal.allergens[0] !== "None"
                    ? meal.allergens.join(", ")
                    : "No known allergens"}
                </p>
              </AccordionItem>
            )}

            {meal.nutritionFacts && (
              <AccordionItem
                title="Full Nutrition Facts"
                isOpen={openAccordion === "nutrition"}
                onToggle={() => toggleAccordion("nutrition")}
              >
                <div className="space-y-2 text-drd-text/70">
                  {meal.nutritionFacts.fat !== undefined && (
                    <p>Fat: {meal.nutritionFacts.fat}g</p>
                  )}
                  {meal.nutritionFacts.fiber !== undefined && (
                    <p>Fiber: {meal.nutritionFacts.fiber}g</p>
                  )}
                  {meal.nutritionFacts.sugar !== undefined && (
                    <p>Sugar: {meal.nutritionFacts.sugar}g</p>
                  )}
                </div>
              </AccordionItem>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Arrow Button Component
function ArrowButton({ direction, onClick, disabled }: { direction: "left" | "right"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 shadow-lg flex items-center justify-center transition-all duration-300 ${
        direction === "left" ? "left-0 -translate-x-4 md:-translate-x-8" : "right-0 translate-x-4 md:translate-x-8"
      } ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-white hover:scale-110 hover:shadow-xl hover:border-drd-primary/40"
      }`}
      aria-label={direction === "left" ? "Previous meal" : "Next meal"}
    >
      <svg
        className={`w-6 h-6 ${disabled ? "text-drd-text/40" : "text-drd-primary"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
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
          className={`transition-all duration-300 rounded-full ${
            index === currentIndex
              ? "w-8 h-2 bg-drd-primary"
              : "w-2 h-2 bg-drd-primary/30 hover:bg-drd-primary/50"
          }`}
          aria-label={`Go to meal ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default function SignatureDishesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % meals.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + meals.length) % meals.length);
  };

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

  // Keyboard navigation
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
  }, []);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < meals.length - 1;

  return (
    <section id="signature-dishes" className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-transparent to-drd-bg/20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4 tracking-tight">
            Our Most-Loved Plates
          </h2>
          <p className="text-lg md:text-xl text-drd-text/70 max-w-2xl mx-auto">
            Top sellers and crowd favorites that keep our customers coming back for more.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Navigation Arrows */}
          <ArrowButton direction="left" onClick={prevSlide} disabled={!canGoPrev} />
          <ArrowButton direction="right" onClick={nextSlide} disabled={!canGoNext} />

          {/* Carousel Content */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <MealSlide meal={meals[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <DotsIndicator count={meals.length} currentIndex={currentIndex} onDotClick={goToSlide} />
        </div>
      </div>
    </section>
  );
}
