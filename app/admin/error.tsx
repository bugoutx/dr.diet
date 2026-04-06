"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useLang();
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-drd-text mb-2">
        {tField(lang, "Something went wrong", "حدث خطأ ما")}
      </h2>
      <p className="text-drd-muted mb-6 max-w-md text-sm">
        {tField(lang, "An error occurred while loading this page. You can try again or return to the dashboard.", "حدث خطأ أثناء تحميل هذه الصفحة. يمكنك المحاولة مرة أخرى أو العودة إلى لوحة التحكم.")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-drd-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-drd-primary-dark transition-colors"
        >
          {tField(lang, "Try again", "حاول مرة أخرى")}
        </button>
        <Link
          href="/admin"
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-drd-text hover:bg-slate-50 transition-colors"
        >
          {tField(lang, "Back to Dashboard", "رجوع إلى لوحة التحكم")}
        </Link>
      </div>
    </div>
  );
}
