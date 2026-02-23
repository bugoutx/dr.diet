"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Meal = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  calories: string | null;
  price: string | null;
  tags: string[];
  imageUrl: string;
  link: string | null;
};

type Category = { id: string; label: string };

export default function AdminMealEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [meal, setMeal] = useState<Meal | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/meals/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ])
      .then(([m, c]) => {
        setMeal(m);
        setCategories(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !meal) return;
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "meals");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    const data = await res.json();
    if (data.url) setMeal({ ...meal, imageUrl: data.url });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!meal) return;
    setSaving(true);
    const res = await fetch(`/api/admin/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: meal.categoryId,
        name: meal.name,
        description: meal.description || null,
        calories: meal.calories || null,
        price: meal.price || null,
        tags: meal.tags,
        imageUrl: meal.imageUrl,
        link: meal.link || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/meals");
    } else {
      alert("Failed to update");
    }
  }

  if (loading || !meal) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <Link href="/admin/meals" className="text-sm text-drd-primary hover:underline mb-4 inline-block">
        ← Back to Meals
      </Link>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Edit Meal
      </h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Category *</label>
          <select
            value={meal.categoryId}
            onChange={(e) => setMeal({ ...meal, categoryId: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Name *</label>
          <input
            type="text"
            value={meal.name}
            onChange={(e) => setMeal({ ...meal, name: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description</label>
          <textarea
            value={meal.description ?? ""}
            onChange={(e) => setMeal({ ...meal, description: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Calories / Macros</label>
          <input
            type="text"
            value={meal.calories ?? ""}
            onChange={(e) => setMeal({ ...meal, calories: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Price</label>
          <input
            type="text"
            value={meal.price ?? ""}
            onChange={(e) => setMeal({ ...meal, price: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={meal.tags.join(", ")}
            onChange={(e) =>
              setMeal({
                ...meal,
                tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-drd-text"
          />
          {meal.imageUrl && (
            <p className="mt-1 text-xs text-drd-muted truncate">{meal.imageUrl}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Link</label>
          <input
            type="url"
            value={meal.link ?? ""}
            onChange={(e) => setMeal({ ...meal, link: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
