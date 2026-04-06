"use client";

import { useEffect, useState } from "react";
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

export default function AdminMarketCategoriesPage() {
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNameEn, setNewNameEn] = useState("");
  const [newNameAr, setNewNameAr] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  function load() {
    fetch("/api/admin/market/categories")
      .then(async (r) => {
        const text = await r.text();
        try { return text ? JSON.parse(text) : []; } catch { return []; }
      })
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
      toast.error("Name (English) and Name (Arabic) are required.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/market/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: newNameEn.trim(),
          nameAr: newNameAr.trim(),
          order: categories.length,
          isActive: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      setNewNameEn("");
      setNewNameAr("");
      load();
      toast.success("Category added");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? All items in it will be deleted.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/market/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      load();
      toast.success("Deleted");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  async function moveCategory(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= categories.length || reordering) return;
    const newOrder = [...categories];
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    const categoryIds = newOrder.map((c) => c.id);
    setCategories(newOrder);
    setReordering(true);
    try {
      const res = await fetch("/api/admin/market/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
      toast.success("Order updated");
    } catch {
      setCategories(categories);
      toast.error("Something went wrong");
    } finally {
      setReordering(false);
    }
  }

  async function handleToggleActive(cat: MarketCategory) {
    const next = !cat.isActive;
    setCategories(categories.map((c) => (c.id === cat.id ? { ...c, isActive: next } : c)));
    try {
      const res = await fetch(`/api/admin/market/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Updated");
    } catch {
      setCategories(categories.map((c) => (c.id === cat.id ? { ...c, isActive: !next } : c)));
      toast.error("Something went wrong");
    }
  }

  if (loading) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <AdminPageHeader
        title="Market Categories"
        backLabel="Market"
        backHref="/admin/market"
        showBack={true}
      />

      <form onSubmit={handleCreate} className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          value={newNameEn}
          onChange={(e) => setNewNameEn(e.target.value)}
          placeholder="Name (English) *"
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
        <LoadingButton
          type="submit"
          loading={creating}
          loadingLabel="Adding…"
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark"
        >
          Add Category
        </LoadingButton>
      </form>

      <div className="space-y-4">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveCategory(index, "up")}
                  disabled={index === 0 || reordering}
                  className="rounded border border-slate-200 px-2 py-1 text-sm disabled:opacity-40"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveCategory(index, "down")}
                  disabled={index === categories.length - 1 || reordering}
                  className="rounded border border-slate-200 px-2 py-1 text-sm disabled:opacity-40"
                >
                  ▼
                </button>
              </div>
              <div>
                <h2 className="font-semibold text-drd-text">{cat.nameEn}</h2>
                {cat.nameAr && (
                  <p className="text-sm text-drd-muted" dir="rtl">
                    {cat.nameAr}
                  </p>
                )}
                <span className="text-xs text-drd-muted">{cat.items.length} items</span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cat.isActive}
                  onChange={() => handleToggleActive(cat)}
                  className="h-4 w-4 rounded border-slate-300 text-drd-primary"
                />
                <span className="text-sm text-drd-muted">Active</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/market/categories/${cat.id}`}
                className="rounded-lg border border-drd-primary px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/10"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                disabled={deletingId === cat.id}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === cat.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
