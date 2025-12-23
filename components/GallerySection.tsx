"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import ReelsArcCarousel from "./ReelsArcCarousel";

export default function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative overflow-visible bg-transparent">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 bg-transparent">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4">
            See the Real Plates
          </h2>
          <p className="text-lg text-drd-muted max-w-2xl mx-auto">
            Real, freshly prepared meals — straight from our kitchen. Tap any reel to watch full screen.
          </p>
        </motion.div>

        {/* Arc Carousel */}
        <ReelsArcCarousel />
      </div>
    </section>
  );
}

