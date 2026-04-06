"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

type MealTagShape = { id?: string; labelEn: string; labelAr: string; tone: "green" | "orange" };

type Meal = {
  id: string;
  categoryId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  proteinG: number | null;
  carbsG: number | null;
  calories: number | null;
  price: string | null;
  mealTags: MealTagShape[];
  imageUrl: string;
  link: string | null;
};

type Category = { id: string; nameEn: string };

export default function AdminMealEditPage() {
  const { lang } = useLang();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [meal, setMeal] = useState<Meal | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [newTag, setNewTag] = useState({ labelEn: "", labelAr: "", tone: "green" as "green" | "orange" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/meals/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ])
      .then(([m, c]) => {
        setMeal({
          ...m,
          mealTags: m.mealTags?.length ? m.mealTags.map((t: { id: string; labelEn: string; labelAr: string; tone: string }) => ({
            id: t.id,
            labelEn: t.labelEn,
            labelAr: t.labelAr,
            tone: t.tone === "orange" ? "orange" : "green",
          })) : [],
        });
        setCategories(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !meal) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "meals");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (res.ok && data.url) {
        setMeal({ ...meal, imageUrl: data.url });
        setUploadError("");
        toast.success(tField(lang, "Upload complete", "تم الرفع"));
      } else {
        const msg = data?.error ?? tField(lang, "Upload failed", "فشل الرفع");
        setUploadError(msg);
        toast.error(msg);
      }
    } catch {
      setUploadError(tField(lang, "Upload failed", "فشل الرفع"));
      toast.error(tField(lang, "Upload failed", "فشل الرفع"));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!meal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/meals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: meal.categoryId,
          nameEn: meal.nameEn,
          nameAr: meal.nameAr,
          descriptionEn: meal.descriptionEn || null,
          descriptionAr: meal.descriptionAr || null,
          proteinG: meal.proteinG ?? null,
          carbsG: meal.carbsG ?? null,
          calories: meal.calories ?? null,
          price: meal.price || null,
          tags: meal.mealTags.map((t) => ({ labelEn: t.labelEn, labelAr: t.labelAr, tone: t.tone })),
          imageUrl: meal.imageUrl,
          link: meal.link || null,
        }),
      });
      if (res.ok) {
        toast.success(tField(lang, "Updated", "تم التحديث"));
        router.push("/admin/meals");
      } else throw new Error("Failed to update");
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setSaving(false);
    }
  }

  if (loading || !meal) return <div className="text-drd-muted">{tField(lang, "Loading...", "جاري التحميل...")}</div>;

  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Edit Meal", "تعديل الوجبة")}
        backLabel={tField(lang, "Meals", "الوجبات")}
        backHref="/admin/meals"
      />
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
              <option key={c.id} value={c.id}>{c.nameEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Name (English) *</label>
          <input
            type="text"
            value={meal.nameEn}
            onChange={(e) => setMeal({ ...meal, nameEn: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Name (Arabic) *</label>
          <input
            type="text"
            value={meal.nameAr}
            onChange={(e) => setMeal({ ...meal, nameAr: e.target.value })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            placeholder="الاسم بالعربية"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (English)</label>
          <textarea
            value={meal.descriptionEn ?? ""}
            onChange={(e) => setMeal({ ...meal, descriptionEn: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (Arabic)</label>
          <textarea
            value={meal.descriptionAr ?? ""}
            onChange={(e) => setMeal({ ...meal, descriptionAr: e.target.value || null })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            placeholder="الوصف بالعربية"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Macros (optional)</label>
          <p className="text-xs text-drd-muted mb-1">Optional — leave empty if unknown</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Protein (g)</label>
              <input
                type="number"
                min={0}
                value={meal.proteinG ?? ""}
                onChange={(e) => setMeal({ ...meal, proteinG: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Carbs (g)</label>
              <input
                type="number"
                min={0}
                value={meal.carbsG ?? ""}
                onChange={(e) => setMeal({ ...meal, carbsG: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Calories (cal)</label>
              <input
                type="number"
                min={0}
                value={meal.calories ?? ""}
                onChange={(e) => setMeal({ ...meal, calories: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
          </div>
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
          <label className="block text-sm font-medium text-drd-text mb-1">Tags</label>
          <div className="space-y-2">
            {meal.mealTags.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-wrap">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tag.tone === "orange" ? "bg-drd-accent/20 text-drd-accent" : "bg-drd-primary/20 text-drd-primary"}`}>
                  {tag.labelEn}
                </span>
                <button
                  type="button"
                  onClick={() => setMeal({ ...meal, mealTags: meal.mealTags.filter((_, i) => i !== idx) })}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 items-end pt-2 border-t border-slate-100">
              <input
                type="text"
                value={newTag.labelEn}
                onChange={(e) => setNewTag({ ...newTag, labelEn: e.target.value })}
                placeholder="Label (EN)"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-drd-text w-32"
              />
              <input
                type="text"
                value={newTag.labelAr}
                onChange={(e) => setNewTag({ ...newTag, labelAr: e.target.value })}
                placeholder="التسمية (عربي)"
                dir="rtl"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-drd-text text-right w-32"
              />
              <select
                value={newTag.tone}
                onChange={(e) => setNewTag({ ...newTag, tone: e.target.value as "green" | "orange" })}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-drd-text"
              >
                <option value="green">Green</option>
                <option value="orange">Orange</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!newTag.labelEn.trim() || !newTag.labelAr.trim()) return;
                  setMeal({ ...meal, mealTags: [...meal.mealTags, { ...newTag }] });
                  setNewTag({ labelEn: "", labelAr: "", tone: "green" });
                }}
                className="rounded-lg bg-drd-primary/20 text-drd-primary px-3 py-1.5 text-sm font-medium hover:bg-drd-primary/30"
              >
                {tField(lang, "Add tag", "إضافة تسمية")}
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Image *</label>
          {meal.imageUrl && (
            <div className="mb-3">
              <p className="text-xs text-drd-muted mb-1">Current image</p>
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={meal.imageUrl}
                  alt={meal.nameEn}
                  fill
                  className="object-contain"
                  unoptimized={meal.imageUrl.startsWith("http")}
                />
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border-2 border-drd-primary bg-white text-drd-primary px-4 py-2 font-semibold hover:bg-drd-primary/5 disabled:opacity-50"
          >
            {uploading ? tField(lang, "Uploading...", "جاري الرفع...") : meal.imageUrl ? tField(lang, "Change Image", "استبدال الصورة") : tField(lang, "Upload Image", "رفع صورة")}
          </button>
          {uploading && <span className="ml-2 text-sm text-drd-muted">{tField(lang, "Uploading...", "جاري الرفع...")}</span>}
          {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
          {meal.imageUrl && <p className="mt-1 text-xs text-drd-muted truncate max-w-md">{meal.imageUrl}</p>}
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
        <LoadingButton
          type="submit"
          loading={saving}
          disabled={uploading}
          loadingLabel={tField(lang, "Saving…", "جاري الحفظ…")}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          {tField(lang, "Save", "حفظ")}
        </LoadingButton>
      </form>
    </div>
  );
}
