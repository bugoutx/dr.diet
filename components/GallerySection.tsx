"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const galleryItems = [
  {
    caption: "Energy Dish – Chicken",
    image: "/images/gallery-energy-dish.jpg",
  },
  {
    caption: "California Salad",
    image: "/images/gallery-california-salad.jpg",
  },
  {
    caption: "Radiance Smoothie",
    image: "/images/gallery-smoothie.jpg",
  },
  {
    caption: "Smart Oat Bites",
    image: "/images/gallery-oat-bites.jpg",
  },
];

export default function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-drd-bg">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-drd-text mb-4">
            See the Real Plates
          </h2>
          <p className="text-lg text-drd-muted max-w-2xl mx-auto">
            Real, freshly prepared meals crafted with care and attention to
            detail
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Video Card - Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-drd-primary/20 to-drd-accent/20 aspect-video group cursor-pointer">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-drd-muted text-sm font-medium">
                  Instagram Reel / Video Placeholder
                </span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-drd-primary ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Instagram Follow Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-2 mt-4"
            >
              <svg
                className="w-5 h-5 text-drd-accent"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="text-sm text-drd-muted">
                Follow us{" "}
                <a
                  href="https://instagram.com/dr.diet.sy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-drd-accent hover:text-drd-primary font-semibold transition-colors"
                >
                  @dr.diet.sy
                </a>
              </span>
            </motion.div>
          </motion.div>

          {/* Gallery Grid - Right (2x2) */}
          <div className="grid grid-cols-2 gap-4">
            {galleryItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-drd-primary/10 to-drd-accent/10 border border-drd-primary/10 cursor-pointer shadow-sm group-hover:shadow-xl transition-all duration-500">
                  {/* Image Placeholder with Zoom Effect */}
                  <div className="absolute inset-0 flex items-center justify-center scale-100 group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-drd-primary/20 to-drd-accent/20">
                    <span className="text-drd-muted text-xs font-medium z-10">
                      Food photo
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-20" />
                </div>

                {/* Caption */}
                <p className="text-sm font-medium text-drd-text mt-3 text-center">
                  {item.caption}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

