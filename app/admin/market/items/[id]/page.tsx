"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";

type MarketItem = {
  id: string;
  categoryId: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  price: number | null;
  image: string;
  protein: number | null;
  carbs: number | null;
  calories: number | null;
  order: number;
  isActive: boolean;
  category: { id: string; nameEn: string; nameAr: string };
};

type MarketCategory = { id: string; nameEn: string; nameAr: string };

export default function AdminMarketItemEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<MarketItem | null>(null);
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const parseJson = async (r: Response) => {
      const text = await r.text();
      try { return text ? JSON.parse(text) : null; } catch { return null; }
    };
    Promise.all([
      fetch(`/api/admin/market/items/${id}`).then(parseJson),
      fetch("/api/admin/market/categories").then(async (r) => {
        const text = await r.text();
        try { return text ? JSON.parse(text) : []; } catch { return []; }
      }),
    ])
      .then(([i, c]) => {
        setItem(i);
        setCategories(Array.isArray(c) ? c : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !item) return;
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
        setItem({ ...item, image: url });
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
    if (!item) return;
    if (!item.nameEn.trim() || !item.nameAr.trim()) {
      toast.error("Name (English) and Name (Arabic) are required.");
      return;
    }
    if (!item.image?.trim()) {
      toast.error("Image is required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/market/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: item.categoryId,
          nameEn: item.nameEn.trim(),
          nameAr: item.nameAr.trim(),
          descriptionEn: item.descriptionEn?.trim() || null,
          descriptionAr: item.descriptionAr?.trim() || null,
          price: item.price != null ? item.price : null,
          image: item.image.trim(),
          protein: item.protein ?? null,
          carbs: item.carbs ?? null,
          calories: item.calories ?? null,
          isActive: item.isActive,
        }),
      });
      if (res.ok) {
        toast.success("Updated");
        router.push("/admin/market/items");
        return;
      }
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !item) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <AdminPageHeader
        title="Edit Market Item"
        backLabel="Market Items"
        backHref="/admin/market/items"
      />
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Category *</label>
          <select
            value={item.categoryId}
            onChange={(e) => setItem({ ...item, categoryId: e.target.value })}
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
            value={item.nameEn}
            onChange={(e) => setItem({ ...item, nameEn: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Name (Arabic) *</label>
          <input
            type="text"
            value={item.nameAr}
            onChange={(e) => setItem({ ...item, nameAr: e.target.value })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            placeholder="الاسم بالعربية"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (English)</label>
          <textarea
            value={item.descriptionEn ?? ""}
            onChange={(e) => setItem({ ...item, descriptionEn: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (Arabic)</label>
          <textarea
            value={item.descriptionAr ?? ""}
            onChange={(e) => setItem({ ...item, descriptionAr: e.target.value || null })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            placeholder="الوصف بالعربية"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Price (SYP)</label>
          <input
            type="number"
            min={0}
            value={item.price ?? ""}
            onChange={(e) => setItem({ ...item, price: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            placeholder="30000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Macros (optional)</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Protein</label>
              <input
                type="number"
                min={0}
                value={item.protein ?? ""}
                onChange={(e) => setItem({ ...item, protein: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Carbs</label>
              <input
                type="number"
                min={0}
                value={item.carbs ?? ""}
                onChange={(e) => setItem({ ...item, carbs: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Calories</label>
              <input
                type="number"
                min={0}
                value={item.calories ?? ""}
                onChange={(e) => setItem({ ...item, calories: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Image *</label>
          <div className="mb-3">
            <p className="text-xs text-drd-muted mb-1">Current image</p>
            <div className="relative w-full max-w-xs aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={item.image}
                alt={item.nameEn || "Item"}
                fill
                className="object-contain"
                unoptimized={item.image.startsWith("http")}
              />
            </div>
          </div>
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
            {uploading ? "Uploading..." : "Replace Image"}
          </button>
          {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.isActive}
              onChange={(e) => setItem({ ...item, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-drd-primary"
            />
            <span className="text-sm text-drd-text">Active</span>
          </label>
        </div>
        <LoadingButton
          type="submit"
          loading={saving}
          disabled={uploading}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          Save
        </LoadingButton>
      </form>
    </div>
  );
}
