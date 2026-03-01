/**
 * Safe helper for bilingual fields. Prefers the requested language, falls back to the other.
 */
export function tField(
  lang: "en" | "ar",
  en?: string | null,
  ar?: string | null
): string {
  const cleanEn = (en ?? "").trim();
  const cleanAr = (ar ?? "").trim();
  if (lang === "ar") return cleanAr || cleanEn;
  return cleanEn || cleanAr;
}
