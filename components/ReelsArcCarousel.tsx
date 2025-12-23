"use client";

/**
 * REELS ARC CAROUSEL COMPONENT
 * 
 * FILE SETUP INSTRUCTIONS:
 * 1. Put your MP4 files in /public/reels/ folder with these exact names:
 *    - /public/reels/reel-1.mp4
 *    - /public/reels/reel-2.mp4
 *    - /public/reels/reel-3.mp4
 *    - /public/reels/reel-4.mp4
 *    - /public/reels/reel-5.mp4
 *    - /public/reels/reel-6.mp4
 * 2. Add more reels by extending the REELS array below (keep the same id/src pattern)
 */

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Constant reels array - never changes
// Add more reels by extending this array
const REELS = [
  { id: "reel-1", src: "/reels/reel-1.mp4", poster: "" },
  { id: "reel-2", src: "/reels/reel-2.mp4", poster: "" },
  { id: "reel-3", src: "/reels/reel-3.mp4", poster: "" },
  { id: "reel-4", src: "/reels/reel-4.mp4", poster: "" },
] as const;

type Reel = typeof REELS[number];

interface ReelCardProps {
  reel: Reel;
  offset: number; // -3 to +3, where 0 is center
  isCenter: boolean;
  onClick: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
  shouldPlay: boolean;
}

function ReelCard({ reel, offset, isCenter, onClick, videoRef, shouldPlay }: ReelCardProps) {
  const videoElRef = useRef<HTMLVideoElement>(null);

  // Calculate transforms for arc positioning (memoized values)
  const rotateY = offset * 18; // degrees
  const translateX = offset * 320; // Increased from 220 to 320 for more spacing
  const translateZ = -Math.abs(offset) * 120; // push sides back
  const scale = isCenter ? 1 : 0.78 + (1 - 0.78) * (1 - Math.abs(offset) / 2);
  const opacity = isCenter ? 1 : 0.6 + (1 - 0.6) * (1 - Math.abs(offset) / 2);

  // Play/pause video - all visible videos should loop
  useEffect(() => {
    const video = videoElRef.current;
    if (!video) return;

    // Play all visible videos (within visible range)
    if (shouldPlay || Math.abs(offset) <= 2) {
      if (video.paused) {
        video.muted = true;
        video.loop = true; // Ensure looping
        video.play().catch(() => {});
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [shouldPlay, offset]);

  // Register video ref once
  useEffect(() => {
    if (videoElRef.current) {
      videoRef(videoElRef.current);
    }
  }, [videoRef]);

  return (
    <div
      className="absolute"
      style={{
        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        transformStyle: "preserve-3d",
        opacity,
        transformOrigin: "center center",
        width: "240px",
        height: "427px", // 9:16 aspect ratio
        willChange: "transform, opacity",
        zIndex: isCenter ? 10 : Math.round(10 - Math.abs(offset)), // Ensure center is on top
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="relative w-full h-full rounded-3xl overflow-hidden border border-drd-primary/15 shadow-lg shadow-drd-primary/10 transition-all duration-200 hover:border-drd-accent/40 hover:shadow-xl hover:shadow-drd-accent/20 focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2"
        style={{ transform: "rotateY(0deg)" }} // Keep content vertical
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-drd-primary via-emerald-300 to-drd-primary z-20" />
        
        {/* Orange accent dot */}
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-drd-accent z-20" />

        {/* Video */}
        <div className="relative w-full h-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20">
          <video
            ref={videoElRef}
            src={reel.src}
            poster={reel.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </div>
      </button>
    </div>
  );
}

interface FlatCarouselCardProps {
  reel: Reel;
  onClick: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
  isVisible: boolean;
}

function FlatCarouselCard({ reel, onClick, videoRef, isVisible }: FlatCarouselCardProps) {
  const videoElRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoElRef.current;
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

  useEffect(() => {
    if (videoElRef.current) {
      videoRef(videoElRef.current);
    }
  }, [videoRef]);

  return (
    <div className="flex-shrink-0 snap-start w-[220px] md:w-[260px]">
      <button
        type="button"
        onClick={onClick}
        className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden border border-drd-primary/15 shadow-lg shadow-drd-primary/10 transition-all duration-200 hover:border-drd-accent/40 hover:shadow-xl hover:shadow-drd-accent/20 focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2"
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-drd-primary via-emerald-300 to-drd-primary z-20" />
        
        {/* Orange accent dot */}
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-drd-accent z-20" />

        {/* Video */}
        <div className="relative w-full h-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20">
          <video
            ref={videoElRef}
            src={reel.src}
            poster={reel.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </div>
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

  useEffect(() => {
    if (!reel) return;

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

    // Try autoplay with sound, fallback to muted
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
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-drd-accent transition-colors z-10"
            aria-label="Close modal"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
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

export default function ReelsArcCarousel() {
  const [activeIndex, setActiveIndex] = useState(0); // Can be fractional for smooth interpolation
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [useFlatCarousel, setUseFlatCarousel] = useState(false);
  
  // Refs
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flatCarouselRef = useRef<HTMLDivElement>(null);
  const videoRefsRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Check for reduced motion and screen size
  useEffect(() => {
    const checkMode = () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 768;
      setUseFlatCarousel(prefersReducedMotion || isMobile);
    };

    checkMode();
    window.addEventListener("resize", checkMode);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", checkMode);

    return () => {
      window.removeEventListener("resize", checkMode);
      mediaQuery.removeEventListener("change", checkMode);
    };
  }, []);

  // Continuous smooth auto-advance - moves constantly without stopping
  useEffect(() => {
    if (useFlatCarousel) return;

    let animationId: number;
    let startTime = performance.now();
    const speed = 0.0001; // Speed of rotation (adjust for faster/slower)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      // Continuously increment index for smooth, never-stopping movement
      const newIndex = (elapsed * speed) % REELS.length;
      setActiveIndex(newIndex);
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [useFlatCarousel]);

  // Intersection observer for flat carousel
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (!useFlatCarousel || !flatCarouselRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = new Set<number>();
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            visible.add(index);
          }
        });
        setVisibleIndices(visible);
      },
      { threshold: 0.5 }
    );

    const cards = flatCarouselRef.current.children;
    Array.from(cards).forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [useFlatCarousel]);

  // Disable drag - user cannot control scrolling
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Disabled - no user control
  }, []);

  // Disabled drag handlers
  const handlePointerMove = useCallback(() => {}, []);
  const handlePointerUp = useCallback(() => {}, []);

  // Disable wheel handler - user cannot control scrolling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault(); // Prevent scrolling but don't change index
  }, []);

  // Arrow navigation disabled - removed

  // Flat carousel scroll handlers
  const handleFlatScrollLeft = useCallback(() => {
    if (!flatCarouselRef.current) return;
    flatCarouselRef.current.scrollBy({ left: -280, behavior: "smooth" });
  }, []);

  const handleFlatScrollRight = useCallback(() => {
    if (!flatCarouselRef.current) return;
    flatCarouselRef.current.scrollBy({ left: 280, behavior: "smooth" });
  }, []);

  const handleReelClick = useCallback((reel: Reel) => {
    setSelectedReel(reel);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedReel(null);
  }, []);

  const setVideoRef = useCallback((id: string) => (el: HTMLVideoElement | null) => {
    if (el) {
      videoRefsRef.current.set(id, el);
    } else {
      videoRefsRef.current.delete(id);
    }
  }, []);

  // Calculate visible offsets for arc mode (only show -2 to +2 for better performance)
  const visibleOffsets = useMemo(() => {
    if (useFlatCarousel) return [];
    // Reduced to -2 to +2 to improve performance (fewer videos rendering)
    return [-2, -1, 0, 1, 2].filter((offset) => {
      const baseIndex = Math.floor(activeIndex);
      const index = (baseIndex + offset + REELS.length) % REELS.length;
      return index >= 0 && index < REELS.length;
    });
  }, [useFlatCarousel, activeIndex]);

  return (
    <section className="relative pt-0 pb-0 bg-transparent overflow-visible">
      {/* Subtle radial green tint - moved behind videos only */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-drd-primary/3 rounded-full blur-3xl pointer-events-none z-0 opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 z-10">
        {useFlatCarousel ? (
          /* FLAT CAROUSEL MODE */
          <div className="relative">
            <div
              ref={flatCarouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {REELS.map((reel, index) => (
                <FlatCarouselCard
                  key={reel.id}
                  reel={reel}
                  onClick={() => handleReelClick(reel)}
                  videoRef={setVideoRef(reel.id)}
                  isVisible={visibleIndices.has(index)}
                />
              ))}
            </div>

            {/* Flat carousel arrows */}
            <button
              type="button"
              onClick={handleFlatScrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full border-2 border-drd-primary text-drd-primary hover:bg-drd-primary hover:text-white transition-all duration-200 flex items-center justify-center bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleFlatScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full border-2 border-drd-accent text-drd-accent hover:bg-drd-accent hover:text-white transition-all duration-200 flex items-center justify-center bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-drd-accent focus:ring-offset-2"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          /* ARC MODE */
          <div
            ref={containerRef}
            className="relative flex justify-center items-center overflow-visible"
            style={{
              perspective: "1200px",
              height: "380px",
              cursor: "default",
              overflow: "visible",
              marginTop: "-60px", // Shift ONLY the video container up
            }}
            onWheel={handleWheel}
          >
            {/* Green glow behind center card */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: "280px",
                height: "500px",
                background: "radial-gradient(ellipse at center, rgba(140, 200, 80, 0.15) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* 3D Container */}
            <div
              className="relative"
              style={{
                transformStyle: "preserve-3d",
                width: "0",
                height: "0",
                overflow: "visible", // Ensure videos aren't clipped
              }}
            >
              {visibleOffsets.map((offset) => {
                const baseIndex = Math.floor(activeIndex);
                const index = (baseIndex + offset + REELS.length) % REELS.length;
                const reel = REELS[index];
                // Adjust offset based on fractional part for smooth interpolation
                const fractionalOffset = offset - (activeIndex - baseIndex);
                const isCenter = Math.abs(fractionalOffset) < 0.1;
                const shouldPlay = Math.abs(fractionalOffset) <= 2; // Play all visible videos

                return (
                  <ReelCard
                    key={`${reel.id}-${offset}`}
                    reel={reel}
                    offset={fractionalOffset}
                    isCenter={isCenter}
                    onClick={() => handleReelClick(reel)}
                    videoRef={setVideoRef(reel.id)}
                    shouldPlay={shouldPlay}
                  />
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Modal */}
      <VideoModal reel={selectedReel} onClose={handleModalClose} />
    </section>
  );
}

