"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  label: string;
  description: string | null;
  order: number;
  meals: { id: string }[];
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");

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
    if (!newLabel.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newLabel.trim(),
        description: newDesc.trim() || null,
        order: categories.length,
      }),
    });
    if (!res.ok) {
      alert("Failed to create category");
      return;
    }
    setNewLabel("");
    setNewDesc("");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? All meals in it will be deleted.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
    load();
  }

  if (loading) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Categories
      </h1>

      <form onSubmit={handleCreate} className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Category name"
          className="rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
        />
        <input
          type="text"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Description (optional)"
          className="rounded-lg border border-slate-200 px-4 py-2 text-drd-text min-w-[200px]"
        />
        <button
          type="submit"
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark"
        >
          Add Category
        </button>
      </form>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <h2 className="font-semibold text-drd-text">{cat.label}</h2>
              {cat.description && (
                <p className="text-sm text-drd-muted">{cat.description}</p>
              )}
              <span className="text-xs text-drd-muted">{cat.meals.length} meals</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/categories/${cat.id}`}
                className="rounded-lg border border-drd-primary px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/10"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
