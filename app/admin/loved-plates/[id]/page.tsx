"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";

type TagShape = { id?: string; labelEn: string; labelAr: string; tone: "green" | "orange" };

type LovedPlate = {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string | null;
  subtitleAr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  ingredientsEn: string | null;
  ingredientsAr: string | null;
  imageUrl: string;
  galleryUrls: string[];
  proteinG: number | null;
  carbsG: number | null;
  calories: number | null;
  isActive: boolean;
  sortOrder: number;
  tags: { id: string; labelEn: string; labelAr: string; tone: string }[];
};

export default function AdminLovedPlateEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [plate, setPlate] = useState<LovedPlate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [newTag, setNewTag] = useState<TagShape>({ labelEn: "", labelAr: "", tone: "green" });
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/admin/loved-plates/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setPlate({
          ...p,
          tags: p.tags?.map((t: { id: string; labelEn: string; labelAr: string; tone: string }) => ({
            id: t.id,
            labelEn: t.labelEn,
            labelAr: t.labelAr,
            tone: t.tone === "orange" ? "orange" : "green",
          })) ?? [],
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !plate) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "plates");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (res.ok && data.url) {
        setPlate({ ...plate, imageUrl: data.url });
        setUploadError("");
        toast.success("Upload complete");
      } else {
        const msg = data?.error ?? "Upload failed";
        setUploadError(msg);
        toast.error(msg);
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
    if (!plate) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/loved-plates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn: plate.titleEn,
          titleAr: plate.titleAr,
          subtitleEn: plate.subtitleEn || null,
          subtitleAr: plate.subtitleAr || null,
          descriptionEn: plate.descriptionEn || null,
          descriptionAr: plate.descriptionAr || null,
          ingredientsEn: plate.ingredientsEn || null,
          ingredientsAr: plate.ingredientsAr || null,
          imageUrl: plate.imageUrl,
          galleryUrls: plate.galleryUrls,
          proteinG: plate.proteinG ?? null,
          carbsG: plate.carbsG ?? null,
          calories: plate.calories ?? null,
          isActive: plate.isActive,
          sortOrder: plate.sortOrder,
          tags: plate.tags.map((t) => ({ labelEn: t.labelEn, labelAr: t.labelAr, tone: t.tone })),
        }),
      });
      if (res.ok) {
        toast.success("Updated");
        router.push("/admin/loved-plates");
        return;
      }
      throw new Error("Failed to update");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !plate) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <AdminPageHeader
        title="Edit Loved Plate"
        backLabel="Loved Plates"
        backHref="/admin/loved-plates"
      />
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Title (English) *</label>
          <input
            type="text"
            value={plate.titleEn}
            onChange={(e) => setPlate({ ...plate, titleEn: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Title (Arabic) *</label>
          <input
            type="text"
            value={plate.titleAr}
            onChange={(e) => setPlate({ ...plate, titleAr: e.target.value })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (English)</label>
          <input
            type="text"
            value={plate.subtitleEn ?? ""}
            onChange={(e) => setPlate({ ...plate, subtitleEn: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (Arabic)</label>
          <input
            type="text"
            value={plate.subtitleAr ?? ""}
            onChange={(e) => setPlate({ ...plate, subtitleAr: e.target.value || null })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (English)</label>
          <textarea
            value={plate.descriptionEn ?? ""}
            onChange={(e) => setPlate({ ...plate, descriptionEn: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Description (Arabic)</label>
          <textarea
            value={plate.descriptionAr ?? ""}
            onChange={(e) => setPlate({ ...plate, descriptionAr: e.target.value || null })}
            dir="rtl"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-right"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Ingredients (English)</label>
          <textarea
            value={plate.ingredientsEn ?? ""}
            onChange={(e) => setPlate({ ...plate, ingredientsEn: e.target.value || null })}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Ingredients (Arabic)</label>
          <textarea
            value={plate.ingredientsAr ?? ""}
            onChange={(e) => setPlate({ ...plate, ingredientsAr: e.target.value || null })}
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
                value={plate.proteinG ?? ""}
                onChange={(e) => setPlate({ ...plate, proteinG: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Carbs (g)</label>
              <input
                type="number"
                min={0}
                value={plate.carbsG ?? ""}
                onChange={(e) => setPlate({ ...plate, carbsG: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-xs text-drd-muted mb-0.5">Calories</label>
              <input
                type="number"
                min={0}
                value={plate.calories ?? ""}
                onChange={(e) => setPlate({ ...plate, calories: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Tags</label>
          <div className="space-y-2">
            {plate.tags.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-wrap">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tag.tone === "orange" ? "bg-drd-accent/20 text-drd-accent" : "bg-drd-primary/20 text-drd-primary"}`}>
                  {tag.labelEn}
                </span>
                <button
                  type="button"
                  onClick={() => setPlate({ ...plate, tags: plate.tags.filter((_, i) => i !== idx) })}
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
                  setPlate({ ...plate, tags: [...plate.tags, { ...newTag }] });
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
          {plate.imageUrl && (
            <div className="mb-3">
              <p className="text-xs text-drd-muted mb-1">Current image</p>
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={plate.imageUrl}
                  alt={plate.titleEn}
                  fill
                  className="object-contain"
                  unoptimized={plate.imageUrl.startsWith("http")}
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
            {uploading ? "Uploading..." : plate.imageUrl ? "Change Image" : "Upload Image"}
          </button>
          <input
            type="text"
            value={plate.imageUrl}
            onChange={(e) => setPlate({ ...plate, imageUrl: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text text-sm"
          />
          {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-drd-text mb-1">Gallery (optional, max 6)</label>
          {plate.galleryUrls.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const next = [...plate.galleryUrls];
                  next[idx] = e.target.value;
                  setPlate({ ...plate, galleryUrls: next });
                }}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-drd-text"
              />
              <button
                type="button"
                onClick={() => setPlate({ ...plate, galleryUrls: plate.galleryUrls.filter((_, i) => i !== idx) })}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          {plate.galleryUrls.length < 6 && (
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
                    setPlate({ ...plate, galleryUrls: [...plate.galleryUrls, galleryUrlInput.trim()] });
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
            checked={plate.isActive}
            onChange={(e) => setPlate({ ...plate, isActive: e.target.checked })}
            className="rounded border-slate-300"
          />
          <label htmlFor="isActive" className="text-sm text-drd-text">Active (show on landing)</label>
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
