"use client";

import Link from "next/link";

export default function AdminVideosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Videos
      </h1>
      <p className="text-drd-muted mb-4">
        CRUD videos (mp4 URLs). Max 5 visible. Autoplay on landing (muted, loop, playsInline).
        Click opens modal for full play. (Coming in next phase.)
      </p>
      <Link href="/admin" className="text-drd-primary hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
