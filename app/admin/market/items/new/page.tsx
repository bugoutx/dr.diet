"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";

type MarketCategory = { id: string; nameEn: string; nameAr: string };

export default function AdminMarketItemNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCat = searchParams.get("categoryId") ?? "";
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [form, setForm] = useState({
    categoryId: defaultCat,
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    price: "",
    protein: "",
    carbs: "",
    calories: "",
    image: "",
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/market/categories")
      .then(async (r) => {
        const text = await r.text();
        try { return text ? JSON.parse(text) : []; } catch { return []; }
      })
      .then((c) => {
        setCategories(Array.isArray(c) ? c : []);
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
    setUploadError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", "market");
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
        setForm((f) => ({ ...f, image: url }));
        toast.success("Upload complete");
      } else {
        setUploadError("Upload succeeded but no URL returned.");
        toast.error("Upload succeeded but no URL returned.");
      }
    } catch {
      setUploadError("Upload failed");
      toast.error("Upload failed");
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
    if (!form.image?.trim()) missing.push("Image (upload a file)");
    if (missing.length > 0) {
      toast.error(`Required: ${missing.join(", ")}`);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/market/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: form.categoryId.trim(),
          nameEn: form.nameEn.trim(),
          nameAr: form.nameAr.trim(),
          descriptionEn: form.descriptionEn.trim() || null,
          descriptionAr: form.descriptionAr.trim() || null,
          price: form.price.trim() ? parseInt(form.price.replace(/,/g, ""), 10) : null,
          image: form.image.trim(),
          protein: form.protein.trim() ? parseInt(form.protein, 10) : null,
          carbs: form.carbs.trim() ? parseInt(form.carbs, 10) : null,
          calories: form.calories.trim() ? parseInt(form.calories, 10) : null,
          isActive: form.isActive,
        }),
      });
      if (res.ok) {
        toast.success("Item created");
        router.push("/admin/market/items");
        return;
      }
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Add Market Item"
        backLabel="Market Items"
        backHref="/admin/market/items"
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
          <label className="block text-sm font-medium text-drd-text mb-1">Price (SYP)</label>
          <p className="text-xs text-drd-muted mb-1">Numbers only, e.g. 30000</p>
          <input
            type="text"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            placeholder="30000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Macros (optional)</label>
          <p className="text-xs text-drd-muted mb-1">Numbers only — no &quot;g&quot;</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Protein</label>
              <input
                type="number"
                min={0}
                value={form.protein}
                onChange={(e) => setForm({ ...form, protein: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Carbs</label>
              <input
                type="number"
                min={0}
                value={form.carbs}
                onChange={(e) => setForm({ ...form, carbs: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Calories</label>
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
          <label className="block text-sm font-medium text-drd-text mb-1">Image *</label>
          {form.image && (
            <div className="mb-3">
              <p className="text-xs text-drd-muted mb-1">Current image</p>
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={form.image}
                  alt={form.nameEn || "Item"}
                  fill
                  className="object-contain"
                  unoptimized={form.image.startsWith("http")}
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
            {uploading ? "Uploading..." : form.image ? "Change Image" : "Upload Image"}
          </button>
          {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
          {form.image && <p className="mt-1 text-xs text-drd-muted truncate max-w-full break-all">{form.image}</p>}
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-drd-primary"
            />
            <span className="text-sm text-drd-text">Active</span>
          </label>
        </div>
        <LoadingButton
          type="submit"
          loading={saving}
          disabled={uploading}
          loadingLabel="Creating…"
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          Create Item
        </LoadingButton>
      </form>
    </div>
  );
}
