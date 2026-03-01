/**
 * Format a single macro for display in EN or AR.
 * Only use when value is not null/undefined.
 */
export type MacroKey = "protein" | "carbs" | "calories";

export function formatMacro(
  lang: "en" | "ar",
  key: MacroKey,
  value: number
): string {
  if (lang === "ar") {
    switch (key) {
      case "protein":
        return `${value}غ بروتين`;
      case "carbs":
        return `${value}غ كارب`;
      case "calories":
        return `${value} كال`;
      default:
        return String(value);
    }
  }
  switch (key) {
    case "protein":
      return `${value}g Protein`;
    case "carbs":
      return `${value}g Carbs`;
    case "calories":
      return `${value} cal`;
    default:
      return String(value);
  }
}

/**
 * Format all macros for display (order: Protein, Carbs, Calories).
 * Returns array of strings; only includes non-null values.
 */
export function formatMacros(
  lang: "en" | "ar",
  opts: { proteinG?: number | null; carbsG?: number | null; calories?: number | null }
): string[] {
  const out: string[] = [];
  if (opts.proteinG != null) out.push(formatMacro(lang, "protein", opts.proteinG));
  if (opts.carbsG != null) out.push(formatMacro(lang, "carbs", opts.carbsG));
  if (opts.calories != null) out.push(formatMacro(lang, "calories", opts.calories));
  return out;
}
