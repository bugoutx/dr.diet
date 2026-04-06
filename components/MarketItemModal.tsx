"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";
import { formatPrice } from "@/lib/formatNumber";
import { formatMacros } from "@/lib/formatMacro";

export type MarketItemShape = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  price?: number | null;
  image: string;
  protein?: number | null;
  carbs?: number | null;
  calories?: number | null;
};

type Props = {
  item: MarketItemShape | null;
  onClose: () => void;
};

export default function MarketItemModal({ item, onClose }: Props) {
  const { lang } = useLang();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [item, handleEscape]);

  if (!item) return null;

  const name = tField(lang, item.nameEn, item.nameAr);
  const description = tField(lang, item.descriptionEn, item.descriptionAr);
  const macros = formatMacros(lang, {
    proteinG: item.protein ?? undefined,
    carbsG: item.carbs ?? undefined,
    calories: item.calories ?? undefined,
  });

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="market-modal-title"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close"
      />
      <div
        className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex-shrink-0 relative w-full aspect-[4/3] bg-slate-100">
          <Image
            src={item.image}
            alt={name || item.id}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
            unoptimized={item.image.startsWith("http")}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 hide-scrollbar">
          <h2 id="market-modal-title" className="text-xl font-bold font-heading text-drd-text mb-2">
            {name}
          </h2>
          {description?.trim() && (
            <p className="text-drd-text/80 text-sm leading-relaxed mb-4">{description}</p>
          )}
          {item.price != null && (
            <p className="text-lg font-semibold text-drd-primary mb-4">
              {formatPrice(item.price, lang)}
            </p>
          )}
          {macros.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {macros.map((label, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 border border-slate-200/80 text-drd-text"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-3 md:top-4 h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-drd-text hover:bg-white ${lang === "ar" ? "left-3 md:left-4 right-auto" : "right-3 md:right-4 left-auto"}`}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
