"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";
import ReelsGallery from "./sections/ReelsGallery";
import DecorativeVeggies from "@/components/DecorativeVeggies";

export type VideoReel = {
  id: string;
  src: string;
  poster: string;
  titleEn?: string;
  titleAr?: string;
};

export type GallerySectionTitle = {
  titleEn: string;
  titleAr?: string;
  subtitleEn: string;
  subtitleAr?: string;
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

export default function GallerySection({ videos, sectionTitle }: { videos?: VideoReel[]; sectionTitle?: GallerySectionTitle }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { lang } = useLang();
  const reels = (videos && videos.length > 0) ? videos : FALLBACK_REELS;

  const title = sectionTitle
    ? tField(lang, sectionTitle.titleEn, sectionTitle.titleAr ?? sectionTitle.titleEn)
    : (lang === "ar" ? "شاهد الأطباق الحقيقية" : "See the Real Plates");
  const subtitle = sectionTitle
    ? tField(lang, sectionTitle.subtitleEn, sectionTitle.subtitleAr ?? sectionTitle.subtitleEn)
    : (lang === "ar" ? "أطباق حقيقية طازجة — من مطبخنا مباشرة. اضغط على أي فيديو للمشاهدة بحجم كامل." : "Real, freshly prepared meals — straight from our kitchen. Tap any reel to watch full screen.");

  return (
    <section id="reels" ref={ref} className="relative overflow-x-hidden bg-transparent w-full">
      <DecorativeVeggies section="reels" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4">
            {title}
          </h2>
          <p className="text-lg text-drd-muted max-w-2xl mx-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
            {subtitle}
          </p>
        </motion.div>
      </div>

      <ReelsGallery reels={reels} />
    </section>
  );
}
