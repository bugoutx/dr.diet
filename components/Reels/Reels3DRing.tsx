"use client";

/**
 * REELS 3D RING
 * - 1 or 2 videos: static centered row, no animation.
 * - 3+ videos: 3D ring with auto-rotate (inside-a-circle effect).
 * Keeps finalized sizing/spacing; no scrollbars; hover does not change positions.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

// ——— Tune these ———
/** Stage perspective (px). Smaller = stronger curvature. */
const PERSPECTIVE_PX = 800;
/** Ring X tilt (deg). Negative = top tilts away. -4 to -10. */
const RING_X_TILT = -6;
/** Radius of the ring (px). Smaller = tighter spacing. */
function getRadiusPx(width: number): number {
  if (width >= 1024) return 320;
  if (width >= 768) return 285;
  if (width >= 640) return 250;
  return 220;
}
/** Rotation speed: degrees added to ring per animation frame. Lower = slower. */
const ROTATION_DEG_PER_FRAME = 0.08;
// ———

export type Reel = { id: string; src: string; poster: string; titleEn?: string; titleAr?: string };

interface ReelCardProps {
  reel: Reel;
  onClick: () => void;
  isVisible: boolean;
  /** For 3D ring: only scale/shadow on hover, no layout/position change */
  hoverScaleOnly?: boolean;
  /** Depth shading (3D ring): opacity 0.55–1, scale 0.92–1, blur 0–0.4px */
  depthStyle?: { opacity: number; transform: string; filter: string };
  /** Use glass/vignette styling for 3D ring cards */
  useGlassStyle?: boolean;
}

function ReelCard({ reel, onClick, isVisible, hoverScaleOnly = false, depthStyle, useGlassStyle = false }: ReelCardProps) {
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

  const buttonClass =
    "relative w-full aspect-[9/16] overflow-hidden rounded-[32px] border shadow-lg hover:shadow-xl transition-shadow duration-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2 " +
    (useGlassStyle
      ? "border-green-200/60 hover:ring-1 hover:ring-orange-200/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] "
      : "border-drd-primary/15 hover:border-drd-accent/40 ") +
    (hoverScaleOnly ? "hover:scale-[1.01] transition-transform duration-300" : "");

  const innerContent = (
    <div className="relative w-full h-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20" style={depthStyle}>
      <video
        ref={videoRef}
        src={reel.src}
        poster={reel.poster}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        className="h-full w-full object-cover rounded-[32px]"
      />
      {useGlassStyle && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 pointer-events-none rounded-[32px]" aria-hidden />
      )}
    </div>
  );

  return (
    <div className="shrink-0 w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] max-w-full aspect-[9/16]">
      <button type="button" onClick={onClick} className={buttonClass}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-drd-primary via-emerald-300 to-drd-primary z-20" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-drd-accent z-20" />
        {innerContent}
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

function useRingRadius() {
  const [radius, setRadius] = useState(300);
  useEffect(() => {
    const update = () => setRadius(getRadiusPx(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return radius;
}

/** Static centered row for 1 or 2 videos */
function StaticGrid({ items, onReelClick }: { items: Reel[]; onReelClick: (reel: Reel) => void }) {
  return (
    <div className="flex justify-center items-center gap-6 flex-wrap">
      {items.map((reel) => (
        <ReelCard
          key={reel.id}
          reel={reel}
          onClick={() => onReelClick(reel)}
          isVisible
          hoverScaleOnly={false}
        />
      ))}
    </div>
  );
}

/** 3D ring: cards on a circle, ring rotates. Hover only scale/shadow. Depth shading on inner content. */
function Ring3D({
  items,
  radius,
  rotationY,
  onReelClick,
}: {
  items: Reel[];
  radius: number;
  rotationY: number;
  onReelClick: (reel: Reel) => void;
}) {
  const count = items.length;
  if (count < 3) return null;

  /** Smallest angular distance (0..180). */
  const angleDiff = (a: number, b: number) => {
    let d = Math.abs(((a - b) % 360 + 360) % 360);
    if (d > 180) d = 360 - d;
    return d;
  };

  return (
    <div
      className="absolute left-1/2 top-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${RING_X_TILT}deg) rotateY(${rotationY}deg)`,
          willChange: "transform",
        }}
      >
        {items.map((reel, index) => {
          const angle = (360 / count) * index;
          const cardWorldAngle = ((angle - rotationY) % 360 + 360) % 360;
          const diff = angleDiff(cardWorldAngle, 0);
          const t = Math.min(1, diff / 180);
          const opacity = 1 - t * 0.45;
          const scale = 1 - t * 0.08;
          const blur = t * 0.4;
          const depthStyle = {
            opacity,
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
          };
          return (
            <div
              key={reel.id}
              className="absolute left-1/2 top-1/2 w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] max-w-[90vw] aspect-[9/16]"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px) translate(-50%, -50%)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <ReelCard
                reel={reel}
                onClick={() => onReelClick(reel)}
                isVisible
                hoverScaleOnly
                depthStyle={depthStyle}
                useGlassStyle
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Reels3DRing({ reels }: { reels: Reel[] }) {
  const items =
    reels.length > 0
      ? reels
      : [{ id: "fb1", src: "/reels/reel-1.mp4", poster: "", titleEn: undefined, titleAr: undefined }];
  const count = items.length;
  const useRing = count >= 3;
  const radius = useRingRadius();
  const [rotationY, setRotationY] = useState(0);
  const rafRef = useRef<number>(0);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  // Auto-rotate ring only when count >= 3
  useEffect(() => {
    if (!useRing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = (now - last) / 16.67; // normalize to ~60fps
      setRotationY((r) => r + ROTATION_DEG_PER_FRAME * delta);
      last = now;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [useRing]);

  const handleReelClick = useCallback((reel: Reel) => setSelectedReel(reel), []);
  const handleModalClose = useCallback(() => setSelectedReel(null), []);

  return (
    <section className="relative pt-0 pb-16 md:pb-20 bg-transparent w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative w-full overflow-hidden min-h-[420px] md:min-h-[460px] lg:min-h-[500px] mb-10 md:mb-14 max-w-[1200px] mx-auto"
          style={{ perspective: PERSPECTIVE_PX }}
        >
          {useRing ? (
            <Ring3D items={items} radius={radius} rotationY={rotationY} onReelClick={handleReelClick} />
          ) : (
            <StaticGrid items={items} onReelClick={handleReelClick} />
          )}
        </div>
      </div>
      <VideoModal reel={selectedReel} onClose={handleModalClose} />
    </section>
  );
}
