/**
 * Format a number with thousands separators for display.
 * Uses en-US locale (e.g. 30,000). Safe for string prices from admin.
 */
export type Lang = "en" | "ar";

export function formatNumber(n: number | string | null | undefined, _lang: Lang = "en"): string {
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
