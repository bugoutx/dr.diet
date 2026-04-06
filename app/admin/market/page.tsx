"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

type SectionContent = {
  marketTitleEn: string | null;
  marketTitleAr: string | null;
  marketSubtitleEn: string | null;
  marketSubtitleAr: string | null;
};

export default function AdminMarketPage() {
  const { lang } = useLang();
  const [sectionContent, setSectionContent] = useState<SectionContent>({
    marketTitleEn: null,
    marketTitleAr: null,
    marketSubtitleEn: null,
    marketSubtitleAr: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSectionContent({
          marketTitleEn: data.marketTitleEn ?? null,
          marketTitleAr: data.marketTitleAr ?? null,
          marketSubtitleEn: data.marketSubtitleEn ?? null,
          marketSubtitleAr: data.marketSubtitleAr ?? null,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveSectionContent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketTitleEn: sectionContent.marketTitleEn?.trim() || null,
          marketTitleAr: sectionContent.marketTitleAr?.trim() || null,
          marketSubtitleEn: sectionContent.marketSubtitleEn?.trim() || null,
          marketSubtitleAr: sectionContent.marketSubtitleAr?.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(tField(lang, "Saved", "تم الحفظ"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader title={tField(lang, "Dr.Diet Market", "سوق Dr.Diet")} backLabel={tField(lang, "Dashboard", "لوحة التحكم")} backHref="/admin" showBack={false} />
        <div className="text-drd-muted">{tField(lang, "Loading...", "جاري التحميل...")}</div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Dr.Diet Market", "سوق Dr.Diet")}
        backLabel={tField(lang, "Dashboard", "لوحة التحكم")}
        backHref="/admin"
        showBack={false}
      />
      <form onSubmit={handleSaveSectionContent} className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-drd-text mb-4">{tField(lang, "Section title & subtitle", "عنوان القسم والعنوان الفرعي")}</h2>
        <p className="text-sm text-drd-muted mb-4">{tField(lang, "Shown at the top of the Dr.Diet Market section on the landing page. Leave empty to use defaults.", "يظهر في أعلى قسم السوق على الصفحة الرئيسية. اتركه فارغاً لاستخدام الافتراضي.")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-drd-text mb-1">{tField(lang, "Title (English)", "العنوان (إنجليزي)")}</label>
            <input
              type="text"
              value={sectionContent.marketTitleEn ?? ""}
              onChange={(e) => setSectionContent((s) => ({ ...s, marketTitleEn: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="Dr.Diet Market"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-drd-text mb-1">Title (Arabic)</label>
            <input
              type="text"
              value={sectionContent.marketTitleAr ?? ""}
              onChange={(e) => setSectionContent((s) => ({ ...s, marketTitleAr: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="سوق د.دايت"
              dir="rtl"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (English)</label>
            <input
              type="text"
              value={sectionContent.marketSubtitleEn ?? ""}
              onChange={(e) => setSectionContent((s) => ({ ...s, marketSubtitleEn: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="Healthy snacks and products to support your goals."
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (Arabic)</label>
            <input
              type="text"
              value={sectionContent.marketSubtitleAr ?? ""}
              onChange={(e) => setSectionContent((s) => ({ ...s, marketSubtitleAr: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="وجبات خفيفة ومنتجات صحية لدعم أهدافك."
              dir="rtl"
            />
          </div>
        </div>
        <div className="mt-4">
          <LoadingButton
            type="submit"
            loading={saving}
            loadingLabel={tField(lang, "Saving…", "جاري الحفظ…")}
            className="rounded-full bg-drd-primary px-5 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
          >
            {tField(lang, "Save section title & subtitle", "حفظ عنوان القسم والعنوان الفرعي")}
          </LoadingButton>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/market/categories"
          className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-drd-primary/40 hover:shadow-md"
        >
          <h2 className="font-semibold text-drd-text">{tField(lang, "Market Categories", "فئات السوق")}</h2>
          <p className="mt-1 text-sm text-drd-muted">{tField(lang, "Manage categories (EN/AR, order, active).", "إدارة الفئات (عربي/إنجليزي، ترتيب، مفعل).")}</p>
        </Link>
        <Link
          href="/admin/market/items"
          className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-drd-primary/40 hover:shadow-md"
        >
          <h2 className="font-semibold text-drd-text">{tField(lang, "Market Items", "منتجات السوق")}</h2>
          <p className="mt-1 text-sm text-drd-muted">{tField(lang, "Add and edit items with image, price, macros.", "إضافة وتعديل المنتجات مع الصورة والسعر والقيم الغذائية.")}</p>
        </Link>
      </div>
    </div>
  );
}
