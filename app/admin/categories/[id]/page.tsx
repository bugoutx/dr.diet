"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: string;
  label: string;
  description: string | null;
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
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: cat.label,
        description: cat.description ?? null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/categories");
    } else {
      alert("Failed to update");
    }
  }

  if (loading || !cat) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <Link href="/admin/categories" className="text-sm text-drd-primary hover:underline mb-4 inline-block">
        ← Back to Categories
      </Link>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Edit Category
      </h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Label</label>
          <input
            type="text"
            value={cat.label}
            onChange={(e) => setCat({ ...cat, label: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description</label>
          <textarea
            value={cat.description ?? ""}
            onChange={(e) => setCat({ ...cat, description: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            rows={3}
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
