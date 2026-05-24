/**
 * Detect social-app in-app webviews (Instagram, Facebook, etc.) from a User-Agent string.
 *
 * These embedded browsers do not reliably trigger native `loading="lazy"` image loads,
 * which leaves below-the-fold (and sometimes all) images blank. We detect them so images
 * can be rendered eagerly instead. See `components/SmartImage.tsx`.
 */
export function isInAppBrowserUA(ua: string | null | undefined): boolean {
  if (!ua) return false;
  return /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|Line\/|MicroMessenger|Snapchat|TikTok|musical_ly|Twitter|Pinterest/i.test(
    ua
  );
}
