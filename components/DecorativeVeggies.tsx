"use client";

import Image from "next/image";

export type VeggiePlacement = {
  src: string;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  width: number; // px
  opacity: number;
  duration: number; // seconds
  delay: number; // seconds
  /** "md" = hide on mobile, show from md up */
  visible?: "all" | "md";
};

const VEGGIE_LAYERS = Array.from({ length: 14 }, (_, i) => `/images/veggies/Layer${i + 1}.png`);

function pickLayers(indices: number[]): string[] {
  return indices.map((i) => VEGGIE_LAYERS[i % VEGGIE_LAYERS.length]);
}

/** Section-specific decorative veggie configs. Scattered across corners, edges, and middle. */
const SECTION_CONFIG: Record<string, VeggiePlacement[]> = {
  hero: [
    { src: pickLayers([0])[0], top: "6%", left: "1%", width: 200, opacity: 0.6, duration: 10, delay: 0, visible: "md" },
    { src: pickLayers([1])[0], bottom: "15%", right: "3%", width: 120, opacity: 0.55, duration: 8, delay: 1.5, visible: "md" },
    { src: pickLayers([2])[0], top: "18%", right: "14%", width: 85, opacity: 0.5, duration: 12, delay: 0.5, visible: "md" },
    { src: pickLayers([3])[0], top: "35%", left: "8%", width: 95, opacity: 0.48, duration: 9, delay: 2, visible: "md" },
    { src: pickLayers([4])[0], top: "55%", right: "18%", width: 70, opacity: 0.5, duration: 11, delay: 0.8, visible: "md" },
    { src: pickLayers([5])[0], bottom: "25%", left: "12%", width: 80, opacity: 0.48, duration: 10, delay: 1.2, visible: "md" },
    { src: pickLayers([6])[0], top: "42%", right: "5%", width: 65, opacity: 0.45, duration: 13, delay: 2.5, visible: "md" },
    { src: pickLayers([7])[0], top: "12%", right: "28%", width: 55, opacity: 0.48, duration: 11, delay: 0.3, visible: "md" },
    { src: pickLayers([8])[0], bottom: "38%", left: "18%", width: 60, opacity: 0.46, duration: 9, delay: 1.6, visible: "md" },
    { src: pickLayers([9])[0], top: "68%", left: "5%", width: 58, opacity: 0.5, duration: 10, delay: 2.1, visible: "md" },
  ],
  menu: [
    { src: pickLayers([10])[0], top: "5%", right: "2%", width: 100, opacity: 0.55, duration: 9, delay: 0, visible: "md" },
    { src: pickLayers([11])[0], bottom: "6%", left: "1%", width: 90, opacity: 0.52, duration: 11, delay: 2, visible: "md" },
    { src: pickLayers([12])[0], top: "28%", left: "4%", width: 75, opacity: 0.48, duration: 10, delay: 1, visible: "md" },
    { src: pickLayers([13])[0], top: "50%", right: "6%", width: 70, opacity: 0.5, duration: 8, delay: 0.5, visible: "md" },
    { src: pickLayers([0])[0], bottom: "22%", right: "10%", width: 65, opacity: 0.48, duration: 12, delay: 1.5, visible: "md" },
    { src: pickLayers([1])[0], top: "65%", left: "8%", width: 60, opacity: 0.46, duration: 9, delay: 2.2, visible: "md" },
    { src: pickLayers([2])[0], top: "38%", right: "14%", width: 58, opacity: 0.5, duration: 10, delay: 0.8, visible: "md" },
    { src: pickLayers([3])[0], bottom: "42%", left: "6%", width: 55, opacity: 0.46, duration: 11, delay: 2.4, visible: "md" },
    { src: pickLayers([4])[0], top: "78%", right: "4%", width: 52, opacity: 0.48, duration: 8, delay: 1.2, visible: "md" },
  ],
  "loved-plates": [
    { src: pickLayers([5])[0], top: "4%", left: "0%", width: 110, opacity: 0.55, duration: 10, delay: 0.5, visible: "md" },
    { src: pickLayers([6])[0], bottom: "8%", right: "0%", width: 95, opacity: 0.5, duration: 8, delay: 1, visible: "md" },
    { src: pickLayers([7])[0], top: "22%", right: "5%", width: 80, opacity: 0.48, duration: 11, delay: 0.2, visible: "md" },
    { src: pickLayers([8])[0], top: "45%", left: "3%", width: 70, opacity: 0.5, duration: 9, delay: 1.8, visible: "md" },
    { src: pickLayers([9])[0], bottom: "35%", right: "8%", width: 65, opacity: 0.46, duration: 10, delay: 2.5, visible: "md" },
    { src: pickLayers([10])[0], top: "70%", left: "12%", width: 60, opacity: 0.48, duration: 12, delay: 0.8, visible: "md" },
    { src: pickLayers([11])[0], top: "15%", right: "12%", width: 62, opacity: 0.46, duration: 9, delay: 1.4, visible: "md" },
    { src: pickLayers([12])[0], top: "52%", left: "9%", width: 58, opacity: 0.5, duration: 11, delay: 2.2, visible: "md" },
    { src: pickLayers([13])[0], bottom: "55%", right: "5%", width: 55, opacity: 0.48, duration: 8, delay: 0.4, visible: "md" },
    { src: pickLayers([0])[0], top: "8%", right: "18%", width: 66, opacity: 0.5, duration: 11, delay: 1.1, visible: "md" },
    { src: pickLayers([1])[0], top: "35%", left: "14%", width: 54, opacity: 0.46, duration: 9, delay: 2.8, visible: "md" },
    { src: pickLayers([2])[0], bottom: "62%", right: "14%", width: 52, opacity: 0.48, duration: 10, delay: 0.7, visible: "md" },
  ],
  science: [
    { src: pickLayers([0])[0], top: "8%", right: "3%", width: 85, opacity: 0.55, duration: 9, delay: 0, visible: "md" },
    { src: pickLayers([1])[0], bottom: "12%", left: "2%", width: 70, opacity: 0.5, duration: 11, delay: 1.5, visible: "md" },
    { src: pickLayers([2])[0], top: "30%", left: "6%", width: 75, opacity: 0.48, duration: 10, delay: 0.6, visible: "md" },
    { src: pickLayers([3])[0], top: "55%", right: "7%", width: 65, opacity: 0.5, duration: 8, delay: 2, visible: "md" },
    { src: pickLayers([4])[0], bottom: "38%", right: "4%", width: 58, opacity: 0.46, duration: 12, delay: 1.2, visible: "md" },
    { src: pickLayers([5])[0], top: "75%", left: "10%", width: 55, opacity: 0.48, duration: 9, delay: 2.3, visible: "md" },
    { src: pickLayers([6])[0], top: "18%", left: "11%", width: 60, opacity: 0.5, duration: 10, delay: 1.8, visible: "md" },
    { src: pickLayers([7])[0], top: "62%", right: "12%", width: 52, opacity: 0.46, duration: 11, delay: 0.3, visible: "md" },
    { src: pickLayers([8])[0], bottom: "58%", left: "5%", width: 56, opacity: 0.48, duration: 8, delay: 2.5, visible: "md" },
  ],
  reels: [
    { src: pickLayers([9])[0], top: "2%", left: "1%", width: 65, opacity: 0.5, duration: 12, delay: 0, visible: "md" },
    { src: pickLayers([10])[0], bottom: "4%", right: "2%", width: 55, opacity: 0.48, duration: 10, delay: 2, visible: "md" },
    { src: pickLayers([11])[0], top: "25%", right: "5%", width: 60, opacity: 0.46, duration: 9, delay: 0.8, visible: "md" },
    { src: pickLayers([12])[0], top: "50%", left: "3%", width: 50, opacity: 0.48, duration: 11, delay: 1.5, visible: "md" },
    { src: pickLayers([13])[0], bottom: "28%", left: "4%", width: 52, opacity: 0.45, duration: 10, delay: 2.2, visible: "md" },
    { src: pickLayers([0])[0], top: "72%", right: "8%", width: 48, opacity: 0.46, duration: 8, delay: 0.4, visible: "md" },
    { src: pickLayers([1])[0], top: "38%", right: "11%", width: 46, opacity: 0.48, duration: 11, delay: 1.2, visible: "md" },
    { src: pickLayers([2])[0], bottom: "45%", left: "6%", width: 44, opacity: 0.45, duration: 9, delay: 2.6, visible: "md" },
  ],
  testimonials: [
    { src: pickLayers([3])[0], top: "6%", right: "4%", width: 80, opacity: 0.52, duration: 9, delay: 0.5, visible: "md" },
    { src: pickLayers([4])[0], bottom: "6%", left: "3%", width: 75, opacity: 0.5, duration: 10, delay: 1, visible: "md" },
    { src: pickLayers([5])[0], top: "28%", left: "6%", width: 68, opacity: 0.48, duration: 11, delay: 0.2, visible: "md" },
    { src: pickLayers([6])[0], top: "52%", right: "5%", width: 62, opacity: 0.5, duration: 8, delay: 1.8, visible: "md" },
    { src: pickLayers([7])[0], bottom: "30%", right: "9%", width: 58, opacity: 0.46, duration: 12, delay: 2.5, visible: "md" },
    { src: pickLayers([8])[0], top: "78%", left: "8%", width: 55, opacity: 0.48, duration: 9, delay: 1.2, visible: "md" },
    { src: pickLayers([9])[0], top: "40%", left: "4%", width: 56, opacity: 0.5, duration: 10, delay: 0.7, visible: "md" },
    { src: pickLayers([10])[0], bottom: "52%", right: "7%", width: 52, opacity: 0.46, duration: 11, delay: 2.2, visible: "md" },
  ],
  market: [
    { src: pickLayers([11])[0], top: "4%", left: "1%", width: 90, opacity: 0.55, duration: 8, delay: 0, visible: "md" },
    { src: pickLayers([12])[0], bottom: "5%", right: "2%", width: 70, opacity: 0.5, duration: 11, delay: 1.5, visible: "md" },
    { src: pickLayers([13])[0], top: "22%", right: "6%", width: 72, opacity: 0.48, duration: 9, delay: 0.7, visible: "md" },
    { src: pickLayers([0])[0], top: "48%", left: "4%", width: 65, opacity: 0.5, duration: 10, delay: 2, visible: "md" },
    { src: pickLayers([1])[0], bottom: "32%", left: "7%", width: 60, opacity: 0.46, duration: 12, delay: 1.2, visible: "md" },
    { src: pickLayers([2])[0], top: "68%", right: "10%", width: 58, opacity: 0.48, duration: 8, delay: 2.3, visible: "md" },
    { src: pickLayers([3])[0], top: "35%", left: "8%", width: 55, opacity: 0.5, duration: 11, delay: 0.4, visible: "md" },
    { src: pickLayers([4])[0], bottom: "58%", right: "5%", width: 52, opacity: 0.46, duration: 9, delay: 1.8, visible: "md" },
  ],
  contact: [
    { src: pickLayers([5])[0], top: "5%", right: "1%", width: 95, opacity: 0.55, duration: 10, delay: 0, visible: "md" },
    { src: pickLayers([6])[0], top: "5%", left: "1%", width: 88, opacity: 0.52, duration: 9, delay: 0.6, visible: "md" },
    { src: pickLayers([7])[0], bottom: "5%", right: "2%", width: 82, opacity: 0.53, duration: 11, delay: 1.2, visible: "md" },
    { src: pickLayers([8])[0], bottom: "6%", left: "2%", width: 78, opacity: 0.5, duration: 8, delay: 1.8, visible: "md" },
    { src: pickLayers([9])[0], top: "20%", left: "4%", width: 72, opacity: 0.5, duration: 10, delay: 0.3, visible: "md" },
    { src: pickLayers([10])[0], top: "22%", right: "5%", width: 68, opacity: 0.48, duration: 12, delay: 2, visible: "md" },
    { src: pickLayers([11])[0], top: "38%", left: "3%", width: 65, opacity: 0.52, duration: 9, delay: 0.9, visible: "md" },
    { src: pickLayers([12])[0], top: "40%", right: "4%", width: 62, opacity: 0.48, duration: 11, delay: 2.4, visible: "md" },
    { src: pickLayers([13])[0], top: "55%", left: "6%", width: 70, opacity: 0.5, duration: 8, delay: 0.5, visible: "md" },
    { src: pickLayers([0])[0], top: "58%", right: "8%", width: 66, opacity: 0.48, duration: 10, delay: 1.5, visible: "md" },
    { src: pickLayers([1])[0], bottom: "28%", left: "5%", width: 60, opacity: 0.5, duration: 9, delay: 2.2, visible: "md" },
    { src: pickLayers([2])[0], bottom: "30%", right: "6%", width: 58, opacity: 0.46, duration: 11, delay: 0.8, visible: "md" },
    { src: pickLayers([3])[0], top: "75%", left: "4%", width: 64, opacity: 0.52, duration: 10, delay: 1.4, visible: "md" },
    { src: pickLayers([4])[0], top: "78%", right: "7%", width: 56, opacity: 0.48, duration: 8, delay: 2.6, visible: "md" },
    { src: pickLayers([5])[0], bottom: "48%", left: "2%", width: 54, opacity: 0.5, duration: 12, delay: 0.2, visible: "md" },
    { src: pickLayers([6])[0], bottom: "52%", right: "3%", width: 52, opacity: 0.46, duration: 9, delay: 1.6, visible: "md" },
  ],
  plans: [
    { src: pickLayers([7])[0], top: "4%", left: "2%", width: 90, opacity: 0.55, duration: 10, delay: 0, visible: "md" },
    { src: pickLayers([8])[0], top: "5%", right: "3%", width: 82, opacity: 0.52, duration: 9, delay: 0.8, visible: "md" },
    { src: pickLayers([9])[0], bottom: "8%", left: "5%", width: 75, opacity: 0.5, duration: 11, delay: 1.5, visible: "md" },
    { src: pickLayers([10])[0], bottom: "6%", right: "4%", width: 78, opacity: 0.5, duration: 8, delay: 2, visible: "md" },
    { src: pickLayers([11])[0], top: "25%", left: "4%", width: 68, opacity: 0.48, duration: 10, delay: 0.4, visible: "md" },
    { src: pickLayers([12])[0], top: "28%", right: "6%", width: 65, opacity: 0.5, duration: 12, delay: 1.2, visible: "md" },
    { src: pickLayers([13])[0], top: "48%", left: "3%", width: 62, opacity: 0.48, duration: 9, delay: 2.2, visible: "md" },
    { src: pickLayers([0])[0], top: "52%", right: "5%", width: 60, opacity: 0.5, duration: 8, delay: 0.6, visible: "md" },
    { src: pickLayers([1])[0], bottom: "35%", left: "6%", width: 58, opacity: 0.46, duration: 11, delay: 1.8, visible: "md" },
    { src: pickLayers([2])[0], bottom: "38%", right: "7%", width: 56, opacity: 0.48, duration: 10, delay: 2.4, visible: "md" },
    { src: pickLayers([3])[0], top: "72%", left: "5%", width: 64, opacity: 0.5, duration: 9, delay: 0.3, visible: "md" },
    { src: pickLayers([4])[0], top: "75%", right: "4%", width: 55, opacity: 0.48, duration: 11, delay: 1.4, visible: "md" },
  ],
};

type DecorativeVeggiesProps = {
  section: keyof typeof SECTION_CONFIG;
};

export default function DecorativeVeggies({ section }: DecorativeVeggiesProps) {
  const placements = SECTION_CONFIG[section];
  if (!placements?.length) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      aria-hidden
    >
      {placements.map((p, i) => {
        const wrapperStyle: React.CSSProperties = {
          position: "absolute",
          top: p.top,
          right: p.right,
          bottom: p.bottom,
          left: p.left,
          width: p.width,
          height: p.width,
          maxWidth: "min(100%, 260px)",
          maxHeight: "min(100%, 260px)",
          opacity: p.opacity,
          animation: `veggie-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
        };
        const visibilityClass = p.visible === "md" ? "hidden md:block" : "";
        return (
          <div
            key={`${section}-${i}-${p.src}`}
            className={visibilityClass}
            style={wrapperStyle}
          >
            <Image
              src={p.src}
              alt=""
              width={p.width}
              height={p.width}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        );
      })}
    </div>
  );
}
