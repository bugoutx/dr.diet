"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-drd-text mb-2">
        Something went wrong
      </h2>
      <p className="text-drd-muted mb-6 max-w-md text-sm">
        An error occurred while loading this page. You can try again or return to the dashboard.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-drd-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-drd-primary-dark transition-colors"
        >
          Try again
        </button>
        <Link
          href="/admin"
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-drd-text hover:bg-slate-50 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
