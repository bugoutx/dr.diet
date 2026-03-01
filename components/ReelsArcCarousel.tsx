"use client";

/**
 * REELS CAROUSEL
 * Translate-based carousel: no internal scrollbar, no duplicate slides.
 * Constrained to site container (max-w-6xl). Renders exactly N videos.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

const GAP_PX = 20; // gap-5

/** Card width by breakpoint: <640 220, sm 240, md 260, lg 280, xl 300 */
function getCardWidthPx(width: number): number {
  if (width >= 1280) return 300;
  if (width >= 1024) return 280;
  if (width >= 768) return 260;
  if (width >= 640) return 240;
  return 220;
}

export type Reel = { id: string; src: string; poster: string; titleEn?: string; titleAr?: string };

interface SlideCardProps {
  reel: Reel;
  onClick: () => void;
  isVisible: boolean;
  isActive: boolean;
}

function SlideCard({ reel, onClick, isVisible, isActive }: SlideCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang } = useLang();
  const title = tField(lang, reel.titleEn, reel.titleAr);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isVisible) {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  }, [isVisible]);

  return (
    <div
      className={`shrink-0 w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] max-w-full aspect-[9/16] transition-transform duration-300 ease-out ${
        isActive ? "scale-100" : "scale-[0.95] opacity-80"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden border border-drd-primary/15 shadow-lg hover:shadow-xl transition-shadow duration-300 transition-colors duration-200 hover:border-drd-accent/40 focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-drd-primary via-emerald-300 to-drd-primary z-20" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-drd-accent z-20" />
        <div className="relative w-full h-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20">
          <video
            ref={videoRef}
            src={reel.src}
            poster={reel.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="h-full w-full object-cover rounded-3xl"
          />
        </div>
        {title ? (
          <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1.5 px-2 text-center truncate" dir={lang === "ar" ? "rtl" : "ltr"}>
            {title}
          </p>
        ) : null}
      </button>
    </div>
  );
}

interface VideoModalProps {
  reel: Reel | null;
  onClose: () => void;
}

function VideoModal({ reel, onClose }: VideoModalProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const title = reel ? tField(lang, reel.titleEn, reel.titleAr) : "";

  useEffect(() => {
    if (!reel) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
          setIsMuted(true);
        }
      });
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [reel, onClose]);

  if (!reel) return null;

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
          className="relative w-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute -top-12 right-0 text-white hover:text-drd-accent transition-colors z-10" aria-label="Close">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
            {title ? (
              <p className="px-4 py-2 text-center text-drd-text font-medium bg-white/80" dir={lang === "ar" ? "rtl" : "ltr"}>{title}</p>
            ) : null}
            <div className="relative aspect-[9/16] w-full bg-black" style={{ maxHeight: "80vh", maxWidth: "90vw" }}>
              <video
                ref={videoRef}
                src={reel.src}
                poster={reel.poster}
                loop
                playsInline
                controls
                muted={isMuted}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function useVisibleCountAndCardWidth(count: number) {
  const [visible, setVisible] = useState(1);
  const [cardWidth, setCardWidth] = useState(220);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCardWidth(getCardWidthPx(w));
      const v = w >= 1024 ? 3 : w >= 768 ? 2 : 1;
      setVisible(Math.min(v, count));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [count]);
  return { visible, cardWidth };
}

export default function ReelsArcCarousel({ reels }: { reels: Reel[] }) {
  const items = reels.length > 0 ? reels : [{ id: "fb1", src: "/reels/reel-1.mp4", poster: "", titleEn: undefined, titleAr: undefined }];
  const count = items.length;
  const { visible, cardWidth } = useVisibleCountAndCardWidth(count);
  const maxIndex = Math.max(0, count - visible);
  const showNav = count > visible;

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Clamp activeIndex when visible or count changes
  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Translate from fixed card width + gap (no measurement)
  const translatePx = showNav ? activeIndex * (cardWidth + GAP_PX) : 0;
  const trackTranslate = -translatePx;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const handleReelClick = useCallback((reel: Reel) => {
    setSelectedReel(reel);
  }, []);

  const handleModalClose = useCallback(() => setSelectedReel(null), []);

  return (
    <section className="relative pt-0 pb-16 md:pb-20 bg-transparent w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stage: min-height, hidden overflow, margin below */}
        <div className="relative w-full overflow-hidden min-h-[420px] md:min-h-[460px] lg:min-h-[500px] mb-10 md:mb-14">
          {/* Track: flex + translateX, NO overflow */}
          <div
            ref={trackRef}
            className="flex gap-5 items-center transition-transform duration-500 ease-out will-change-transform"
            style={{
              transform: `translateX(${trackTranslate}px)`,
              justifyContent: showNav ? "flex-start" : "center",
            }}
          >
            {items.map((reel, index) => {
              const isActiveSlide = !showNav || (index >= activeIndex && index < activeIndex + visible);
              return (
                <div key={reel.id}>
                  <SlideCard
                    reel={reel}
                    onClick={() => handleReelClick(reel)}
                    isVisible={!showNav || (index >= activeIndex && index < activeIndex + visible)}
                    isActive={isActiveSlide}
                  />
                </div>
              );
            })}
          </div>

          {/* Arrows: only when count > visible */}
          {showNav && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-drd-primary text-drd-primary hover:bg-drd-primary hover:text-white transition-all duration-200 flex items-center justify-center bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2 z-10 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={activeIndex >= maxIndex}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-drd-accent text-drd-accent hover:bg-drd-accent hover:text-white transition-all duration-200 flex items-center justify-center bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-drd-accent focus:ring-offset-2 z-10 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots: only when count > visible */}
        {showNav && count > 0 && (
          <div className="flex justify-center gap-2 mt-4 max-w-full flex-wrap">
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to video ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex ? "bg-drd-primary scale-125" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <VideoModal reel={selectedReel} onClose={handleModalClose} />
    </section>
  );
}
