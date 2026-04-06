"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type MarketItem = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  price: number | null;
  image: string;
  protein: number | null;
  carbs: number | null;
  calories: number | null;
  order: number;
  isActive: boolean;
  category: { id: string; nameEn: string; nameAr: string };
};

type MarketCategory = { id: string; nameEn: string; nameAr: string };

export default function AdminMarketItemsPage() {
  const searchParams = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("categoryId") ?? "");
  const [items, setItems] = useState<MarketItem[]>([]);
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = categoryFilter
      ? `/api/admin/market/items?categoryId=${encodeURIComponent(categoryFilter)}`
      : "/api/admin/market/items";
    fetch(url)
      .then(async (r) => {
        const text = await r.text();
        try { return text ? JSON.parse(text) : []; } catch { return []; }
      })
      .then((i) => setItems(Array.isArray(i) ? i : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryFilter]);

  useEffect(() => {
    fetch("/api/admin/market/categories")
      .then(async (r) => {
        const text = await r.text();
        try { return text ? JSON.parse(text) : []; } catch { return []; }
      })
      .then((c) => setCategories(Array.isArray(c) ? c : []))
      .catch(console.error);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/market/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems(items.filter((m) => m.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length || reordering) return;
    const newOrder = [...items];
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    const itemIds = newOrder.map((i) => i.id);
    setItems(newOrder);
    setReordering(true);
    try {
      const res = await fetch("/api/admin/market/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
      toast.success("Order updated");
    } catch {
      setItems(items);
      toast.error("Something went wrong");
    } finally {
      setReordering(false);
    }
  }

  if (loading && items.length === 0) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <AdminPageHeader
        title="Market Items"
        backLabel="Market"
        backHref="/admin/market"
        showBack={true}
        actions={
          <Link
            href={categoryFilter ? `/admin/market/items/new?categoryId=${categoryFilter}` : "/admin/market/items/new"}
            className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark"
          >
            Add Item
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-drd-text">Category</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nameEn}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => moveItem(index, "up")}
                disabled={index === 0 || reordering}
                className="rounded border border-slate-200 px-2 py-1 text-sm disabled:opacity-40"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, "down")}
                disabled={index === items.length - 1 || reordering}
                className="rounded border border-slate-200 px-2 py-1 text-sm disabled:opacity-40"
              >
                ▼
              </button>
            </div>
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={item.image}
                alt={item.nameEn || item.nameAr || "Item"}
                fill
                className="object-cover"
                unoptimized={item.image.startsWith("http")}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-drd-text">{item.nameEn}</h2>
              {item.nameAr && (
                <p className="text-sm text-drd-muted" dir="rtl">{item.nameAr}</p>
              )}
              <p className="text-sm text-drd-muted">{item.category.nameEn}</p>
              <p className="text-xs text-drd-muted">
                {[
                  item.protein != null && `${item.protein}g protein`,
                  item.carbs != null && `${item.carbs}g carbs`,
                  item.calories != null && `${item.calories} cal`,
                  item.price != null && `${item.price} SYP`,
                ].filter(Boolean).join(" · ")}
              </p>
              {!item.isActive && (
                <span className="mt-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">Inactive</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/admin/market/items/${item.id}`}
                className="rounded-lg border border-drd-primary px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/10"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === item.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && !loading && (
        <p className="text-drd-muted">
          {categoryFilter ? "No items in this category." : "No market items yet."}{" "}
          <Link href={categoryFilter ? `/admin/market/items/new?categoryId=${categoryFilter}` : "/admin/market/items/new"} className="text-drd-primary hover:underline">
            Add one
          </Link>
        </p>
      )}
    </div>
  );
}
