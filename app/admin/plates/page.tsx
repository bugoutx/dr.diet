"use client";

import Link from "next/link";

export default function AdminPlatesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Our Most-Loved Plates
      </h1>
      <p className="text-drd-muted mb-4">
        Full CRUD for signature dishes with title, subtitle, description, image, gallery, protein,
        calories, carbs, tags, ingredients, allergens, nutrition facts. (Coming in next phase.)
      </p>
      <Link href="/admin" className="text-drd-primary hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
