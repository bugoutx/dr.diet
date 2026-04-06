"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";

type MarketCategory = {
  id: string;
  nameEn: string;
  nameAr: string;
  order: number;
  isActive: boolean;
  items: { id: string }[];
};

export default function AdminMarketCategoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [cat, setCat] = useState<MarketCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/market/categories/${id}`)
      .then(async (r) => {
        const text = await r.text();
        try { return text ? JSON.parse(text) : null; } catch { return null; }
      })
      .then(setCat)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cat) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/market/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: cat.nameEn,
          nameAr: cat.nameAr,
          order: cat.order,
          isActive: cat.isActive,
        }),
      });
      if (res.ok) {
        toast.success("Updated");
        router.push("/admin/market/categories");
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
        title="Edit Market Category"
        backLabel="Market Categories"
        backHref="/admin/market/categories"
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
          <label className="block text-sm font-medium text-drd-text mb-1">Order</label>
          <input
            type="number"
            value={cat.order}
            onChange={(e) => setCat({ ...cat, order: parseInt(e.target.value, 10) || 0 })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            min={0}
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cat.isActive}
              onChange={(e) => setCat({ ...cat, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-drd-primary"
            />
            <span className="text-sm text-drd-text">Active</span>
          </label>
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
          href={`/admin/market/items?categoryId=${id}`}
          className="text-drd-primary hover:underline"
        >
          Manage items in this category →
        </Link>
      </div>
    </div>
  );
}
