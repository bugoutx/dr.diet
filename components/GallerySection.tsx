"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import ReelsGallery from "./sections/ReelsGallery";

export type VideoReel = {
  id: string;
  src: string;
  poster: string;
  titleEn?: string;
  titleAr?: string;
};

/**
 * Fallback: put MP4 files in /public/reels/ (e.g. reel-1.mp4, reel-2.mp4).
 * Primary: upload via admin to Vercel Blob, URLs stored in DB.
 */
const FALLBACK_REELS: VideoReel[] = [
  { id: "reel-1", src: "/reels/reel-1.mp4", poster: "" },
  { id: "reel-2", src: "/reels/reel-2.mp4", poster: "" },
  { id: "reel-3", src: "/reels/reel-3.mp4", poster: "" },
  { id: "reel-4", src: "/reels/reel-4.mp4", poster: "" },
];

export default function GallerySection({ videos }: { videos?: VideoReel[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const reels = (videos && videos.length > 0) ? videos : FALLBACK_REELS;

  return (
    <section ref={ref} className="relative overflow-x-hidden bg-transparent w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4">
            See the Real Plates
          </h2>
          <p className="text-lg text-drd-muted max-w-2xl mx-auto">
            Real, freshly prepared meals — straight from our kitchen. Tap any reel to watch full screen.
          </p>
        </motion.div>
      </div>

      <ReelsGallery reels={reels} />
    </section>
  );
}
