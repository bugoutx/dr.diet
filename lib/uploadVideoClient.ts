"use client";

import { upload } from "@vercel/blob/client";

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

const BLOB_UPLOAD_URL = "/api/admin/blob-upload";

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "video";
}

/**
 * Upload a video directly from the browser to Vercel Blob (no large body through Next.js).
 * Requires an authenticated admin session (cookie) for the token request only.
 */
export async function uploadAdminVideoBlob(file: File): Promise<{ url: string }> {
  const isVideoMime = file.type.startsWith("video/");
  const extOk = /\.(mp4|mov|webm)$/i.test(file.name);
  if (!isVideoMime && !extOk) {
    throw new Error("INVALID_TYPE");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const pathname = `videos/${Date.now()}-${safeFilename(file.name)}`;

  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: BLOB_UPLOAD_URL,
    multipart: file.size > 8 * 1024 * 1024,
    contentType: file.type || "video/mp4",
  });

  return { url: blob.url };
}

export { MAX_VIDEO_BYTES };
