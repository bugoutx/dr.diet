"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

type MealTagShape = { labelEn: string; labelAr: string; tone: "green" | "orange" };

type Category = { id: string; nameEn: string };

export default function AdminMealNewPage() {
  const { lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCat = searchParams.get("categoryId") ?? "";
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    categoryId: defaultCat,
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    proteinG: "" as string,
    carbsG: "" as string,
    calories: "" as string,
    price: "",
    tags: [] as MealTagShape[],
    imageUrl: "",
    link: "",
  });
  const [newTag, setNewTag] = useState<MealTagShape>({ labelEn: "", labelAr: "", tone: "green" });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((c) => {
        setCategories(c);
        if (defaultCat) {
          setForm((f) => (f.categoryId ? f : { ...f, categoryId: defaultCat }));
        }
      })
      .catch(console.error);
  }, [defaultCat]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", "meals");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error ?? `Upload failed (${res.status})`;
        setUploadError(msg);
        toast.error(msg);
        return;
      }
      const url = data?.url ?? data?.downloadUrl;
      if (url) {
        setForm((f) => ({ ...f, imageUrl: url }));
        setUploadError("");
        toast.success(tField(lang, "Upload complete", "تم الرفع"));
      } else {
        setUploadError(tField(lang, "Upload succeeded but no URL returned.", "تم الرفع لكن لم يُرجع رابط."));
        toast.error(tField(lang, "Upload succeeded but no URL returned.", "تم الرفع لكن لم يُرجع رابط."));
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
    const missing: string[] = [];
    if (!form.categoryId?.trim()) missing.push("Category");
    if (!form.nameEn.trim()) missing.push("Name (English)");
    if (!form.nameAr.trim()) missing.push("Name (Arabic)");
    if (!form.imageUrl?.trim()) missing.push("Image (upload a file or paste an image URL below)");
    if (missing.length > 0) {
      toast.error(tField(lang, "Required:", "مطلوب:") + " " + missing.join(", "));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: form.categoryId.trim(),
          nameEn: form.nameEn.trim(),
          nameAr: form.nameAr.trim(),
          descriptionEn: form.descriptionEn.trim() || null,
          descriptionAr: form.descriptionAr.trim() || null,
          proteinG: form.proteinG.trim() ? parseInt(form.proteinG, 10) : null,
          carbsG: form.carbsG.trim() ? parseInt(form.carbsG, 10) : null,
          calories: form.calories.trim() ? parseInt(form.calories, 10) : null,
          price: form.price.trim() || null,
          tags: form.tags,
          imageUrl: form.imageUrl.trim(),
          link: form.link.trim() || null,
        }),
      });
      if (res.ok) {
        toast.success(tField(lang, "Meal created", "تم إنشاء الوجبة"));
        router.push("/admin/meals");
        return;
      }
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Add Meal", "إضافة وجبة")}
        backLabel={tField(lang, "Meals", "الوجبات")}
        backHref="/admin/meals"
      />
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
              <option key={c.id} value={c.id}>{c.nameEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Name (English) *</label>
          <input
            type="text"
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Name (Arabic) *</label>
          <input
            type="text"
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            placeholder="الاسم بالعربية"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (English)</label>
          <textarea
            value={form.descriptionEn}
            onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (Arabic)</label>
          <textarea
            value={form.descriptionAr}
            onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
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
                value={form.proteinG}
                onChange={(e) => setForm({ ...form, proteinG: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Carbs (g)</label>
              <input
                type="number"
                min={0}
                value={form.carbsG}
                onChange={(e) => setForm({ ...form, carbsG: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Calories (cal)</label>
              <input
                type="number"
                min={0}
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
          </div>
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
          <label className="block text-sm font-medium text-drd-text mb-1">Tags</label>
          <div className="space-y-2">
            {form.tags.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-wrap">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tag.tone === "orange" ? "bg-drd-accent/20 text-drd-accent" : "bg-drd-primary/20 text-drd-primary"}`}>
                  {tag.labelEn}
                </span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tags: form.tags.filter((_, i) => i !== idx) })}
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
                  setForm({ ...form, tags: [...form.tags, { ...newTag }] });
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
          {form.imageUrl && (
            <div className="mb-3">
              <p className="text-xs text-drd-muted mb-1">Current image</p>
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={form.imageUrl}
                  alt={form.nameEn || "Meal"}
                  fill
                  className="object-contain"
                  unoptimized={form.imageUrl.startsWith("http")}
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
            {uploading ? tField(lang, "Uploading...", "جاري الرفع...") : form.imageUrl ? tField(lang, "Change Image", "استبدال الصورة") : tField(lang, "Upload Image", "رفع صورة")}
          </button>
          <span className="ml-2 text-sm text-drd-muted">{tField(lang, "or paste URL:", "أو الصق الرابط:")}</span>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-sm"
          />
          {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
          {form.imageUrl && <p className="mt-1 text-xs text-drd-muted truncate max-w-full break-all">{form.imageUrl}</p>}
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
        <LoadingButton
          type="submit"
          loading={saving}
          disabled={uploading}
          loadingLabel={tField(lang, "Creating…", "جاري الإنشاء…")}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          {tField(lang, "Create Meal", "إنشاء وجبة")}
        </LoadingButton>
      </form>
    </div>
  );
}
