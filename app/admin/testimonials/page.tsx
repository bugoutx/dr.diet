"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import InlineLoader from "@/components/admin/InlineLoader";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  avatarUrl: string | null;
  avatarColor: string | null;
  isActive: boolean;
  sortOrder: number;
};

type SectionContent = {
  testimonialsTitleEn: string | null;
  testimonialsTitleAr: string | null;
  testimonialsSubtitleEn: string | null;
  testimonialsSubtitleAr: string | null;
};

function StarDots({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${i <= rating ? "bg-drd-accent" : "bg-slate-200"}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const { lang } = useLang();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionContent, setSectionContent] = useState<SectionContent>({
    testimonialsTitleEn: null,
    testimonialsTitleAr: null,
    testimonialsSubtitleEn: null,
    testimonialsSubtitleAr: null,
  });
  const [sectionSaving, setSectionSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formText, setFormText] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formActive, setFormActive] = useState(true);

  function fetchTestimonials() {
    fetch("/api/admin/testimonials", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
        else setTestimonials([]);
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }

  function fetchSectionContent() {
    fetch("/api/admin/settings", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setSectionContent({
          testimonialsTitleEn: data.testimonialsTitleEn ?? null,
          testimonialsTitleAr: data.testimonialsTitleAr ?? null,
          testimonialsSubtitleEn: data.testimonialsSubtitleEn ?? null,
          testimonialsSubtitleAr: data.testimonialsSubtitleAr ?? null,
        });
      })
      .catch(console.error);
  }

  useEffect(() => {
    fetchTestimonials();
    fetchSectionContent();
  }, []);

  async function handleSaveSectionContent(e: React.FormEvent) {
    e.preventDefault();
    setSectionSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          testimonialsTitleEn: sectionContent.testimonialsTitleEn?.trim() || null,
          testimonialsTitleAr: sectionContent.testimonialsTitleAr?.trim() || null,
          testimonialsSubtitleEn: sectionContent.testimonialsSubtitleEn?.trim() || null,
          testimonialsSubtitleAr: sectionContent.testimonialsSubtitleAr?.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(tField(lang, "Section title & subtitle saved", "تم حفظ عنوان القسم والعنوان الفرعي"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setSectionSaving(false);
    }
  }

  function openAdd() {
    setEditingId(null);
    setFormName("");
    setFormRole("");
    setFormText("");
    setFormRating(5);
    setFormActive(true);
    setModalOpen("add");
  }

  function openEdit(t: Testimonial) {
    setEditingId(t.id);
    setFormName(t.name);
    setFormRole(t.role ?? "");
    setFormText(t.text);
    setFormRating(t.rating);
    setFormActive(t.isActive);
    setModalOpen("edit");
  }

  function closeModal() {
    setModalOpen(null);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = formName.trim();
    const text = formText.trim();
    if (name.length < 2) {
      toast.error(tField(lang, "Name must be at least 2 characters", "الاسم يجب أن يكون حرفين على الأقل"));
      return;
    }
    if (text.length < 10) {
      toast.error(tField(lang, "Quote must be at least 10 characters", "الاقتباس يجب أن يكون 10 أحرف على الأقل"));
      return;
    }
    setSavingId(editingId ?? "new");
    try {
      if (modalOpen === "add") {
        const res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name,
            role: formRole.trim() || null,
            text,
            rating: formRating,
            isActive: formActive,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data?.error?.name?.[0] ?? data?.error?.text?.[0] ?? data?.error ?? "Failed to create";
          throw new Error(msg);
        }
        setTestimonials((prev) => [...prev, data].sort((a, b) => a.sortOrder - b.sortOrder));
        toast.success(tField(lang, "Testimonial added", "تمت إضافة الشهادة"));
      } else {
        if (!editingId) return;
        const res = await fetch(`/api/admin/testimonials/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name,
            role: formRole.trim() || null,
            text,
            rating: formRating,
            isActive: formActive,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data?.error?.name?.[0] ?? data?.error?.text?.[0] ?? data?.error ?? "Failed to update";
          throw new Error(msg);
        }
        setTestimonials((prev) => prev.map((t) => (t.id === editingId ? data : t)));
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
    if (!confirm(tField(lang, "Delete this testimonial?", "حذف هذه الشهادة؟"))) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      if (editingId === id) closeModal();
      toast.success("Deleted");
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function handleToggleActive(t: Testimonial) {
    const next = !t.isActive;
    setTestimonials((prev) => prev.map((x) => (x.id === t.id ? { ...x, isActive: next } : x)));
    setTogglingId(t.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
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
      setTestimonials((prev) => prev.map((x) => (x.id === t.id ? { ...x, isActive: !next } : x)));
      toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setTogglingId(null);
    }
  }

  function moveTestimonial(index: number, direction: "up" | "down") {
    const newList = [...testimonials];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newList.length || reordering) return;
    [newList[index], newList[target]] = [newList[target], newList[index]];
    const ids = newList.map((x) => x.id);
    setTestimonials(newList);
    setReordering(true);
    fetch("/api/admin/testimonials/reorder", {
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
        setTestimonials(testimonials);
        toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
      })
      .finally(() => setReordering(false));
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader title={tField(lang, "Testimonials", "الشهادات")} backLabel={tField(lang, "Dashboard", "لوحة التحكم")} backHref="/admin" showBack={false} />
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
        title={tField(lang, "Testimonials", "الشهادات")}
        backLabel={tField(lang, "Dashboard", "لوحة التحكم")}
        backHref="/admin"
        showBack={false}
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="rounded-full bg-drd-primary px-5 py-2 font-semibold text-white hover:bg-drd-primary-dark"
          >
            {tField(lang, "Add Testimonial", "إضافة شهادة")}
          </button>
        }
      />

      <form
        onSubmit={handleSaveSectionContent}
        className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-drd-text mb-2">
          {tField(lang, "Section title & subtitle", "عنوان القسم والعنوان الفرعي")}
        </h2>
        <p className="text-sm text-drd-muted mb-4">
          {tField(
            lang,
            "Shown at the top of the Testimonials section on the landing page.",
            "يظهر أعلى قسم آراء العملاء في الصفحة الرئيسية."
          )}
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-drd-text mb-2">
              {tField(lang, "Testimonials Title", "عنوان قسم آراء العملاء")}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">
                  {tField(lang, "Title (English)", "العنوان (إنجليزي)")}
                </label>
                <input
                  type="text"
                  value={sectionContent.testimonialsTitleEn ?? ""}
                  onChange={(e) =>
                    setSectionContent((s) => ({ ...s, testimonialsTitleEn: e.target.value || null }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                  placeholder="Loved by Healthy Food Lovers"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">
                  {tField(lang, "Title (Arabic)", "العنوان (عربي)")}
                </label>
                <input
                  type="text"
                  value={sectionContent.testimonialsTitleAr ?? ""}
                  onChange={(e) =>
                    setSectionContent((s) => ({ ...s, testimonialsTitleAr: e.target.value || null }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                  placeholder="محبوب من عشّاق الأكل الصحي"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-drd-text mb-2">
              {tField(lang, "Testimonials Subtitle", "العنوان الفرعي لقسم آراء العملاء")}
            </h3>
            <div className="grid gap-4 sm:grid-cols-1">
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">
                  {tField(lang, "Subtitle (English)", "العنوان الفرعي (إنجليزي)")}
                </label>
                <textarea
                  value={sectionContent.testimonialsSubtitleEn ?? ""}
                  onChange={(e) =>
                    setSectionContent((s) => ({ ...s, testimonialsSubtitleEn: e.target.value || null }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text min-h-[80px]"
                  placeholder="People choose Dr.Diet for everyday balanced meals that fuel their active lifestyles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">
                  {tField(lang, "Subtitle (Arabic)", "العنوان الفرعي (عربي)")}
                </label>
                <textarea
                  value={sectionContent.testimonialsSubtitleAr ?? ""}
                  onChange={(e) =>
                    setSectionContent((s) => ({ ...s, testimonialsSubtitleAr: e.target.value || null }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text min-h-[80px]"
                  placeholder="يختار الناس د.دايت لوجبات يومية متوازنة تدعم أسلوب حياتهم النشط"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={sectionSaving}
            className="rounded-full bg-drd-primary px-5 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
          >
            {sectionSaving
              ? tField(lang, "Saving…", "جاري الحفظ…")
              : tField(lang, "Save section title & subtitle", "حفظ عنوان القسم والعنوان الفرعي")}
          </button>
        </div>
      </form>

      <p className="text-drd-muted mb-6">
        {tField(lang, "Manage customer testimonials. Only active ones appear on the landing page. Use ▲▼ to reorder.", "إدارة شهادات العملاء. تظهر النشطة فقط على الصفحة الرئيسية. استخدم ▲▼ لإعادة الترتيب.")}
      </p>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-drd-muted">{tField(lang, "Use ▲▼ to reorder", "استخدم ▲▼ لإعادة الترتيب")}</span>
        {reordering && <InlineLoader label={tField(lang, "Saving order…", "جاري حفظ الترتيب…")} />}
      </div>
      <div className="space-y-4">
        {testimonials.map((t, index) => (
          <div
            key={t.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => moveTestimonial(index, "up")}
                disabled={reordering || index === 0}
                className="rounded p-1 text-drd-text/60 hover:bg-slate-100 disabled:opacity-30"
                aria-label={tField(lang, "Move up", "تحريك لأعلى")}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveTestimonial(index, "down")}
                disabled={reordering || index === testimonials.length - 1}
                className="rounded p-1 text-drd-text/60 hover:bg-slate-100 disabled:opacity-30"
                aria-label={tField(lang, "Move down", "تحريك لأسفل")}
              >
                ▼
              </button>
            </div>
            <div className="w-10 h-10 rounded-full bg-drd-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-drd-primary font-semibold">{t.name.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-drd-text">{t.name}</p>
              <p className="text-sm text-drd-muted">{t.role || "—"}</p>
              <p className="text-sm text-drd-text/80 line-clamp-2 mt-0.5">{t.text}</p>
            </div>
            <StarDots rating={t.rating} />
            <label className="flex items-center gap-2">
              <span className="text-sm text-drd-muted">{tField(lang, "Active", "مفعل")}</span>
              <input
                type="checkbox"
                checked={t.isActive}
                onChange={() => handleToggleActive(t)}
                disabled={togglingId === t.id}
                className="rounded border-slate-300"
              />
              {togglingId === t.id && <InlineLoader label="" />}
            </label>
            <button
              type="button"
              onClick={() => openEdit(t)}
              className="text-sm text-drd-primary hover:underline"
            >
              {tField(lang, "Edit", "تعديل")}
            </button>
            <button
              type="button"
              onClick={() => handleDelete(t.id)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              {tField(lang, "Delete", "حذف")}
            </button>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <p className="text-drd-muted">{tField(lang, "No testimonials yet. Click \"Add Testimonial\" to create one.", "لا توجد شهادات بعد. انقر \"إضافة شهادة\" لإنشاء واحدة.")}</p>
      )}

      {/* Add / Edit Modal */}
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
              {modalOpen === "add" ? tField(lang, "Add Testimonial", "إضافة شهادة") : tField(lang, "Edit Testimonial", "تعديل الشهادة")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Sarah Johnson"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  required
                  minLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">Role / Title (optional)</label>
                <input
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="e.g. Gym Member"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">Quote *</label>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Customer quote (min 10 characters)"
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  required
                  minLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-drd-text mb-1">Rating (1–5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormRating(r)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                        formRating === r ? "border-drd-accent bg-drd-accent/10 text-drd-accent" : "border-slate-200 text-drd-muted"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-drd-text">{tField(lang, "Active (show on landing)", "مفعل (يظهر على الصفحة الرئيسية)")}</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!!savingId}
                  className="rounded-full bg-drd-primary px-5 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-50"
                >
                  {savingId ? tField(lang, "Saving…", "جاري الحفظ…") : modalOpen === "add" ? tField(lang, "Create", "إنشاء") : tField(lang, "Save", "حفظ")}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-drd-text hover:bg-slate-50"
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
