/**
 * Rewrites a remote media URL (Vercel Blob / Cloudinary) to a same-origin proxy URL
 * (see app/api/media/route.ts). Used for <video> sources/posters because some in-app
 * browsers (Instagram/Facebook on Android) fail to load the cross-origin blob domain.
 *
 * Local/relative URLs (e.g. /reels/reel-1.mp4) are returned unchanged.
 */
export function proxyMedia(url: string | null | undefined): string {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return url;
  return `/api/media?url=${encodeURIComponent(url)}`;
}
