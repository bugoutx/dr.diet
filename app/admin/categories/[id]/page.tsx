"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";

type Category = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  order: number;
};

export default function AdminCategoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [cat, setCat] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/categories/${id}`)
      .then((r) => r.json())
      .then(setCat)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cat) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: cat.nameEn,
          nameAr: cat.nameAr,
          descriptionEn: cat.descriptionEn ?? null,
          descriptionAr: cat.descriptionAr ?? null,
        }),
      });
      if (res.ok) {
        toast.success("Updated");
        router.push("/admin/categories");
      } else throw new Error("Failed to update");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !cat) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <AdminPageHeader
        title="Edit Category"
        backLabel="Categories"
        backHref="/admin/categories"
      />
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Name (English) *</label>
          <input
            type="text"
            value={cat.nameEn}
            onChange={(e) => setCat({ ...cat, nameEn: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Name (Arabic) *</label>
          <input
            type="text"
            value={cat.nameAr}
            onChange={(e) => setCat({ ...cat, nameAr: e.target.value })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            placeholder="الاسم بالعربية"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (English)</label>
          <textarea
            value={cat.descriptionEn ?? ""}
            onChange={(e) => setCat({ ...cat, descriptionEn: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (Arabic)</label>
          <textarea
            value={cat.descriptionAr ?? ""}
            onChange={(e) => setCat({ ...cat, descriptionAr: e.target.value || null })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            placeholder="الوصف بالعربية"
            rows={3}
          />
        </div>
        <LoadingButton
          type="submit"
          loading={saving}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          Save
        </LoadingButton>
      </form>
      <div className="mt-8">
        <Link
          href={`/admin/meals?categoryId=${id}`}
          className="text-drd-primary hover:underline"
        >
          Manage meals in this category →
        </Link>
      </div>
    </div>
  );
}
