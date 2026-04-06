"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";
import InlineLoader from "@/components/admin/InlineLoader";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

type HeroData = {
  hero: {
    slogan: string;
    sloganAr?: string | null;
    title: string;
    titleAr?: string | null;
    description: string;
    descriptionAr?: string | null;
    ctaLabelEn?: string | null;
    ctaLabelAr?: string | null;
  };
  meals: Array<{
    id: string;
    title: string;
    titleAr?: string | null;
    subtitle: string | null;
    subtitleAr?: string | null;
    calories: number | null;
    protein: number | null;
    badge: string | null;
    badgeAr?: string | null;
    imageUrl: string | null;
    sortOrder: number;
  }>;
};

const MAX_MEALS = 3;

export default function AdminHeroPage() {
  const { lang } = useLang();
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroForm, setHeroForm] = useState({
    slogan: "",
    sloganAr: "",
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    ctaLabelEn: "",
    ctaLabelAr: "",
  });
  const [savingHero, setSavingHero] = useState(false);
  const [reorderPending, setReorderPending] = useState(false);
  const [savingMealEdit, setSavingMealEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    calories: string;
    protein: string;
    badge: string;
    badgeAr: string;
    imageUrl: string;
  }>({ title: "", titleAr: "", subtitle: "", subtitleAr: "", calories: "", protein: "", badge: "", badgeAr: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/admin/hero", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setHeroForm({
          slogan: res.hero?.slogan ?? "",
          sloganAr: res.hero?.sloganAr ?? "",
          title: res.hero?.title ?? "",
          titleAr: res.hero?.titleAr ?? "",
          description: res.hero?.description ?? "",
          descriptionAr: res.hero?.descriptionAr ?? "",
          ctaLabelEn: res.hero?.ctaLabelEn ?? "",
          ctaLabelAr: res.hero?.ctaLabelAr ?? "",
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
        body: JSON.stringify({
          slogan: heroForm.slogan || undefined,
          sloganAr: heroForm.sloganAr || undefined,
          title: heroForm.title || undefined,
          titleAr: heroForm.titleAr || undefined,
          description: heroForm.description || undefined,
          descriptionAr: heroForm.descriptionAr || undefined,
          ctaLabelEn: heroForm.ctaLabelEn || undefined,
          ctaLabelAr: heroForm.ctaLabelAr || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(tField(lang, "Saved", "تم الحفظ"));
      load();
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
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
          titleAr: "",
          subtitle: "",
          subtitleAr: "",
          calories: null,
          protein: null,
          badge: "Rotating signature meal",
          badgeAr: "طبق مميز",
          imageUrl: null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to create");
      }
      toast.success(tField(lang, "Meal added", "تمت إضافة الوجبة"));
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
    }
  }

  function startEdit(meal: { id: string; title: string; titleAr?: string | null; subtitle: string | null; subtitleAr?: string | null; calories: number | null; protein: number | null; badge: string | null; badgeAr?: string | null; imageUrl: string | null }) {
    setEditingId(meal.id);
    setEditForm({
      title: meal.title ?? "",
      titleAr: meal.titleAr ?? "",
      subtitle: meal.subtitle ?? "",
      subtitleAr: meal.subtitleAr ?? "",
      calories: meal.calories != null ? String(meal.calories) : "",
      protein: meal.protein != null ? String(meal.protein) : "",
      badge: meal.badge ?? "",
      badgeAr: meal.badgeAr ?? "",
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
          titleAr: editForm.titleAr.trim() || null,
          subtitle: editForm.subtitle.trim() || null,
          subtitleAr: editForm.subtitleAr.trim() || null,
          calories: editForm.calories.trim() ? parseInt(editForm.calories, 10) : null,
          protein: editForm.protein.trim() ? parseInt(editForm.protein, 10) : null,
          badge: editForm.badge.trim() || null,
          badgeAr: editForm.badgeAr.trim() || null,
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
    if (!confirm(tField(lang, "Delete this hero meal?", "حذف وجبة الهيرو؟"))) return;
    try {
      const res = await fetch(`/api/admin/hero/meals/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success(tField(lang, "Deleted", "تم الحذف"));
      if (editingId === id) setEditingId(null);
      load();
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
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
      toast.success(tField(lang, "Order updated", "تم تحديث الترتيب"));
    } catch {
      load();
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
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
        toast.error(json?.error ?? res.statusText ?? tField(lang, "Upload failed", "فشل الرفع"));
        return;
      }
      const url = json?.url ?? json?.downloadUrl;
      if (url) {
        setEditForm((f) => ({ ...f, imageUrl: url }));
        toast.success(tField(lang, "Upload complete", "تم الرفع"));
      } else toast.error(tField(lang, "Upload failed", "فشل الرفع"));
    } catch {
      toast.error(tField(lang, "Upload failed", "فشل الرفع"));
    } finally {
      setUploading(false);
    }
  }

  if (loading || !data) {
    return <div className="text-drd-muted">{tField(lang, "Loading...", "جاري التحميل...")}</div>;
  }

  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Hero Section", "قسم الهيرو")}
        backLabel={tField(lang, "Dashboard", "لوحة التحكم")}
        backHref="/admin"
      />

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-drd-text mb-4">{tField(lang, "Hero copy (EN / AR)", "نص الهيرو (إنجليزي / عربي)")}</h2>
        <form onSubmit={saveHero} className="max-w-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Slogan (EN)</label>
              <input
                type="text"
                value={heroForm.slogan}
                onChange={(e) => setHeroForm({ ...heroForm, slogan: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="Don't eat less, eat Right."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Slogan (AR)</label>
              <input
                type="text"
                value={heroForm.sloganAr}
                onChange={(e) => setHeroForm({ ...heroForm, sloganAr: e.target.value })}
                dir="rtl"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
                placeholder="لا تأكل أقل، كل صح."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Title (EN)</label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="HEALTHY FOOD, DONE RIGHT."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Title (AR)</label>
              <input
                type="text"
                value={heroForm.titleAr}
                onChange={(e) => setHeroForm({ ...heroForm, titleAr: e.target.value })}
                dir="rtl"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
                placeholder="طعام صحي، بشكل صحيح."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Description (EN)</label>
              <textarea
                value={heroForm.description}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                rows={4}
                placeholder="Dr.Diet is a healthy food restaurant..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Description (AR)</label>
              <textarea
                value={heroForm.descriptionAr}
                onChange={(e) => setHeroForm({ ...heroForm, descriptionAr: e.target.value })}
                dir="rtl"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
                rows={4}
                placeholder="د.دايت مطعم طعام صحي..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">CTA button (EN)</label>
              <input
                type="text"
                value={heroForm.ctaLabelEn}
                onChange={(e) => setHeroForm({ ...heroForm, ctaLabelEn: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="Order Now"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">CTA button (AR)</label>
              <input
                type="text"
                value={heroForm.ctaLabelAr}
                onChange={(e) => setHeroForm({ ...heroForm, ctaLabelAr: e.target.value })}
                dir="rtl"
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
                placeholder="اطلب الآن"
              />
            </div>
          </div>
          <LoadingButton
            type="submit"
            loading={savingHero}
            loadingLabel={tField(lang, "Saving…", "جاري الحفظ…")}
            className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
          >
            {tField(lang, "Save hero copy", "حفظ نص الهيرو")}
          </LoadingButton>
        </form>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-lg font-semibold text-drd-text">{tField(lang, "Hero meals (max 3)", "وجبات الهيرو (حد أقصى 3)")}</h2>
          {reorderPending && <InlineLoader label={tField(lang, "Saving order…", "جاري حفظ الترتيب…")} />}
        </div>
        <p className="text-sm text-drd-muted mb-4">
          {tField(lang, "These appear in the hero carousel. Set \"Order on Beeorder\" URL in Settings for the Order Now button.", "تظهر في سلسلة الهيرو. اضبط رابط \"بي أوردر\" في الإعدادات لزر اطلب الآن.")}{" "}
          <Link href="/admin/settings" className="text-drd-primary hover:underline">{tField(lang, "Settings", "الإعدادات")}</Link>.
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
                    aria-label={tField(lang, "Move up", "تحريك لأعلى")}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => reorder(false, index)}
                    disabled={reorderPending || index === data.meals.length - 1}
                    className="text-drd-muted hover:text-drd-primary disabled:opacity-40 p-0.5"
                    aria-label={tField(lang, "Move down", "تحريك لأسفل")}
                  >
                    ▼
                  </button>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-drd-text truncate">{meal.title}</p>
                  <p className="text-sm text-drd-muted truncate">{meal.subtitle || meal.subtitleAr || "—"}</p>
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
                  {tField(lang, "Edit", "تعديل")}
                </button>
                <button
                  type="button"
                  onClick={() => deleteMeal(meal.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  {tField(lang, "Delete", "حذف")}
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
          {data.meals.length >= MAX_MEALS ? tField(lang, "Already 3 meals", "3 وجبات بالفعل") : tField(lang, "Add hero meal", "إضافة وجبة هيرو")}
        </button>
      </section>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-drd-text mb-4">{tField(lang, "Edit hero meal", "تعديل وجبة الهيرو")}</h3>
            <form onSubmit={saveMealEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Name (EN) *</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Name (AR)</label>
                  <input
                    type="text"
                    value={editForm.titleAr}
                    onChange={(e) => setEditForm({ ...editForm, titleAr: e.target.value })}
                    dir="rtl"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
                    placeholder="الاسم بالعربية"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (EN)</label>
                  <input
                    type="text"
                    value={editForm.subtitle}
                    onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                    placeholder="e.g. Energy Dish"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (AR)</label>
                  <input
                    type="text"
                    value={editForm.subtitleAr}
                    onChange={(e) => setEditForm({ ...editForm, subtitleAr: e.target.value })}
                    dir="rtl"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
                    placeholder="نوع الطبق"
                  />
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Badge (EN)</label>
                  <input
                    type="text"
                    value={editForm.badge}
                    onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                    placeholder="e.g. Rotating signature meal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Badge (AR)</label>
                  <input
                    type="text"
                    value={editForm.badgeAr}
                    onChange={(e) => setEditForm({ ...editForm, badgeAr: e.target.value })}
                    dir="rtl"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
                    placeholder="طبق مميز"
                  />
                </div>
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
                {uploading && <p className="text-xs text-drd-muted">{tField(lang, "Uploading...", "جاري الرفع...")}</p>}
              </div>
              <div className="flex gap-2 pt-2">
                <LoadingButton
                  type="submit"
                  loading={savingMealEdit}
                  loadingLabel={tField(lang, "Saving…", "جاري الحفظ…")}
                  className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark"
                >
                  {tField(lang, "Save", "حفظ")}
                </LoadingButton>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-full border border-slate-200 px-6 py-2 text-drd-text hover:bg-slate-50"
                >
                  {tField(lang, "Cancel", "إلغاء")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
