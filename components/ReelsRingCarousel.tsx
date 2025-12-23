"use client";

/**
 * 3D RING CAROUSEL COMPONENT
 * 
 * FILE SETUP INSTRUCTIONS:
 * 1. Create folder: /public/reels/
 * 2. Put your MP4 files in that folder with these exact names:
 *    - /public/reels/reel-1.mp4
 *    - /public/reels/reel-2.mp4
 *    - /public/reels/reel-3.mp4
 *    - /public/reels/reel-4.mp4
 *    - /public/reels/reel-5.mp4
 *    - /public/reels/reel-6.mp4
 *    (Add more as needed: reel-7.mp4, reel-8.mp4, etc.)
 * 3. Update the reels array below to match your files
 */

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Constant reels array - never changes
// Put your MP4 files in /public/reels/ and update this list to match
const REELS = [
  { id: "reel-1", src: "/reels/reel-1.mp4", poster: "" },
  { id: "reel-2", src: "/reels/reel-2.mp4", poster: "" },
  { id: "reel-3", src: "/reels/reel-3.mp4", poster: "" },
  { id: "reel-4", src: "/reels/reel-4.mp4", poster: "" },
] as const;

type Reel = typeof REELS[number];

interface ReelCardProps {
  reel: Reel;
  angle: number;
  radius: number;
  isFront: boolean;
  depth: number; // 0-1, where 1 is front
  onClick: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
  sectionInView: boolean;
}

function ReelCard({ reel, angle, radius, isFront, depth, onClick, videoRef, sectionInView }: ReelCardProps) {
  const opacity = 0.35 + (1 - 0.35) * depth;
  const blur = (1 - depth) * 1;
  const scale = 0.7 + (1 - 0.7) * depth;

  return (
    <div
      className="absolute w-32 h-56 md:w-40 md:h-72"
      style={{
        transform: `rotateY(${angle}deg) translateZ(${radius}px) rotateY(${-angle}deg) scale(${scale})`,
        transformStyle: "preserve-3d",
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="relative w-full h-full rounded-3xl overflow-hidden border border-drd-primary/15 shadow-lg shadow-drd-primary/10 transition-all duration-200 hover:border-drd-accent/40 hover:shadow-xl hover:shadow-drd-accent/20 focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2"
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-drd-primary via-emerald-300 to-drd-primary z-20" />
        
        {/* Orange accent dot */}
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-drd-accent z-20" />

        {/* Video */}
        <div className="relative w-full h-full bg-gradient-to-br from-drd-primary/20 to-drd-accent/20">
          <video
            ref={videoRef}
            src={reel.src}
            poster={reel.poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </div>
      </button>
    </div>
  );
}

interface ReelModalProps {
  reel: Reel | null;
  onClose: () => void;
}

function ReelModal({ reel, onClose }: ReelModalProps) {
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

export default function ReelsRingCarousel() {
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [sectionInView, setSectionInView] = useState(false);
  
  // Refs for pause state (NO React state to avoid re-render jitter)
  // Auto-rotate is always enabled unless modal is open or user is dragging
  const pausedRef = useRef(false); // Only set to true when modal is open or dragging
  const modalOpenRef = useRef(false);
  const isDraggingRef = useRef(false);
  
  // State for rotation (needed for reactive updates)
  const [rotation, setRotation] = useState(0);
  
  // Refs for animation
  const rafRef = useRef<number | null>(null);
  const rotationRef = useRef(0); // Current rotation in degrees (for RAF)
  const targetRotationRef = useRef(0); // Target rotation for snapping
  const velocityRef = useRef(0); // For inertia
  const lastFrameTimeRef = useRef(0);
  
  // Refs for drag
  const dragStartXRef = useRef(0);
  const dragStartRotationRef = useRef(0);
  
  // Refs for video elements
  const videoRefsRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const ringRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Responsive radius
  const radius = useMemo(() => {
    if (typeof window === "undefined") return 520;
    return window.innerWidth >= 768 ? 520 : window.innerWidth >= 640 ? 420 : 300;
  }, []);

  const [currentRadius, setCurrentRadius] = useState(radius);

  // Update radius on resize
  useEffect(() => {
    const updateRadius = () => {
      const newRadius = window.innerWidth >= 768 ? 520 : window.innerWidth >= 640 ? 420 : 300;
      setCurrentRadius(newRadius);
    };
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  // IntersectionObserver for section visibility
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setSectionInView(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate which videos should play (front 3)
  const getFrontIndices = useCallback((rotation: number): number[] => {
    const N = REELS.length;
    const spacing = 360 / N;
    const frontAngle = 0; // Front is at 0 degrees
    
    const distances = REELS.map((_, index) => {
      const angle = (rotation + index * spacing) % 360;
      const normalized = angle > 180 ? angle - 360 : angle;
      return Math.abs(normalized - frontAngle);
    });
    
    // Get indices sorted by distance from front
    const sorted = distances
      .map((dist, idx) => ({ dist, idx }))
      .sort((a, b) => a.dist - b.dist);
    
    return sorted.slice(0, 3).map(({ idx }) => idx);
  }, []);

  // Update video play/pause based on front position
  useEffect(() => {
    if (!sectionInView) {
      // Pause all when section is out of view
      videoRefsRef.current.forEach((video) => {
        video.pause();
      });
      return;
    }

    const frontIndices = getFrontIndices(rotationRef.current);
    
    videoRefsRef.current.forEach((video, index) => {
      const shouldPlay = frontIndices.includes(index) && !pausedRef.current && !modalOpenRef.current;
      
      if (shouldPlay && video.paused) {
        video.play().catch(() => {
          // Autoplay failed, keep muted
          video.muted = true;
          video.play().catch(() => {});
        });
      } else if (!shouldPlay && !video.paused) {
        video.pause();
      }
    });
  }, [sectionInView, getFrontIndices]);

  // RAF loop for smooth rotation
  useEffect(() => {
    const animate = (currentTime: number) => {
      const delta = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;
      
      if (!pausedRef.current && !modalOpenRef.current && !isDraggingRef.current) {
        // Auto-rotate: 360 degrees in 15 seconds = 0.024 degrees per frame at 60fps
        rotationRef.current += (delta / 16.67) * 0.024;
        rotationRef.current %= 360;
      }
      
      // Apply inertia if dragging just ended
      if (velocityRef.current !== 0 && !isDraggingRef.current) {
        rotationRef.current += velocityRef.current;
        rotationRef.current %= 360;
        velocityRef.current *= 0.95; // Friction
        
        if (Math.abs(velocityRef.current) < 0.01) {
          velocityRef.current = 0;
          // Snap to nearest panel
          const N = REELS.length;
          const spacing = 360 / N;
          const normalized = ((rotationRef.current % 360) + 360) % 360;
          const nearest = Math.round(normalized / spacing) * spacing;
          targetRotationRef.current = nearest;
        }
      }
      
      // Smooth snap to target
      if (targetRotationRef.current !== rotationRef.current && !isDraggingRef.current) {
        const diff = targetRotationRef.current - rotationRef.current;
        const normalized = ((diff % 360) + 360) % 360;
        const shortest = normalized > 180 ? normalized - 360 : normalized;
        rotationRef.current += shortest * 0.1;
        
        if (Math.abs(shortest) < 0.1) {
          rotationRef.current = targetRotationRef.current;
        }
      }
      
      // Update state for reactive rendering
      setRotation(rotationRef.current);
      
      // Update ring transform
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }
      
      // Update video play/pause
      const frontIndices = getFrontIndices(rotationRef.current);
      videoRefsRef.current.forEach((video, index) => {
        const shouldPlay = frontIndices.includes(index) && !pausedRef.current && !modalOpenRef.current && sectionInView;
        if (shouldPlay && video.paused) {
          video.play().catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
        } else if (!shouldPlay && !video.paused) {
          video.pause();
        }
      });
      
      rafRef.current = requestAnimationFrame(animate);
    };

    lastFrameTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [sectionInView, getFrontIndices]);

  // Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    isDraggingRef.current = true;
    pausedRef.current = true; // Pause auto-rotate while dragging
    dragStartXRef.current = e.clientX;
    dragStartRotationRef.current = rotationRef.current;
    velocityRef.current = 0;
    targetRotationRef.current = rotationRef.current;
    
    if (stageRef.current) {
      stageRef.current.setPointerCapture(e.pointerId);
      stageRef.current.style.cursor = "grabbing";
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    const deltaX = e.clientX - dragStartXRef.current;
    const sensitivity = 0.5; // Adjust for drag sensitivity
    const rotationDelta = (deltaX / currentRadius) * sensitivity * 180;
    
    rotationRef.current = dragStartRotationRef.current - rotationDelta;
    rotationRef.current %= 360;
    
    // Calculate velocity for inertia
    const timeDelta = performance.now() - lastFrameTimeRef.current;
    if (timeDelta > 0) {
      velocityRef.current = -rotationDelta / (timeDelta / 16.67);
    }
  }, [currentRadius]);

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    pausedRef.current = false; // Resume auto-rotate after drag ends
    
    // Snap to nearest panel
    const N = REELS.length;
    const spacing = 360 / N;
    const normalized = ((rotationRef.current % 360) + 360) % 360;
    const nearest = Math.round(normalized / spacing) * spacing;
    targetRotationRef.current = nearest;
    
    if (stageRef.current) {
      stageRef.current.style.cursor = "grab";
    }
  }, []);

  // Wheel handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.1; // Small increments
    rotationRef.current = (rotationRef.current - delta) % 360;
    
    // Snap after wheel stops
    clearTimeout((handleWheel as any).snapTimeout);
    (handleWheel as any).snapTimeout = setTimeout(() => {
      const N = REELS.length;
      const spacing = 360 / N;
      const normalized = ((rotationRef.current % 360) + 360) % 360;
      const nearest = Math.round(normalized / spacing) * spacing;
      targetRotationRef.current = nearest;
    }, 300);
  }, []);

  // Arrow navigation
  const handleArrowClick = useCallback((direction: "left" | "right") => {
    const N = REELS.length;
    const spacing = 360 / N;
    const step = direction === "left" ? -spacing : spacing;
    targetRotationRef.current = (rotationRef.current + step) % 360;
    pausedRef.current = false;
  }, []);

  const handleReelClick = useCallback((reel: Reel) => {
    setSelectedReel(reel);
    modalOpenRef.current = true;
    pausedRef.current = true;
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedReel(null);
    modalOpenRef.current = false;
    pausedRef.current = false;
  }, []);

  // Auto-rotate is always enabled (hover no longer pauses it)
  // Only pauses when modal is open or user is dragging

  const setVideoRef = useCallback((id: string) => (el: HTMLVideoElement | null) => {
    if (el) {
      videoRefsRef.current.set(id, el);
    } else {
      videoRefsRef.current.delete(id);
    }
  }, []);

  const N = REELS.length;
  const spacing = 360 / N;

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Circular boundary arc hint */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{
          width: `${currentRadius * 2.2}px`,
          height: `${currentRadius * 2.2}px`,
          background: `radial-gradient(circle at center, transparent 55%, rgba(140, 200, 80, 0.18) 56%, transparent 65%)`,
        }}
      />

      {/* Decorative gradient blob */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-drd-primary/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 z-10">
        {/* 3D Stage Container */}
        <div className="flex justify-center items-center py-12">
          <div
            ref={stageRef}
            className="relative"
            style={{
              perspective: "1200px",
              width: "100%",
              height: "600px",
              cursor: "grab",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* 3D Ring */}
            <div
              ref={ringRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transformStyle: "preserve-3d",
                width: "0",
                height: "0",
              }}
            >
              {/* Reel Cards */}
              {REELS.map((reel, index) => {
                const angle = index * spacing;
                const normalizedRotation = ((rotation + angle) % 360 + 360) % 360;
                const frontAngle = 0;
                const diff = Math.abs(normalizedRotation - frontAngle);
                const distance = Math.min(diff, 360 - diff);
                const maxDistance = 180;
                const depth = 1 - (distance / maxDistance);
                const isFront = depth > 0.9;

                return (
                  <ReelCard
                    key={reel.id}
                    reel={reel}
                    angle={angle}
                    radius={currentRadius}
                    isFront={isFront}
                    depth={depth}
                    onClick={() => handleReelClick(reel)}
                    videoRef={setVideoRef(reel.id)}
                    sectionInView={sectionInView}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => handleArrowClick("left")}
            className="w-12 h-12 rounded-full border-2 border-drd-primary text-drd-primary hover:bg-drd-primary hover:text-white transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-drd-primary focus:ring-offset-2"
            aria-label="Rotate left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => handleArrowClick("right")}
            className="w-12 h-12 rounded-full border-2 border-drd-accent text-drd-accent hover:bg-drd-accent hover:text-white transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-drd-accent focus:ring-offset-2"
            aria-label="Rotate right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal */}
      <ReelModal reel={selectedReel} onClose={handleModalClose} />
    </section>
  );
}

