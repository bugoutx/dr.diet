/**
 * Safely extract Google Maps embed iframe src from raw HTML.
 * Only allows https://www.google.com/maps/embed? to prevent XSS.
 * Returns null if not found or invalid.
 */
const GOOGLE_MAPS_EMBED_PREFIX = "https://www.google.com/maps/embed?";

export function extractGoogleMapsEmbedSrc(html: string | null | undefined): string | null {
  if (!html || typeof html !== "string") return null;
  const trimmed = html.trim();
  if (!trimmed) return null;
  if (!/<\s*iframe/i.test(trimmed)) return null;
  // Match src="..." or src='...' (any attribute order)
  const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  if (!srcMatch?.[1]) return null;
  const src = srcMatch[1].trim();
  if (!src.startsWith(GOOGLE_MAPS_EMBED_PREFIX)) return null;
  return src;
}
