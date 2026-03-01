"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import InlineLoader from "@/components/admin/InlineLoader";

type LovedPlateTag = { id: string; labelEn: string; labelAr: string; tone: string; sortOrder: number };

type LovedPlate = {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string | null;
  subtitleAr: string | null;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  proteinG: number | null;
  carbsG: number | null;
  calories: number | null;
  tags: LovedPlateTag[];
};

export default function AdminLovedPlatesPage() {
  const [plates, setPlates] = useState<LovedPlate[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function fetchPlates() {
    fetch("/api/admin/loved-plates")
      .then((r) => r.json())
      .then(setPlates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPlates();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this plate?")) return;
    try {
      const res = await fetch(`/api/admin/loved-plates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPlates(plates.filter((p) => p.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function handleToggleActive(plate: LovedPlate) {
    const next = !plate.isActive;
    setPlates(plates.map((p) => (p.id === plate.id ? { ...p, isActive: next } : p)));
    setTogglingId(plate.id);
    try {
      const res = await fetch(`/api/admin/loved-plates/${plate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Updated");
    } catch {
      setPlates(plates.map((p) => (p.id === plate.id ? { ...p, isActive: !next } : p)));
      toast.error("Something went wrong");
    } finally {
      setTogglingId(null);
    }
  }

  async function movePlate(index: number, direction: "up" | "down") {
    const newPlates = [...plates];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newPlates.length || reordering) return;
    [newPlates[index], newPlates[target]] = [newPlates[target], newPlates[index]];
    const plateIds = newPlates.map((p) => p.id);
    setPlates(newPlates);
    setReordering(true);
    try {
      const res = await fetch("/api/admin/loved-plates/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plateIds }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
      toast.success("Order updated");
    } catch {
      setPlates(plates);
      toast.error("Something went wrong");
    } finally {
      setReordering(false);
    }
  }

  if (loading) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <AdminPageHeader
        title="Our Most Loved Plates"
        backLabel="Dashboard"
        backHref="/admin"
        showBack={false}
        actions={
          <Link
            href="/admin/loved-plates/new"
            className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark"
          >
            Add Plate
          </Link>
        }
      />
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-drd-muted">Drag order with ▲▼</span>
        {reordering && <InlineLoader label="Saving order…" />}
      </div>

      <div className="space-y-4">
        {plates.map((plate, index) => (
          <div
            key={plate.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => movePlate(index, "up")}
                disabled={reordering || index === 0}
                className="rounded p-1 text-drd-text/60 hover:bg-slate-100 disabled:opacity-30"
                aria-label="Move up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => movePlate(index, "down")}
                disabled={reordering || index === plates.length - 1}
                className="rounded p-1 text-drd-text/60 hover:bg-slate-100 disabled:opacity-30"
                aria-label="Move down"
              >
                ▼
              </button>
            </div>
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={plate.imageUrl}
                alt={plate.titleEn || plate.titleAr || "Plate"}
                fill
                className="object-cover"
                unoptimized={plate.imageUrl.startsWith("http")}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-drd-text">{plate.titleEn}</h2>
              <p className="text-sm text-drd-muted" dir="rtl">{plate.titleAr}</p>
              {(plate.proteinG != null || plate.carbsG != null || plate.calories != null) && (
                <p className="text-xs text-drd-muted">
                  {[plate.proteinG != null && `${plate.proteinG}g protein`, plate.carbsG != null && `${plate.carbsG}g carbs`, plate.calories != null && `${plate.calories} cal`].filter(Boolean).join(" · ")}
                </p>
              )}
              {plate.tags?.length ? (
                <p className="text-xs text-drd-muted">{plate.tags.map((t) => t.labelEn).join(", ")}</p>
              ) : null}
            </div>
            <label className="flex items-center gap-2">
              <span className="text-sm text-drd-muted">Active</span>
              <input
                type="checkbox"
                checked={plate.isActive}
                onChange={() => handleToggleActive(plate)}
                disabled={togglingId === plate.id}
                className="rounded border-slate-300"
              />
              {togglingId === plate.id && (
                <span className="text-slate-400">
                  <InlineLoader label="" />
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <Link
                href={`/admin/loved-plates/${plate.id}`}
                className="rounded-lg border border-drd-primary px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/10"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(plate.id)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {plates.length === 0 && (
        <p className="text-drd-muted">No loved plates yet. Add one to get started.</p>
      )}
    </div>
  );
}
