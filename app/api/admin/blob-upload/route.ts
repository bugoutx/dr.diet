import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";

/** Max video size for direct client uploads (matches token generation). */
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

/**
 * Vercel Blob client-upload handler: small JSON bodies only (no full file through this route).
 * - `blob.generate-client-token`: must be authenticated admin (browser + session).
 * - `blob.upload-completed`: verified via `x-vercel-signature` inside `handleUpload` (no session).
 */
export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.type === "blob.generate-client-token") {
    const authError = await requireAdmin();
    if (authError) return authError;
  }

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("videos/")) {
          throw new Error("Invalid upload path");
        }
        return {
          allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm"],
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // URL is returned to the client from `upload()`; DB write happens in admin UI.
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Blob handleUpload error:", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
