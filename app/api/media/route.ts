/**
 * Same-origin media proxy for video (and any large media that can't go through the
 * Next.js image optimizer). Some in-app browsers (Instagram/Facebook on Android)
 * fail to load media from the cross-origin Vercel Blob domain, even though the page
 * itself loads fine. Streaming the bytes through our own origin sidesteps that.
 *
 * Usage: /api/media?url=<encoded https blob/cloudinary url>
 * Supports HTTP Range requests so <video> seeking/playback works.
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only proxy trusted media hosts (prevents this becoming an open proxy / SSRF).
const ALLOWED_HOST = /(\.public\.blob\.vercel-storage\.com|(^|\.)res\.cloudinary\.com)$/i;

const EXT_CONTENT_TYPE: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  m4v: "video/x-m4v",
  ogg: "video/ogg",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  svg: "image/svg+xml",
};

function inferContentType(url: string): string | undefined {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  return ext ? EXT_CONTENT_TYPE[ext] : undefined;
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) return new NextResponse("Missing url", { status: 400 });

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }
  if (target.protocol !== "https:" || !ALLOWED_HOST.test(target.hostname)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const range = req.headers.get("range");
  const upstream = await fetch(target.toString(), {
    headers: range ? { Range: range } : {},
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new NextResponse("Upstream error", { status: 502 });
  }

  const headers = new Headers();
  for (const h of ["content-length", "content-range", "etag", "last-modified"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  const contentType =
    upstream.headers.get("content-type") &&
    upstream.headers.get("content-type") !== "application/octet-stream"
      ? upstream.headers.get("content-type")!
      : inferContentType(target.pathname) ?? "application/octet-stream";
  headers.set("content-type", contentType);
  headers.set("accept-ranges", "bytes");
  headers.set("content-disposition", "inline");
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new NextResponse(upstream.body, { status: upstream.status, headers });
}
