"use client";

/**
 * CINEMATIC REEL GALLERY
 * Continuous sliding track. No snap-to-center.
 * Loop seamlessly when videos.length >= 5; ping-pong when <= 4.
 * All videos muted; object-contain on center card to avoid crop.
 *
 * Tune constants (same file):
 * - GAP_PX: gap between cards (matches gap-5 = 20)
 * - SLIDE_WIDTH_PX: used for track math and center detection (280)
 * - SPEED_DESKTOP_PX_PER_SEC / SPEED_MOBILE_PX_PER_SEC: scroll speed
 * - MOBILE_BREAKPOINT: below this width use mobile speed (768)
 * - Loop only when count >= 5 (see useLoop)
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

// ——— Tune these ———
const GAP_PX = 20;
const SLIDE_WIDTH_PX = 280;
const SPEED_DESKTOP_PX_PER_SEC = 22;
const SPEED_MOBILE_PX_PER_SEC = 14;
/** Breakpoint (px) below which mobile speed is used */
const MOBILE_BREAKPOINT = 768;
// ———

export type Reel = { id: string; src: string; poster: string; titleEn?: string; titleAr?: string };

interface ReelCardProps {
  reel: Reel;
  onClick: () => void;
  isCenter: boolean;
  isVisible: boolean;
}

function ReelCard({ reel, onClick, isCenter }: ReelCardProps) {
  const { lang } = useLang();
  const title = tField(lang, reel.titleEn, reel.titleAr);
  // When there's no poster, append a media fragment so the browser renders the frame
  // at 0.1s as the thumbnail. Mobile/in-app webviews (Instagram) don't show the default
  // first frame from preload="metadata", which otherwise leaves the card blank.
  const thumbSrc = reel.poster || reel.src.includes("#") ? reel.src : `${reel.src}#t=0.1`;

  return (
    <div className="shrink-0 w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] max-w-[85vw] aspect-[9/16]">
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
        className={`relative w-full h-full rounded-3xl overflow-hidden border transition-shadow duration-300 cursor-pointer aspect-[9/16] ${
          isCenter
            ? "bg-neutral-100 border-green-200/60 shadow-lg shadow-drd-primary/20 ring-2 ring-drd-primary/30"
            : "bg-white/10 border-green-200/50 shadow-md"
        } hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 pointer-events-none z-10 rounded-3xl" aria-hidden />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-drd-primary via-emerald-300 to-drd-primary z-20" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-drd-accent z-20" />
        {/* preload="metadata" + no autoPlay: shows a thumbnail frame without downloading
            the whole video. The full video loads only when tapped (opens the modal). */}
        <video
          src={thumbSrc}
          poster={reel.poster || undefined}
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full rounded-3xl ${isCenter ? "object-contain" : "object-cover"}`}
        />
        {/* Tap-to-play indicator */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {title ? (
          <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1.5 px-2 text-center truncate z-20" dir={lang === "ar" ? "rtl" : "ltr"}>
            {title}
          </p>
        ) : null}
      </div>
    </div>
  );
}

interface VideoModalProps {
  reel: Reel | null;
  reels: Reel[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

function VideoModal({ reel, reels, currentIndex, onClose, onNavigate }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const title = reel ? tField(lang, reel.titleEn, reel.titleAr) : "";
  const count = reels.length;
  const showNav = count > 1 && onNavigate;

  useEffect(() => {
    if (!reel) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";
    if (videoRef.current) videoRef.current.play().catch(() => {});
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [reel, onClose]);

  if (!reel) return null;

  const handlePrev = () => onNavigate?.((currentIndex - 1 + count) % count);
  const handleNext = () => onNavigate?.((currentIndex + 1) % count);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[420px] mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-drd-accent transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
            {title ? (
              <p className="px-4 py-2 text-center text-drd-text font-medium bg-white/80" dir={lang === "ar" ? "rtl" : "ltr"}>{title}</p>
            ) : null}
            <div className="relative aspect-[9/16] w-full bg-neutral-100" style={{ maxHeight: "80vh", maxWidth: "min(90vw, 520px)" }}>
              <video
                ref={videoRef}
                key={reel.id}
                src={reel.src}
                poster={reel.poster}
                loop
                playsInline
                controls
                muted
                autoPlay
                className="w-full h-full object-contain"
              />
              {showNav && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center z-20"
                    aria-label="Previous"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center z-20"
                    aria-label="Next"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ReelsGallery({ reels }: { reels: Reel[] }) {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  const items = reels.length > 0 ? reels : [{ id: "fb1", src: "/reels/reel-1.mp4", poster: "", titleEn: undefined, titleAr: undefined }];
  const count = items.length;
  const useLoop = count >= 5;
  const trackItems = useLoop ? [...items, ...items] : items;
  const trackLength = trackItems.length;
  const noScroll = count <= 1;

  const [translateX, setTranslateX] = useState(0);
  const [direction, setDirection] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const trackWidthRef = useRef(0);
  const containerWidthRef = useRef(0);

  const slotWidth = SLIDE_WIDTH_PX + GAP_PX;
  const singleCopyWidth = count * slotWidth - GAP_PX;
  const loopThreshold = singleCopyWidth;

  /** In RTL we mirror the transform so the track moves right (content flows RTL). Center/visibility use this. */
  const displayTranslateX = isRtl ? -translateX : translateX;

  const handleReelClick = useCallback((reelIndex: number) => setSelectedIndex(reelIndex), []);
  const handleModalClose = useCallback(() => setSelectedIndex(null), []);
  const handleModalNavigate = useCallback((index: number) => setSelectedIndex(index), []);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    const ro = new ResizeObserver(() => {
      trackWidthRef.current = track.offsetWidth;
      containerWidthRef.current = container.offsetWidth;
      setContainerWidth(container.offsetWidth);
    });
    ro.observe(track);
    ro.observe(container);
    trackWidthRef.current = track.offsetWidth;
    containerWidthRef.current = container.offsetWidth;
    setContainerWidth(container.offsetWidth);
    return () => ro.disconnect();
  }, [trackLength]);

  useEffect(() => {
    if (noScroll) return;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const isMobile = typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
      const speed = isMobile ? SPEED_MOBILE_PX_PER_SEC : SPEED_DESKTOP_PX_PER_SEC;
      const move = speed * dt * direction;

      setTranslateX((prev) => {
        const next = prev + move;
        const tw = trackWidthRef.current;
        const cw = containerWidthRef.current;

        if (useLoop) {
          if (next <= -loopThreshold) return next + loopThreshold;
          if (next > 0) return next - loopThreshold;
          return next;
        }
        const maxTranslate = 0;
        const minTranslate = cw >= tw ? 0 : -(tw - cw);
        if (next >= maxTranslate) {
          setDirection(-1);
          return maxTranslate;
        }
        if (next <= minTranslate) {
          setDirection(1);
          return minTranslate;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame((t) => { lastTime = t; tick(t); });
    return () => cancelAnimationFrame(rafRef.current);
  }, [useLoop, loopThreshold, direction, noScroll]);

  const cwForLayout = containerWidth > 0 ? containerWidth : 800;
  const centerDisplayIndex = Math.round(
    (cwForLayout / 2 - displayTranslateX - SLIDE_WIDTH_PX / 2) / slotWidth
  );
  const centerDisplayIndexWrapped = useLoop
    ? ((centerDisplayIndex % trackLength) + trackLength) % trackLength
    : Math.max(0, Math.min(count - 1, centerDisplayIndex));

  const isVisible = useCallback(
    (displayIndex: number) => {
      const cw = cwForLayout;
      const cardLeft = displayTranslateX + displayIndex * slotWidth;
      const cardRight = cardLeft + SLIDE_WIDTH_PX;
      return cardRight > -slotWidth && cardLeft < cw + slotWidth;
    },
    [displayTranslateX, slotWidth, cwForLayout]
  );

  const selectedReel = selectedIndex != null ? items[selectedIndex] ?? null : null;

  return (
    <section
      className="relative w-full overflow-x-hidden pt-10 pb-16 md:pb-20"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,197,94,0.08), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 80%, rgba(249,115,22,0.06), transparent 50%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-drd-primary uppercase tracking-wider">{tField(lang, "Reels", "فيديوهات")}</p>
        </div>

        <div
          ref={containerRef}
          className="relative z-10 w-full overflow-x-hidden py-6 pb-12"
        >
          <div className={`relative w-full flex items-center overflow-x-hidden ${noScroll ? "justify-center" : ""}`}>
            <div
              ref={trackRef}
              className="flex items-center gap-5"
              style={{
                width: "max-content",
                transform: noScroll ? undefined : `translateX(${displayTranslateX}px)`,
                willChange: noScroll ? undefined : "transform",
              }}
            >
              {trackItems.map((reel, displayIndex) => {
                const reelIndex = displayIndex % count;
                const isCenter = displayIndex === centerDisplayIndexWrapped;
                const visible = isVisible(displayIndex);
                return (
                  <div key={`${reel.id}-${displayIndex}`} className="flex items-center justify-center">
                    <ReelCard
                      reel={reel}
                      onClick={() => handleReelClick(reelIndex)}
                      isCenter={isCenter}
                      isVisible={visible}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        reel={selectedReel}
        reels={items}
        currentIndex={selectedIndex ?? 0}
        onClose={handleModalClose}
        onNavigate={count > 1 ? handleModalNavigate : undefined}
      />
    </section>
  );
}
