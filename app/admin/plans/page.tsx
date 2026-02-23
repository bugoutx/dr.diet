"use client";

import Link from "next/link";

export default function AdminPlansPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Subscription Plans
      </h1>
      <p className="text-drd-muted mb-4">
        CRUD plans with weeklyPrice, monthlyPrice, currency=SYP, isPopular, features (included
        boolean). Reorder. (Coming in next phase.)
      </p>
      <Link href="/admin" className="text-drd-primary hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
