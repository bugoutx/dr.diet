"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Testimonial = {
  name: string;
  tag: string;
  content: string;
  rating: number;
};

const testimonials: Testimonial[] = [
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
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-drd-primary/10 text-drd-primary text-xs font-semibold rounded-full">
                    Verified Customer
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-drd-text mb-1">{testimonial.name}</h3>
                <p className="text-sm text-drd-muted">{testimonial.tag}</p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < testimonial.rating} />
                ))}
              </div>
            </div>

            {/* Full Content */}
            <div className="relative">
              <div className="absolute top-0 left-0 text-6xl text-drd-accent/20 font-serif leading-none">❝</div>
              <p className="text-drd-text leading-relaxed pl-8 text-lg">{testimonial.content}</p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-3 pt-4 border-t border-drd-primary/10">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20 flex items-center justify-center ring-2 ring-drd-primary/30">
                  <span className="text-drd-primary font-semibold text-xl">{testimonial.name.charAt(0)}</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-drd-text">{testimonial.name}</p>
                <p className="text-sm text-drd-muted">{testimonial.tag}</p>
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
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(getComputedStyle(contentRef.current).lineHeight);
      const maxHeight = lineHeight * 6; // 6 lines
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight);
    }
  }, []);

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

      {/* Verified Customer Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-2.5 py-1 bg-drd-primary/10 text-drd-primary text-xs font-semibold rounded-full">
          Verified Customer
        </span>
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4 justify-end relative z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < testimonial.rating} />
        ))}
      </div>

      {/* Quote Text */}
      <p
        ref={contentRef}
        className={`text-drd-text mb-4 leading-relaxed relative z-10 flex-1 ${
          !isExpanded ? "line-clamp-6" : ""
        }`}
      >
        {testimonial.content}
      </p>

      {/* Read More Link */}
      {needsTruncation && !isExpanded && (
        <button
          onClick={onReadMore}
          className="text-sm text-drd-primary hover:text-drd-primary-dark font-medium mb-4 text-left relative z-10 transition-colors"
        >
          Read more →
        </button>
      )}

      {/* Customer Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-drd-primary/10 relative z-10">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20 flex items-center justify-center ring-2 ring-drd-primary/30 flex-shrink-0">
            <span className="text-drd-primary font-semibold text-lg">{testimonial.name.charAt(0)}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-drd-text text-sm truncate">{testimonial.name}</p>
          <p className="text-xs text-drd-muted truncate">{testimonial.tag}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;
    const threshold = 4;

    setCanScrollLeft(scrollLeft > threshold);
    setCanScrollRight(scrollLeft < maxScrollLeft - threshold);

    // Calculate active dot based on scroll position
    const cardWidth = 380; // Approximate card width + gap
    const newActiveDot = Math.round(scrollLeft / cardWidth);
    setActiveDot(Math.min(newActiveDot, testimonials.length - 1));
  };

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
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-64 pb-16 md:pt-72 md:py-24 overflow-hidden">
      {/* Subtle off-white background */}
      <div className="absolute inset-0 bg-[#fbfcfa]" />

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
            Loved by Healthy Food Lovers
          </h2>
          <p className="text-lg text-drd-muted max-w-2xl mx-auto">
            People choose Dr.Diet for everyday balanced meals that fuel their active lifestyles
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full border-2 border-drd-primary text-drd-primary hover:bg-drd-primary hover:text-white transition-all duration-200 flex items-center justify-center bg-white shadow-lg z-20 focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2 ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon />
          </button>

          {/* Scrollable Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                onReadMore={() => setSelectedTestimonial(testimonial)}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full border-2 border-drd-accent text-drd-accent hover:bg-drd-accent hover:text-white transition-all duration-200 flex items-center justify-center bg-white shadow-lg z-20 focus:outline-none focus:ring-2 focus:ring-drd-accent focus:ring-offset-2 ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => {
            const isActive = index === activeDot;
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (scrollRef.current) {
                    const cardWidth = 380;
                    scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
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
