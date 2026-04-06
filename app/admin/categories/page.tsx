"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

type Category = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  order: number;
  meals: { id: string }[];
};

export default function AdminCategoriesPage() {
  const { lang } = useLang();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNameEn, setNewNameEn] = useState("");
  const [newNameAr, setNewNameAr] = useState("");
  const [newDescEn, setNewDescEn] = useState("");
  const [newDescAr, setNewDescAr] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newNameEn.trim() || !newNameAr.trim()) {
      toast.error(tField(lang, "Name (English) and Name (Arabic) are required.", "الاسم (إنجليزي) و (عربي) مطلوبان."));
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: newNameEn.trim(),
          nameAr: newNameAr.trim(),
          descriptionEn: newDescEn.trim() || null,
          descriptionAr: newDescAr.trim() || null,
          order: categories.length,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      setNewNameEn("");
      setNewNameAr("");
      setNewDescEn("");
      setNewDescAr("");
      load();
      toast.success(tField(lang, "Category added", "تمت إضافة الفئة"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(tField(lang, "Delete this category? All meals in it will be deleted.", "حذف هذه الفئة؟ سيتم حذف جميع الوجبات فيها."))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      load();
      toast.success(tField(lang, "Deleted", "تم الحذف"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <div className="text-drd-muted">{tField(lang, "Loading...", "جاري التحميل...")}</div>;

  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Categories", "الفئات")}
        backLabel={tField(lang, "Dashboard", "لوحة التحكم")}
        backHref="/admin"
        showBack={false}
      />

      <form onSubmit={handleCreate} className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          value={newNameEn}
          onChange={(e) => setNewNameEn(e.target.value)}
          placeholder={tField(lang, "Name (English) *", "الاسم (إنجليزي) *")}
          className="rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
        />
        <input
          type="text"
          value={newNameAr}
          onChange={(e) => setNewNameAr(e.target.value)}
          placeholder="الاسم (عربي) *"
          dir="rtl"
          className="rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right min-w-[160px]"
        />
        <input
          type="text"
          value={newDescEn}
          onChange={(e) => setNewDescEn(e.target.value)}
          placeholder={tField(lang, "Description (English)", "الوصف (إنجليزي)")}
          className="rounded-lg border border-slate-200 px-4 py-2 text-drd-text min-w-[200px]"
        />
        <input
          type="text"
          value={newDescAr}
          onChange={(e) => setNewDescAr(e.target.value)}
          placeholder="الوصف (عربي)"
          dir="rtl"
          className="rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right min-w-[160px]"
        />
        <LoadingButton
          type="submit"
          loading={creating}
          loadingLabel={tField(lang, "Adding…", "جاري الإضافة…")}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark"
        >
          {tField(lang, "Add Category", "إضافة فئة")}
        </LoadingButton>
      </form>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <h2 className="font-semibold text-drd-text">{cat.nameEn}</h2>
              {cat.nameAr && <p className="text-sm text-drd-muted" dir="rtl">{cat.nameAr}</p>}
              {(cat.descriptionEn || cat.descriptionAr) && (
                <p className="text-sm text-drd-muted">{cat.descriptionEn || cat.descriptionAr}</p>
              )}
              <span className="text-xs text-drd-muted">{cat.meals.length} {tField(lang, "meals", "وجبات")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/categories/${cat.id}`}
                className="rounded-lg border border-drd-primary px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/10"
              >
                {tField(lang, "Edit", "تعديل")}
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                disabled={deletingId === cat.id}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === cat.id ? tField(lang, "Deleting…", "جاري الحذف…") : tField(lang, "Delete", "حذف")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
