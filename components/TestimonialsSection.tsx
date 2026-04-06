"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";
import DecorativeVeggies from "@/components/DecorativeVeggies";

export type Testimonial = {
  name: string;
  tag: string;
  content: string;
  rating: number;
};

// Fallback when DB has no testimonials
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Johnson",
    tag: "Gym Member",
    content:
      "Dr.Diet has transformed my relationship with food. Every meal is delicious and perfectly balanced for my fitness goals. I've never felt better! The consistency and quality are unmatched, and I love how transparent they are about macros and ingredients.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    tag: "Office Worker",
    content:
      "I love that they show protein and calories on every meal. It makes tracking so easy, and the food actually tastes amazing. Perfect for my busy lifestyle. I've been ordering for 6 months and never had a bad meal.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    tag: "Health Coach",
    content:
      "As a nutritionist, I recommend Dr.Diet to all my clients. The meal plans are scientifically sound, delicious, and the macros are always transparent. It's the perfect solution for people who want healthy food without the hassle of meal prep.",
    rating: 5,
  },
  {
    name: "Ahmed Al-Mahmoud",
    tag: "Fitness Enthusiast",
    content:
      "The consistency is incredible. Every meal is fresh, perfectly portioned, and the high-protein options keep me full and energized throughout the day. I've tried many meal services, and Dr.Diet is by far the best.",
    rating: 5,
  },
  {
    name: "Jessica Martinez",
    tag: "Yoga Instructor",
    content:
      "I appreciate how Dr.Diet focuses on whole, nutritious ingredients. Every meal feels like it was made with care. The variety keeps me excited about healthy eating, and my energy levels have improved significantly.",
    rating: 5,
  },
  {
    name: "David Kim",
    tag: "Entrepreneur",
    content:
      "Time is my most valuable asset, and Dr.Diet saves me hours every week. The meals are restaurant-quality but designed for my health goals. I can't imagine going back to meal prep or fast food.",
    rating: 5,
  },
];

// Star Icon Component
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-4 h-4 ${filled ? "text-drd-accent" : "text-drd-accent/20"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

// Chevron Icons
function ChevronLeftIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

interface TestimonialModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
}

function TestimonialModal({ testimonial, onClose }: TestimonialModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();

  useEffect(() => {
    if (!testimonial) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [testimonial, onClose]);

  if (!testimonial) return null;

  const name = tField(lang, testimonial.name, testimonial.name);
  const tag = tField(lang, testimonial.tag, testimonial.tag);
  const content = tField(lang, testimonial.content, testimonial.content);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm text-drd-text/70 hover:text-drd-primary transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 w-full mb-2 flex-wrap">
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 bg-drd-primary/10 text-drd-primary text-xs font-semibold shrink-0" dir={lang === "ar" ? "rtl" : "ltr"}>
                    {tField(lang, "Verified Customer", "عميل موثّق")}
                  </span>
                  <div className="inline-flex items-center gap-1 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} filled={i < testimonial.rating} />
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-heading text-drd-text mb-1">{name}</h3>
                <p className="text-sm text-drd-muted">{tag}</p>
              </div>
            </div>

            {/* Full Content */}
            <div className="relative">
              <div className="absolute top-0 left-0 text-6xl text-drd-accent/20 font-serif leading-none">❝</div>
              <p className="text-drd-text leading-relaxed pl-8 text-lg">{content}</p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-3 pt-4 border-t border-drd-primary/10">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20 flex items-center justify-center ring-2 ring-drd-primary/30">
                  <span className="text-drd-primary font-semibold text-xl">{name.charAt(0)}</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-drd-text">{name}</p>
                <p className="text-sm text-drd-muted">{tag}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  onReadMore: () => void;
}

function TestimonialCard({ testimonial, onReadMore }: TestimonialCardProps) {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const { lang } = useLang();
  const name = tField(lang, testimonial.name, testimonial.name);
  const tag = tField(lang, testimonial.tag, testimonial.tag);
  const content = tField(lang, testimonial.content, testimonial.content);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(getComputedStyle(contentRef.current).lineHeight);
      const maxHeight = lineHeight * 6; // 6 lines
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight);
    }
  }, [content]);

  return (
    <motion.div
      className="relative bg-white rounded-3xl p-6 border border-drd-primary/10 shadow-sm hover:border-drd-primary/30 hover:shadow-lg transition-all duration-200 flex flex-col h-full min-w-[320px] md:min-w-[360px] snap-start"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Quote Watermark */}
      <div className="absolute top-8 right-8 text-8xl text-drd-primary/5 font-serif leading-none pointer-events-none">❝</div>

      {/* Verified Customer Badge + Stars in one row to avoid overlap (RTL-safe) */}
      <div className={`flex items-center justify-between gap-3 w-full mb-4 relative z-10 ${lang === "ar" ? "flex-row-reverse" : ""}`}>
        <span className="inline-flex items-center rounded-full px-3 py-1.5 bg-drd-primary/10 text-drd-primary text-xs font-semibold shrink-0" dir={lang === "ar" ? "rtl" : "ltr"}>
          {tField(lang, "Verified Customer", "عميل موثّق")}
        </span>
        <div className="inline-flex items-center gap-1 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < testimonial.rating} />
          ))}
        </div>
      </div>

      {/* Quote Text */}
      <p
        ref={contentRef}
        className={`text-drd-text mb-4 leading-relaxed relative z-10 flex-1 ${
          needsTruncation ? "line-clamp-6" : ""
        }`}
      >
        {content}
      </p>

      {/* Read More Link */}
      {needsTruncation && (
        <button
          onClick={onReadMore}
          className={`text-sm text-drd-primary hover:text-drd-primary-dark font-medium mb-4 relative z-10 transition-colors ${lang === "ar" ? "text-right w-full" : "text-left"}`}
        >
          {tField(lang, "Read more →", "اقرأ المزيد ←")}
        </button>
      )}

      {/* Customer Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-drd-primary/10 relative z-10">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20 flex items-center justify-center ring-2 ring-drd-primary/30 flex-shrink-0">
            <span className="text-drd-primary font-semibold text-lg">{name.charAt(0)}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-drd-text text-sm truncate">{name}</p>
          <p className="text-xs text-drd-muted truncate">{tag}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection({ testimonials: propTestimonials }: { testimonials?: Testimonial[] }) {
  const testimonials = (propTestimonials && propTestimonials.length > 0) ? propTestimonials : FALLBACK_TESTIMONIALS;
  const { lang } = useLang();
  const isRtl = lang === "ar";

  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;
    const threshold = 4;

    setCanScrollLeft(scrollLeft > threshold);
    setCanScrollRight(scrollLeft < maxScrollLeft - threshold);

    // Calculate active dot: RTL has reversed order so map scroll position to original index
    const cardWidth = 380;
    const rawIndex = Math.round(scrollLeft / cardWidth);
    const newActiveDot = isRtl
      ? Math.max(0, testimonials.length - 1 - rawIndex)
      : Math.min(rawIndex, testimonials.length - 1);
    setActiveDot(Math.max(0, Math.min(newActiveDot, testimonials.length - 1)));
  }, [isRtl, testimonials.length]);

  useEffect(() => {
    updateScrollState();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", updateScrollState);
      window.addEventListener("resize", updateScrollState);
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", updateScrollState);
      }
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollAmount = 380;
  const cardWidth = 380;
  const scrollPrev = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };
  const scrollNext = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };
  // With reversed order in RTL: left button scrolls left (scrollBy -) = cards move left. Same as LTR for scroll direction.
  const leftHandler = scrollPrev;
  const rightHandler = scrollNext;
  const leftDisabled = !canScrollLeft;
  const rightDisabled = !canScrollRight;

  const renderedTestimonials = isRtl ? [...testimonials].reverse() : testimonials;

  // RTL: one-time initial scroll so first card appears on the right (end of scroll content)
  const rtlScrollInitDoneRef = useRef(false);
  useEffect(() => {
    if (lang !== "ar") {
      rtlScrollInitDoneRef.current = false;
      return;
    }
    if (renderedTestimonials.length === 0 || rtlScrollInitDoneRef.current) return;
    const t = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max > 0) {
        el.scrollLeft = max;
        updateScrollState();
      }
      rtlScrollInitDoneRef.current = true;
    }, 80);
    return () => clearTimeout(t);
  }, [lang, renderedTestimonials.length, updateScrollState]);

  return (
    <section id="testimonials" className="relative py-16 md:py-20 overflow-hidden">
      {/* Subtle off-white background */}
      <div className="absolute inset-0 bg-[#fbfcfa]" />
      <DecorativeVeggies section="testimonials" />
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-drd-primary/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-drd-accent/8 rounded-full blur-3xl pointer-events-none" />

      {/* Optional: Faint dotted grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #8CBF4F 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 pt-8 z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4">
            {tField(lang, "Loved by Healthy Food Lovers", "محبوب من عشّاق الأكل الصحي")}
          </h2>
          <p className="text-lg text-drd-muted max-w-2xl mx-auto text-center" dir={lang === "ar" ? "rtl" : "ltr"}>
            {tField(
              lang,
              "People choose Dr.Diet for everyday balanced meals that fuel their active lifestyles",
              "يختار الناس د.دايت لوجبات يومية متوازنة تدعم أسلوب حياتهم النشط"
            )}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow: RTL = next (scroll right), LTR = prev (scroll left) */}
          <button
            type="button"
            onClick={leftHandler}
            disabled={leftDisabled}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center bg-white shadow-lg z-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isRtl
                ? `border-drd-accent text-drd-accent hover:bg-drd-accent hover:text-white focus:ring-drd-accent ${leftDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}`
                : `border-drd-primary text-drd-primary hover:bg-drd-primary hover:text-white focus:ring-drd-primary ${leftDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}`
            }`}
            aria-label={isRtl ? "Scroll next" : "Scroll left"}
          >
            <ChevronLeftIcon />
          </button>

          {/* Scrollable Carousel: dir="ltr" so scrollBy is consistent in RTL */}
          <div
            ref={scrollRef}
            dir="ltr"
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {renderedTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={isRtl ? testimonials.length - 1 - index : index}
                testimonial={testimonial}
                onReadMore={() => setSelectedTestimonial(testimonial)}
              />
            ))}
          </div>

          {/* Right Arrow: RTL = prev (scroll left), LTR = next (scroll right) */}
          <button
            type="button"
            onClick={rightHandler}
            disabled={rightDisabled}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center bg-white shadow-lg z-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isRtl
                ? `border-drd-primary text-drd-primary hover:bg-drd-primary hover:text-white focus:ring-drd-primary ${rightDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}`
                : `border-drd-accent text-drd-accent hover:bg-drd-accent hover:text-white focus:ring-drd-accent ${rightDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}`
            }`}
            aria-label={isRtl ? "Scroll previous" : "Scroll right"}
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => {
            const isActive = index === activeDot;
            const scrollTarget = isRtl ? (testimonials.length - 1 - index) * cardWidth : index * cardWidth;
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({ left: scrollTarget, behavior: "smooth" });
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 hover:bg-drd-primary/60 ${
                  isActive ? "w-8 bg-drd-primary" : "w-2 bg-drd-primary/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <TestimonialModal testimonial={selectedTestimonial} onClose={() => setSelectedTestimonial(null)} />
    </section>
  );
}
