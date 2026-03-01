"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";

type TagShape = { labelEn: string; labelAr: string; tone: "green" | "orange" };

export default function AdminLovedPlateNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titleEn: "",
    titleAr: "",
    subtitleEn: "",
    subtitleAr: "",
    descriptionEn: "",
    descriptionAr: "",
    ingredientsEn: "",
    ingredientsAr: "",
    proteinG: "" as string,
    carbsG: "" as string,
    calories: "" as string,
    imageUrl: "",
    galleryUrls: [] as string[],
    isActive: true,
    tags: [] as TagShape[],
  });
  const [newTag, setNewTag] = useState<TagShape>({ labelEn: "", labelAr: "", tone: "green" });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "plates");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error ?? "Upload failed";
        setUploadError(msg);
        toast.error(msg);
        return;
      }
      const url = data?.url ?? data?.downloadUrl;
      if (url) {
        setForm((f) => ({ ...f, imageUrl: url }));
        setUploadError("");
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
    if (!form.titleEn.trim() || !form.titleAr.trim() || !form.imageUrl.trim()) {
      toast.error("Title (EN), Title (AR), and Image are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/loved-plates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn: form.titleEn.trim(),
          titleAr: form.titleAr.trim(),
          subtitleEn: form.subtitleEn.trim() || null,
          subtitleAr: form.subtitleAr.trim() || null,
          descriptionEn: form.descriptionEn.trim() || null,
          descriptionAr: form.descriptionAr.trim() || null,
          ingredientsEn: form.ingredientsEn.trim() || null,
          ingredientsAr: form.ingredientsAr.trim() || null,
          proteinG: form.proteinG.trim() ? parseInt(form.proteinG, 10) : null,
          carbsG: form.carbsG.trim() ? parseInt(form.carbsG, 10) : null,
          calories: form.calories.trim() ? parseInt(form.calories, 10) : null,
          imageUrl: form.imageUrl.trim(),
          galleryUrls: form.galleryUrls.length ? form.galleryUrls : undefined,
          isActive: form.isActive,
          tags: form.tags,
        }),
      });
      if (res.ok) {
        toast.success("Plate created");
        router.push("/admin/loved-plates");
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
        title="Add Loved Plate"
        backLabel="Loved Plates"
        backHref="/admin/loved-plates"
      />
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Title (English) *</label>
          <input
            type="text"
            value={form.titleEn}
            onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Title (Arabic) *</label>
          <input
            type="text"
            value={form.titleAr}
            onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            placeholder="العنوان بالعربية"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (English)</label>
          <input
            type="text"
            value={form.subtitleEn}
            onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (Arabic)</label>
          <input
            type="text"
            value={form.subtitleAr}
            onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
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
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Ingredients (English)</label>
          <textarea
            value={form.ingredientsEn}
            onChange={(e) => setForm({ ...form, ingredientsEn: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            placeholder="One per line or comma-separated"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Ingredients (Arabic)</label>
          <textarea
            value={form.ingredientsAr}
            onChange={(e) => setForm({ ...form, ingredientsAr: e.target.value })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Macros (optional)</label>
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
                Add tag
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Main image *</label>
          {form.imageUrl && (
            <div className="mb-3">
              <p className="text-xs text-drd-muted mb-1">Current image</p>
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={form.imageUrl}
                  alt={form.titleEn || "Plate"}
                  fill
                  className="object-contain"
                  unoptimized={form.imageUrl.startsWith("http")}
                />
              </div>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border-2 border-drd-primary bg-white text-drd-primary px-4 py-2 font-semibold hover:bg-drd-primary/5 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : form.imageUrl ? "Change Image" : "Upload Image"}
          </button>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="Or paste image URL"
            className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-sm"
          />
          {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Gallery (optional, max 6)</label>
          {form.galleryUrls.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const next = [...form.galleryUrls];
                  next[idx] = e.target.value;
                  setForm({ ...form, galleryUrls: next });
                }}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-drd-text"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, galleryUrls: form.galleryUrls.filter((_, i) => i !== idx) })}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          {form.galleryUrls.length < 6 && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                placeholder="Paste gallery image URL"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-drd-text"
              />
              <button
                type="button"
                onClick={() => {
                  if (galleryUrlInput.trim()) {
                    setForm({ ...form, galleryUrls: [...form.galleryUrls, galleryUrlInput.trim()] });
                    setGalleryUrlInput("");
                  }
                }}
                className="rounded-lg bg-slate-100 text-drd-text px-3 py-1.5 text-sm"
              >
                Add
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded border-slate-300"
          />
          <label htmlFor="isActive" className="text-sm text-drd-text">Active (show on landing)</label>
        </div>
        <LoadingButton
          type="submit"
          loading={saving}
          disabled={uploading}
          loadingLabel="Creating…"
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          Create Plate
        </LoadingButton>
      </form>
    </div>
  );
}
