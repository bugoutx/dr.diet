"use client";

import Link from "next/link";

export default function AdminHeroPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Hero Section
      </h1>
      <p className="text-drd-muted mb-4">
        Manage exactly 3 featured meals for the hero carousel. Pick from existing meals or create
        custom hero items. (Full CRUD coming in next phase.)
      </p>
      <Link href="/admin" className="text-drd-primary hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
