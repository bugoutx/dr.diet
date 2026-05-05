"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import InlineLoader from "@/components/admin/InlineLoader";
import { formatNumber } from "@/lib/formatNumber";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

type SubscriptionPlan = {
  id: string;
  order: number;
  isActive: boolean;
  isPopular: boolean;
  titleEn: string;
  titleAr: string;
  subtitleEn: string | null;
  subtitleAr: string | null;
  featuresEn: string[];
  featuresAr: string[];
  weeklyPrice: number | null;
  monthlyPrice: number | null;
  pdfUrl: string | null;
  pdfFileName: string | null;
  subscribeUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

function parseFeatures(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? x : String(x)));
  return [];
}

export default function AdminPlansPage() {
  const { lang } = useLang();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formTitleEn, setFormTitleEn] = useState("");
  const [formTitleAr, setFormTitleAr] = useState("");
  const [formSubtitleEn, setFormSubtitleEn] = useState("");
  const [formSubtitleAr, setFormSubtitleAr] = useState("");
  const [formWeeklyPrice, setFormWeeklyPrice] = useState<string>("");
  const [formMonthlyPrice, setFormMonthlyPrice] = useState<string>("");
  const [formFeaturesEn, setFormFeaturesEn] = useState<string[]>([""]);
  const [formFeaturesAr, setFormFeaturesAr] = useState<string[]>([""]);
  const [formPopular, setFormPopular] = useState(false);
  const [formActive, setFormActive] = useState(true);
  const [formPdfUrl, setFormPdfUrl] = useState("");
  const [formPdfFileName, setFormPdfFileName] = useState("");
  const [formSubscribeUrl, setFormSubscribeUrl] = useState("");
  const [pdfUploading, setPdfUploading] = useState(false);
  const planPdfInputRef = useRef<HTMLInputElement>(null);

  function fetchPlans() {
    fetch("/api/admin/subscription-plans", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlans(
            data.map((p: SubscriptionPlan & { featuresEn: unknown; featuresAr: unknown }) => ({
              ...p,
              pdfUrl: p.pdfUrl ?? null,
              pdfFileName: p.pdfFileName ?? null,
              subscribeUrl: p.subscribeUrl ?? null,
              featuresEn: parseFeatures(p.featuresEn),
              featuresAr: parseFeatures(p.featuresAr),
            }))
          );
        } else setPlans([]);
      })
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPlans();
  }, []);

  function openAdd() {
    setEditingId(null);
    setFormTitleEn("");
    setFormTitleAr("");
    setFormSubtitleEn("");
    setFormSubtitleAr("");
    setFormWeeklyPrice("");
    setFormMonthlyPrice("");
    setFormFeaturesEn([""]);
    setFormFeaturesAr([""]);
    setFormPopular(false);
    setFormActive(true);
    setFormPdfUrl("");
    setFormPdfFileName("");
    setFormSubscribeUrl("");
    setModalOpen("add");
  }

  function openEdit(p: SubscriptionPlan) {
    setEditingId(p.id);
    setFormTitleEn(p.titleEn);
    setFormTitleAr(p.titleAr);
    setFormSubtitleEn(p.subtitleEn ?? "");
    setFormSubtitleAr(p.subtitleAr ?? "");
    setFormWeeklyPrice(p.weeklyPrice != null ? String(p.weeklyPrice) : "");
    setFormMonthlyPrice(p.monthlyPrice != null ? String(p.monthlyPrice) : "");
    setFormFeaturesEn(p.featuresEn.length ? p.featuresEn : [""]);
    setFormFeaturesAr(p.featuresAr.length ? p.featuresAr : [""]);
    setFormPopular(p.isPopular);
    setFormActive(p.isActive);
    setFormPdfUrl(p.pdfUrl ?? "");
    setFormPdfFileName(p.pdfFileName ?? "");
    setFormSubscribeUrl(p.subscribeUrl ?? "");
    setModalOpen("edit");
  }

  function closeModal() {
    setModalOpen(null);
    setEditingId(null);
  }

  function addFeatureRow(lang: "en" | "ar") {
    if (lang === "en") setFormFeaturesEn((prev) => [...prev, ""]);
    else setFormFeaturesAr((prev) => [...prev, ""]);
  }

  function removeFeatureRow(lang: "en" | "ar", index: number) {
    if (lang === "en") setFormFeaturesEn((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [""]));
    else setFormFeaturesAr((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [""]));
  }

  function setFeatureValue(lang: "en" | "ar", index: number, value: string) {
    if (lang === "en") setFormFeaturesEn((prev) => prev.map((v, i) => (i === index ? value : v)));
    else setFormFeaturesAr((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  const weeklyNum = formWeeklyPrice.trim() === "" ? null : parseInt(formWeeklyPrice.replace(/,/g, ""), 10);
  const monthlyNum = formMonthlyPrice.trim() === "" ? null : parseInt(formMonthlyPrice.replace(/,/g, ""), 10);
  const hasPrice = (weeklyNum != null && !Number.isNaN(weeklyNum)) || (monthlyNum != null && !Number.isNaN(monthlyNum));

  async function handlePlanPdfFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error(tField(lang, "Please select a PDF file only.", "يرجى اختيار ملف PDF فقط."));
      return;
    }
    setPdfUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "subscription-plans");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");
      setFormPdfUrl(data.url ?? "");
      setFormPdfFileName(file.name);
      toast.success(tField(lang, "PDF uploaded.", "تم رفع ملف PDF."));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tField(lang, "Upload failed.", "فشل الرفع."));
    } finally {
      setPdfUploading(false);
    }
  }

  async function handlePlanPdfDelete() {
    if (!formPdfUrl && !formPdfFileName) return;
    if (!editingId) {
      setFormPdfUrl("");
      setFormPdfFileName("");
      return;
    }
    setPdfUploading(true);
    try {
      const res = await fetch(`/api/admin/subscription-plans/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pdfUrl: null, pdfFileName: null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Failed to remove PDF");
      setFormPdfUrl("");
      setFormPdfFileName("");
      setPlans((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, pdfUrl: null, pdfFileName: null } : p))
      );
      toast.success(tField(lang, "PDF removed.", "تم حذف الملف."));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setPdfUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const titleEn = formTitleEn.trim();
    const titleAr = formTitleAr.trim();
    if (!titleEn || !titleAr) {
      toast.error(tField(lang, "Title (EN and AR) is required", "العنوان (إنجليزي وعربي) مطلوب"));
      return;
    }
    if (!hasPrice) {
      toast.error(tField(lang, "At least one of Weekly or Monthly price must be set", "يجب تحديد السعر الأسبوعي أو الشهري على الأقل"));
      return;
    }
    const subscribeUrlTrimmed = formSubscribeUrl.trim();
    if (subscribeUrlTrimmed) {
      try {
        new URL(subscribeUrlTrimmed);
      } catch {
        toast.error(tField(lang, "Subscribe link must be a valid URL", "يجب أن يكون رابط الاشتراك صالحاً"));
        return;
      }
    }
    const payload = {
      titleEn,
      titleAr,
      subtitleEn: formSubtitleEn.trim() || null,
      subtitleAr: formSubtitleAr.trim() || null,
      weeklyPrice: weeklyNum != null && !Number.isNaN(weeklyNum) ? weeklyNum : null,
      monthlyPrice: monthlyNum != null && !Number.isNaN(monthlyNum) ? monthlyNum : null,
      featuresEn: formFeaturesEn.map((s) => s.trim()).filter(Boolean),
      featuresAr: formFeaturesAr.map((s) => s.trim()).filter(Boolean),
      isPopular: formPopular,
      isActive: formActive,
      pdfUrl: formPdfUrl.trim() || null,
      pdfFileName: formPdfFileName.trim() || null,
      subscribeUrl: subscribeUrlTrimmed || null,
    };
    setSavingId(editingId ?? "new");
    try {
      if (modalOpen === "add") {
        const res = await fetch("/api/admin/subscription-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data?.error?.formErrors?.[0] ?? data?.error?.fieldErrors?.titleEn?.[0] ?? data?.error ?? "Failed to create";
          throw new Error(msg);
        }
        setPlans((prev) =>
          [
            ...prev,
            {
              ...data,
              pdfUrl: data.pdfUrl ?? null,
              pdfFileName: data.pdfFileName ?? null,
              subscribeUrl: data.subscribeUrl ?? null,
              featuresEn: parseFeatures(data.featuresEn),
              featuresAr: parseFeatures(data.featuresAr),
            },
          ].sort((a, b) => a.order - b.order)
        );
        toast.success(tField(lang, "Plan added", "تمت إضافة الخطة"));
      } else {
        if (!editingId) return;
        const res = await fetch(`/api/admin/subscription-plans/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data?.error?.formErrors?.[0] ?? data?.error ?? "Failed to update";
          throw new Error(msg);
        }
        setPlans((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  ...data,
                  pdfUrl: data.pdfUrl ?? null,
                  pdfFileName: data.pdfFileName ?? null,
                  subscribeUrl: data.subscribeUrl ?? null,
                  featuresEn: parseFeatures(data.featuresEn),
                  featuresAr: parseFeatures(data.featuresAr),
                }
              : p
          )
        );
        toast.success(tField(lang, "Updated", "تم التحديث"));
      }
      closeModal();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeleteConfirmId(null);
    try {
      const res = await fetch(`/api/admin/subscription-plans/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      setPlans((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) closeModal();
      toast.success(tField(lang, "Deleted", "تم الحذف"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    }
  }

  async function handleToggleActive(p: SubscriptionPlan) {
    const next = !p.isActive;
    setPlans((prev) => prev.map((x) => (x.id === p.id ? { ...x, isActive: next } : x)));
    setTogglingId(p.id);
    try {
      const res = await fetch(`/api/admin/subscription-plans/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Failed to update");
      }
      toast.success(tField(lang, "Updated", "تم التحديث"));
    } catch (e) {
      setPlans((prev) => prev.map((x) => (x.id === p.id ? { ...x, isActive: !next } : x)));
      toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setTogglingId(null);
    }
  }

  async function handleTogglePopular(p: SubscriptionPlan) {
    const next = !p.isPopular;
    setPlans((prev) => prev.map((x) => (x.id === p.id ? { ...x, isPopular: next } : x)));
    setTogglingId(p.id);
    try {
      const res = await fetch(`/api/admin/subscription-plans/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isPopular: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Failed to update");
      }
      toast.success(tField(lang, "Updated", "تم التحديث"));
    } catch (e) {
      setPlans((prev) => prev.map((x) => (x.id === p.id ? { ...x, isPopular: !next } : x)));
      toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setTogglingId(null);
    }
  }

  function movePlan(index: number, direction: "up" | "down") {
    const newList = [...plans];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newList.length || reordering) return;
    [newList[index], newList[target]] = [newList[target], newList[index]];
    const ids = newList.map((x) => x.id);
    setPlans(newList);
    setReordering(true);
    fetch("/api/admin/subscription-plans/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ids }),
    })
      .then((res) => {
        if (res.ok) toast.success(tField(lang, "Order updated", "تم تحديث الترتيب"));
        else return res.json().then((d) => { throw new Error(d?.error ?? "Failed to reorder"); });
      })
      .catch((e) => {
        setPlans(plans);
        toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
      })
      .finally(() => setReordering(false));
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader title={tField(lang, "Subscription Plans", "خطط الاشتراك")} backLabel={tField(lang, "Dashboard", "لوحة التحكم")} backHref="/admin" showBack={false} />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Subscription Plans", "خطط الاشتراك")}
        backLabel={tField(lang, "Dashboard", "لوحة التحكم")}
        backHref="/admin"
        showBack={false}
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="rounded-full bg-drd-primary px-5 py-2 font-semibold text-white hover:bg-drd-primary-dark"
          >
            {tField(lang, "Add Plan", "إضافة خطة")}
          </button>
        }
      />
      <p className="text-drd-muted mb-6">
        {tField(lang, "Manage subscription plans. Only active plans appear on the landing page. Use ▲▼ to reorder.", "إدارة خطط الاشتراك. تظهر الخطط النشطة فقط على الصفحة الرئيسية. استخدم ▲▼ لإعادة الترتيب.")}
      </p>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-drd-muted">{tField(lang, "Use ▲▼ to reorder", "استخدم ▲▼ لإعادة الترتيب")}</span>
        {reordering && <InlineLoader label={tField(lang, "Saving order…", "جاري حفظ الترتيب…")} />}
      </div>
      <div className="space-y-4">
        {plans.map((p, index) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => movePlan(index, "up")}
                disabled={reordering || index === 0}
                className="rounded p-1 text-drd-text/60 hover:bg-slate-100 disabled:opacity-30"
                aria-label={tField(lang, "Move up", "تحريك لأعلى")}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => movePlan(index, "down")}
                disabled={reordering || index === plans.length - 1}
                className="rounded p-1 text-drd-text/60 hover:bg-slate-100 disabled:opacity-30"
                aria-label={tField(lang, "Move down", "تحريك لأسفل")}
              >
                ▼
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-drd-text">{p.titleEn}</p>
              <p className="text-sm text-drd-muted">{p.subtitleEn || "—"}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {p.weeklyPrice != null && (
                  <span className="text-xs text-drd-text/70">{formatNumber(p.weeklyPrice)} SYP/week</span>
                )}
                {p.monthlyPrice != null && (
                  <span className="text-xs text-drd-text/70">{formatNumber(p.monthlyPrice)} SYP/month</span>
                )}
              </div>
            </div>
            {p.isPopular && (
              <span className="rounded-full bg-drd-primary/20 px-2 py-0.5 text-xs font-medium text-drd-primary">
                {tField(lang, "Popular", "الأكثر شعبية")}
              </span>
            )}
            {p.pdfUrl && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-drd-text/80 border border-slate-200">
                PDF
              </span>
            )}
            <label className="flex items-center gap-2">
              <span className="text-sm text-drd-muted">{tField(lang, "Active", "مفعل")}</span>
              <input
                type="checkbox"
                checked={p.isActive}
                onChange={() => handleToggleActive(p)}
                disabled={togglingId === p.id}
                className="rounded border-slate-300"
              />
              {togglingId === p.id && <InlineLoader label="" />}
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm text-drd-muted">{tField(lang, "Popular", "الأكثر شعبية")}</span>
              <input
                type="checkbox"
                checked={p.isPopular}
                onChange={() => handleTogglePopular(p)}
                disabled={togglingId === p.id}
                className="rounded border-slate-300"
              />
            </label>
            <button type="button" onClick={() => openEdit(p)} className="text-sm text-drd-primary hover:underline">
              {tField(lang, "Edit", "تعديل")}
            </button>
            <button
              type="button"
              onClick={() => setDeleteConfirmId(p.id)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              {tField(lang, "Delete", "حذف")}
            </button>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <p className="text-drd-muted">{tField(lang, "No plans yet. Click \"Add Plan\" to create one.", "لا توجد خطط بعد. انقر \"إضافة خطة\" لإنشاء واحدة.")}</p>
      )}

      {/* Delete confirm modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-drd-text mb-2">{tField(lang, "Delete plan?", "حذف الخطة؟")}</h3>
            <p className="text-drd-muted text-sm mb-4">{tField(lang, "This cannot be undone.", "لا يمكن التراجع عن هذا.")}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                {tField(lang, "Delete", "حذف")}
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-drd-text hover:bg-slate-50"
              >
                {tField(lang, "Cancel", "إلغاء")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-drd-text mb-4">
              {modalOpen === "add" ? tField(lang, "Add Plan", "إضافة خطة") : tField(lang, "Edit Plan", "تعديل الخطة")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Title (EN) *</label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Full Plan"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Title (AR) *</label>
                  <input
                    type="text"
                    value={formTitleAr}
                    onChange={(e) => setFormTitleAr(e.target.value)}
                    placeholder="الخطة الكاملة"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    dir="rtl"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (EN)</label>
                  <input
                    type="text"
                    value={formSubtitleEn}
                    onChange={(e) => setFormSubtitleEn(e.target.value)}
                    placeholder="Breakfast, Lunch + Snack"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Subtitle (AR)</label>
                  <input
                    type="text"
                    value={formSubtitleAr}
                    onChange={(e) => setFormSubtitleAr(e.target.value)}
                    placeholder="فطور، غداء + وجبة خفيفة"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Weekly price (SYP)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formWeeklyPrice}
                    onChange={(e) => setFormWeeklyPrice(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 625000"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                  {weeklyNum != null && !Number.isNaN(weeklyNum) && (
                    <p className="mt-1 text-xs text-drd-muted">
                      Preview: {formatNumber(weeklyNum)} SYP
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-drd-text mb-1">Monthly price (SYP)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formMonthlyPrice}
                    onChange={(e) => setFormMonthlyPrice(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 3000000"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  />
                  {monthlyNum != null && !Number.isNaN(monthlyNum) && (
                    <p className="mt-1 text-xs text-drd-muted">
                      Preview: {formatNumber(monthlyNum)} SYP
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-drd-muted">At least one of weekly or monthly price is required.</p>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
                <label className="block text-sm font-semibold text-drd-text">
                  {tField(lang, "Plan PDF", "ملف الخطة")}
                </label>
                <input
                  ref={planPdfInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={handlePlanPdfFile}
                  disabled={!!savingId || pdfUploading}
                />
                {formPdfUrl ? (
                  <div className="space-y-2">
                    <p className="text-xs text-drd-muted truncate" title={formPdfFileName || formPdfUrl}>
                      {formPdfFileName || tField(lang, "PDF attached", "ملف PDF مرفق")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={formPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-lg border border-drd-primary bg-drd-primary/10 px-3 py-1.5 text-sm font-medium text-drd-primary hover:bg-drd-primary/20"
                      >
                        {tField(lang, "View PDF", "عرض الملف")}
                      </a>
                      <button
                        type="button"
                        disabled={!!savingId || pdfUploading}
                        onClick={() => planPdfInputRef.current?.click()}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-drd-text hover:bg-slate-50 disabled:opacity-50"
                      >
                        {tField(lang, "Replace PDF", "استبدال الملف")}
                      </button>
                      <button
                        type="button"
                        disabled={!!savingId || pdfUploading}
                        onClick={handlePlanPdfDelete}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {tField(lang, "Delete PDF", "حذف الملف")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!!savingId || pdfUploading}
                    onClick={() => planPdfInputRef.current?.click()}
                    className="rounded-lg border border-drd-primary bg-drd-primary/10 px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/20 disabled:opacity-50"
                  >
                    {tField(lang, "Upload PDF", "رفع ملف PDF")}
                  </button>
                )}
                {pdfUploading && (
                  <p className="text-xs text-drd-muted">{tField(lang, "Uploading…", "جاري الرفع…")}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">
                  {tField(lang, "Subscribe link (e.g. Google Form)", "رابط الاشتراك (مثلاً نموذج Google)")}
                </label>
                <input
                  type="url"
                  value={formSubscribeUrl}
                  onChange={(e) => setFormSubscribeUrl(e.target.value)}
                  placeholder="https://forms.gle/..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
                <p className="mt-1 text-xs text-drd-muted">
                  {tField(lang, "Optional. If set, a \"Subscribe Now\" button appears on the plan card.", "اختياري. إذا تم تعيينه، سيظهر زر \"اشترك الآن\" على بطاقة الخطة.")}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-drd-text">Features (EN)</label>
                  <button
                    type="button"
                    onClick={() => addFeatureRow("en")}
                    className="text-xs text-drd-primary hover:underline"
                  >
                    + Add row
                  </button>
                </div>
                <div className="space-y-2">
                  {formFeaturesEn.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={v}
                        onChange={(e) => setFeatureValue("en", i, e.target.value)}
                        placeholder="Feature text"
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeatureRow("en", i)}
                        className="rounded border border-slate-200 px-2 text-slate-500 hover:bg-slate-50"
                        aria-label="Remove"
                      >
                        −
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-drd-text">Features (AR)</label>
                  <button
                    type="button"
                    onClick={() => addFeatureRow("ar")}
                    className="text-xs text-drd-primary hover:underline"
                  >
                    + Add row
                  </button>
                </div>
                <div className="space-y-2">
                  {formFeaturesAr.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={v}
                        onChange={(e) => setFeatureValue("ar", i, e.target.value)}
                        placeholder="نص الميزة"
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        dir="rtl"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeatureRow("ar", i)}
                        className="rounded border border-slate-200 px-2 text-slate-500 hover:bg-slate-50"
                        aria-label="Remove"
                      >
                        −
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formPopular}
                  onChange={(e) => setFormPopular(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-drd-text">Most Popular badge</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-drd-text">Active (show on landing)</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!!savingId || !hasPrice || pdfUploading}
                  className="rounded-full bg-drd-primary px-5 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-50"
                >
                  {savingId ? "Saving…" : modalOpen === "add" ? "Create" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-drd-text hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
