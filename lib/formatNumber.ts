/**
 * Format a number with thousands separators for display.
 * Uses en-US locale (e.g. 30,000). Safe for string prices from admin.
 */
export type Lang = "en" | "ar";

export function formatNumber(n: number | string | null | undefined): string {
  if (n === null || n === undefined) return "";
  if (typeof n === "string") {
    const stripped = n.replace(/,/g, "").trim();
    const num = Number(stripped);
    if (Number.isNaN(num)) return n;
    n = num;
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Format price with currency label by language.
 * EN: "30,000 SYP" | AR: "30,000 ل.س"
 * Returns empty string if amount is null/undefined.
 */
export function formatPrice(amount: number | string | null | undefined, lang: Lang): string {
  const formatted = formatNumber(amount);
  if (!formatted) return "";
  return `${formatted} ${lang === "ar" ? "ل.س" : "SYP"}`;
}
