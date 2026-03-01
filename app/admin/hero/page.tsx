"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";
import InlineLoader from "@/components/admin/InlineLoader";

type HeroData = {
  hero: { slogan: string; title: string; description: string };
  meals: Array<{
    id: string;
    name: string;
    subtitle: string;
    calories: number | null;
    protein: number | null;
    badge: string | null;
    imageUrl: string | null;
    sortOrder: number;
  }>;
};

type HeroMealRow = {
  id: string;
  title: string;
  subtitle: string | null;
  calories: number | null;
  protein: number | null;
  badge: string | null;
  imageUrl: string | null;
  sortOrder: number;
};

const MAX_MEALS = 3;

export default function AdminHeroPage() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroForm, setHeroForm] = useState({ slogan: "", title: "", description: "" });
  const [savingHero, setSavingHero] = useState(false);
  const [reorderPending, setReorderPending] = useState(false);
  const [savingMealEdit, setSavingMealEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    subtitle: string;
    calories: string;
    protein: string;
    badge: string;
    imageUrl: string;
  }>({ title: "", subtitle: "", calories: "", protein: "", badge: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/admin/hero", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setHeroForm({
          slogan: res.hero?.slogan ?? "",
          title: res.hero?.title ?? "",
          description: res.hero?.description ?? "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function saveHero(e: React.FormEvent) {
    e.preventDefault();
    setSavingHero(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(heroForm),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Saved");
      load();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSavingHero(false);
    }
  }

  async function createMeal() {
    if (!data || data.meals.length >= MAX_MEALS) return;
    try {
      const res = await fetch("/api/admin/hero/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: "New Hero Meal",
          subtitle: "",
          calories: null,
          protein: null,
          badge: "Rotating signature meal",
          imageUrl: null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to create");
      }
      toast.success("Meal added");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  function startEdit(meal: { id: string; name: string; subtitle: string; calories: number | null; protein: number | null; badge: string | null; imageUrl: string | null }) {
    setEditingId(meal.id);
    setEditForm({
      title: meal.name,
      subtitle: meal.subtitle ?? "",
      calories: meal.calories != null ? String(meal.calories) : "",
      protein: meal.protein != null ? String(meal.protein) : "",
      badge: meal.badge ?? "",
      imageUrl: meal.imageUrl ?? "",
    });
  }

  async function saveMealEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSavingMealEdit(true);
    try {
      const res = await fetch(`/api/admin/hero/meals/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editForm.title.trim() || "Untitled",
          subtitle: editForm.subtitle.trim() || null,
          calories: editForm.calories.trim() ? parseInt(editForm.calories, 10) : null,
          protein: editForm.protein.trim() ? parseInt(editForm.protein, 10) : null,
          badge: editForm.badge.trim() || null,
          imageUrl: editForm.imageUrl.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditingId(null);
      toast.success("Updated");
      load();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSavingMealEdit(false);
    }
  }

  async function deleteMeal(id: string) {
    if (!confirm("Delete this hero meal?")) return;
    try {
      const res = await fetch(`/api/admin/hero/meals/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Deleted");
      if (editingId === id) setEditingId(null);
      load();
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function reorder(moveUp: boolean, index: number) {
    if (!data || data.meals.length < 2 || reorderPending) return;
    const meals = [...data.meals];
    const target = moveUp ? index - 1 : index + 1;
    if (target < 0 || target >= meals.length) return;
    [meals[index], meals[target]] = [meals[target], meals[index]];
    const ids = meals.map((m) => m.id);
    setData((d) => (d ? { ...d, meals } : null));
    setReorderPending(true);
    try {
      const res = await fetch("/api/admin/hero/meals/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
      toast.success("Order updated");
    } catch {
      load();
      toast.error("Something went wrong");
    } finally {
      setReorderPending(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", "hero");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json?.error ?? res.statusText ?? "Upload failed");
        return;
      }
      const url = json?.url ?? json?.downloadUrl;
      if (url) {
        setEditForm((f) => ({ ...f, imageUrl: url }));
        toast.success("Upload complete");
      } else toast.error("Upload failed");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (loading || !data) {
    return <div className="text-drd-muted">Loading...</div>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Hero Section"
        backLabel="Dashboard"
        backHref="/admin"
      />

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-drd-text mb-4">Hero copy</h2>
        <form onSubmit={saveHero} className="max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-drd-text mb-1">Slogan</label>
            <input
              type="text"
              value={heroForm.slogan}
              onChange={(e) => setHeroForm({ ...heroForm, slogan: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="Don't eat less, eat Right."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-drd-text mb-1">Title</label>
            <input
              type="text"
              value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="HEALTHY FOOD, DONE RIGHT."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-drd-text mb-1">Description</label>
            <textarea
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              rows={4}
              placeholder="Dr.Diet is a healthy food restaurant..."
            />
          </div>
          <LoadingButton
            type="submit"
            loading={savingHero}
            loadingLabel="Saving…"
            className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
          >
            Save hero copy
          </LoadingButton>
        </form>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-lg font-semibold text-drd-text">Hero meals (max {MAX_MEALS})</h2>
          {reorderPending && <InlineLoader label="Saving order…" />}
        </div>
        <p className="text-sm text-drd-muted mb-4">
          These appear in the hero carousel. Set &quot;Order on Beeorder&quot; URL in{" "}
          <Link href="/admin/settings" className="text-drd-primary hover:underline">Settings</Link> for the Order Now button.
        </p>

        <div className="space-y-4 max-w-2xl">
          {data.meals.map((meal, index) => (
            <div
              key={meal.id}
              className="rounded-lg border border-slate-200 bg-white p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => reorder(true, index)}
                    disabled={reorderPending || index === 0}
                    className="text-drd-muted hover:text-drd-primary disabled:opacity-40 p-0.5"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => reorder(false, index)}
                    disabled={reorderPending || index === data.meals.length - 1}
                    className="text-drd-muted hover:text-drd-primary disabled:opacity-40 p-0.5"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-drd-text truncate">{meal.name}</p>
                  <p className="text-sm text-drd-muted truncate">{meal.subtitle || "—"}</p>
                  {(meal.calories != null || meal.protein != null) && (
                    <p className="text-xs text-drd-muted">
                      {[meal.protein != null && `${meal.protein}g protein`, meal.calories != null && `${meal.calories} cal`].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(meal)}
                  className="text-sm text-drd-primary hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMeal(meal.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={createMeal}
          disabled={data.meals.length >= MAX_MEALS}
          className="mt-4 rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {data.meals.length >= MAX_MEALS ? `Already ${MAX_MEALS} meals` : "Add hero meal"}
        </button>
      </section>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-drd-text mb-4">Edit hero meal</h3>
            <form onSubmit={saveMealEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">Name *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editForm.subtitle}
                  onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                  placeholder="e.g. Grilled chicken with sautéed vegetables…"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Calories</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.calories}
                    onChange={(e) => setEditForm({ ...editForm, calories: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.protein}
                    onChange={(e) => setEditForm({ ...editForm, protein: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">Badge</label>
                <input
                  type="text"
                  value={editForm.badge}
                  onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                  placeholder="e.g. Rotating signature meal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-drd-text"
                />
                <input
                  type="url"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                  placeholder="Paste image URL or upload above"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-sm"
                />
                {uploading && <p className="text-xs text-drd-muted">Uploading...</p>}
              </div>
              <div className="flex gap-2 pt-2">
                <LoadingButton
                  type="submit"
                  loading={savingMealEdit}
                  className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark"
                >
                  Save
                </LoadingButton>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-full border border-slate-200 px-6 py-2 text-drd-text hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
