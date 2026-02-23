"use client";

import Link from "next/link";

export default function AdminTestimonialsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Testimonials
      </h1>
      <p className="text-drd-muted mb-4">
        CRUD testimonials (name, role, text, rating, avatar). Reorder. (Coming in next phase.)
      </p>
      <Link href="/admin" className="text-drd-primary hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
