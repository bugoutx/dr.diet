"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

type Meal = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  proteinG: number | null;
  carbsG: number | null;
  calories: number | null;
  imageUrl: string;
  order: number;
  category: { id: string; nameEn: string };
  mealTags: { id: string; labelEn: string; labelAr: string; tone: string }[];
};

type Category = { id: string; nameEn: string };

export default function AdminMealsPage() {
  const { lang } = useLang();
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
    if (!confirm(tField(lang, "Delete this meal?", "حذف هذه الوجبة؟"))) return;
    try {
      const res = await fetch(`/api/admin/meals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMeals(meals.filter((m) => m.id !== id));
      toast.success(tField(lang, "Deleted", "تم الحذف"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    }
  }

  if (loading) return <div className="text-drd-muted">{tField(lang, "Loading...", "جاري التحميل...")}</div>;

  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Meals", "الوجبات")}
        backLabel={tField(lang, "Dashboard", "لوحة التحكم")}
        backHref="/admin"
        showBack={false}
        actions={
          <Link
            href={`/admin/meals/new${categoryFilter ? `?categoryId=${categoryFilter}` : ""}`}
            className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark"
          >
            {tField(lang, "Add Meal", "إضافة وجبة")}
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
        >
          <option value="">{tField(lang, "All categories", "جميع الفئات")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameEn}
            </option>
          ))}
        </select>
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
                alt={meal.nameEn || meal.nameAr || meal.id || "Meal"}
                fill
                className="object-cover"
                unoptimized={meal.imageUrl.startsWith("http")}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-drd-text">{meal.nameEn}</h2>
              <p className="text-sm text-drd-muted">{meal.category.nameEn}</p>
              {(meal.proteinG != null || meal.carbsG != null || meal.calories != null || (meal.mealTags?.length ?? 0) > 0) && (
                <p className="text-xs text-drd-muted">
                  {[meal.proteinG != null && `${meal.proteinG}g protein`, meal.carbsG != null && `${meal.carbsG}g carbs`, meal.calories != null && `${meal.calories} cal`].filter(Boolean).join(" · ")}
                  {meal.mealTags?.length ? ` · ${meal.mealTags.map((t) => t.labelEn).join(", ")}` : ""}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/meals/${meal.id}`}
                className="rounded-lg border border-drd-primary px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/10"
              >
                {tField(lang, "Edit", "تعديل")}
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(meal.id)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                {tField(lang, "Delete", "حذف")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-drd-muted">{tField(lang, "No meals found.", "لم يتم العثور على وجبات.")}</p>
      )}
    </div>
  );
}
