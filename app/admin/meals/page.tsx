"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Meal = {
  id: string;
  name: string;
  description: string | null;
  calories: string | null;
  imageUrl: string;
  order: number;
  category: { id: string; label: string };
};

type Category = { id: string; label: string };

export default function AdminMealsPage() {
  const searchParams = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("categoryId") ?? "");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/meals").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ])
      .then(([m, c]) => {
        setMeals(m);
        setCategories(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = categoryFilter
    ? meals.filter((m) => m.category.id === categoryFilter)
    : meals;

  async function handleDelete(id: string) {
    if (!confirm("Delete this meal?")) return;
    const res = await fetch(`/api/admin/meals/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
    setMeals(meals.filter((m) => m.id !== id));
  }

  if (loading) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-drd-text mb-6">
        Meals
      </h1>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <Link
          href={`/admin/meals/new${categoryFilter ? `?categoryId=${categoryFilter}` : ""}`}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark"
        >
          Add Meal
        </Link>
      </div>

      <div className="space-y-4">
        {filtered.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={meal.imageUrl}
                alt={meal.name}
                fill
                className="object-cover"
                unoptimized={meal.imageUrl.startsWith("http")}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-drd-text">{meal.name}</h2>
              <p className="text-sm text-drd-muted">{meal.category.label}</p>
              {meal.calories && (
                <p className="text-xs text-drd-muted">{meal.calories}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/meals/${meal.id}`}
                className="rounded-lg border border-drd-primary px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/10"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(meal.id)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-drd-muted">No meals found.</p>
      )}
    </div>
  );
}
