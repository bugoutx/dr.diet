"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Category = { id: string; label: string };

export default function AdminMealNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCat = searchParams.get("categoryId") ?? "";
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    categoryId: defaultCat,
    name: "",
    description: "",
    calories: "",
    price: "",
    tags: "" as string,
    imageUrl: "",
    link: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((c) => {
        setCategories(c);
        if (defaultCat && !form.categoryId) setForm((f) => ({ ...f, categoryId: defaultCat }));
      })
      .catch(console.error);
  }, [defaultCat]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "meals");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    const data = await res.json();
    if (data.url) setForm((f) => ({ ...f, imageUrl: data.url }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.categoryId || !form.name.trim() || !form.imageUrl) {
      alert("Category, name, and image are required.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
        description: form.description || null,
        calories: form.calories || null,
        price: form.price || null,
        link: form.link || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/meals");
    } else {
      alert("Failed to create meal");
    }
  }

  return (
    <div>
      <Link href="/admin/meals" className="text-sm text-drd-primary hover:underline mb-4 inline-block">
        ← Back to Meals
      </Link>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Add Meal
      </h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Calories / Macros</label>
          <input
            type="text"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            placeholder="e.g. 35g protein · 473 cal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Price</label>
          <input
            type="text"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            placeholder="High Protein, Low Cal"
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
          {form.imageUrl && (
            <p className="mt-1 text-xs text-drd-muted truncate">{form.imageUrl}</p>
          )}
          {uploading && <p className="text-xs text-drd-muted">Uploading...</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Link (optional)</label>
          <input
            type="url"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          {saving ? "Creating..." : "Create Meal"}
        </button>
      </form>
    </div>
  );
}
