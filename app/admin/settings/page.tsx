"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";

type Settings = {
  phoneNumber: string | null;
  instagramUrl: string | null;
  instagramHandle: string | null;
  facebookUrl: string | null;
  facebookHandle: string | null;
  menuPdfUrl: string | null;
  orderOnBeeorderUrl: string | null;
  orderOnMovoUrl: string | null;
  googleMapsEmbedUrl: string | null;
  googleMapsLinkUrl: string | null;
  mapsEmbedHtml: string | null;
  locationText: string | null;
  locationEn: string | null;
  locationAr: string | null;
  showHero: boolean;
  showMenu: boolean;
  showPlates: boolean;
  showScience: boolean;
  showVideos: boolean;
  showTestimonials: boolean;
  showPlans: boolean;
  showContact: boolean;
};

export default function AdminSettingsPage() {
  const { lang } = useLang();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const menuPdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          ...data,
          mapsEmbedHtml: data.mapsEmbedHtml ?? null,
          locationText: data.locationText ?? null,
          locationEn: data.locationEn ?? null,
          locationAr: data.locationAr ?? null,
          orderOnMovoUrl: data.orderOnMovoUrl ?? null,
          facebookUrl: data.facebookUrl ?? null,
          facebookHandle: data.facebookHandle ?? null,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(tField(lang, "Saved", "تم الحفظ"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setSaving(false);
    }
  }

  async function handleMenuPdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    if (file.type !== "application/pdf") {
      toast.error(tField(lang, "Please select a PDF file only.", "يرجى اختيار ملف PDF فقط."));
      e.target.value = "";
      return;
    }
    setUploadingPdf(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "menu");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");
      setSettings({ ...settings, menuPdfUrl: data.url ?? null });
      toast.success(tField(lang, "Menu PDF uploaded.", "تم رفع ملف قائمة الطعام."));
    } catch {
      toast.error(tField(lang, "Upload failed.", "فشل الرفع."));
    } finally {
      setUploadingPdf(false);
      e.target.value = "";
    }
  }

  if (loading || !settings) {
    return <div className="text-drd-muted">{tField(lang, "Loading...", "جاري التحميل...")}</div>;
  }

  const toggles: (keyof Settings)[] = [
    "showHero",
    "showMenu",
    "showPlates",
    "showScience",
    "showVideos",
    "showTestimonials",
    "showPlans",
    "showContact",
  ];
  const toggleLabelsEn: Record<string, string> = {
    showHero: "Hero",
    showMenu: "Menu",
    showPlates: "Our Most-Loved Plates",
    showScience: "Science",
    showVideos: "Videos",
    showTestimonials: "Testimonials",
    showPlans: "Plans",
    showContact: "Contact",
  };
  const toggleLabelsAr: Record<string, string> = {
    showHero: "الهيرو",
    showMenu: "القائمة",
    showPlates: "أطباقنا المفضلة",
    showScience: "العلم",
    showVideos: "الفيديوهات",
    showTestimonials: "الشهادات",
    showPlans: "الخطط",
    showContact: "التواصل",
  };

  const hasMenuPdf = !!(settings.menuPdfUrl?.trim());

  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Main Settings", "الإعدادات الرئيسية")}
        backLabel={tField(lang, "Dashboard", "لوحة التحكم")}
        backHref="/admin"
        showBack={false}
      />
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold text-drd-text mb-4">
            {tField(lang, "Contact & Social", "التواصل ووسائل التواصل")}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Phone", "الهاتف")}
              </label>
              <input
                type="text"
                value={settings.phoneNumber ?? ""}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Instagram URL", "رابط إنستغرام")}
              </label>
              <input
                type="url"
                value={settings.instagramUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="https://instagram.com/dr.diet.sy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Instagram Handle", "حساب إنستغرام")}
              </label>
              <input
                type="text"
                value={settings.instagramHandle ?? ""}
                onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="@dr.diet.sy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Facebook URL", "رابط فيسبوك")}
              </label>
              <input
                type="url"
                value={settings.facebookUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Facebook Handle", "اسم حساب فيسبوك")}
              </label>
              <input
                type="text"
                value={settings.facebookHandle ?? ""}
                onChange={(e) => setSettings({ ...settings, facebookHandle: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="@drdiet.facebook"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-drd-text mb-4">
            {tField(lang, "Menu PDF", "قائمة الطعام PDF")}
          </h2>
          <div className="space-y-4">
            <div>
              <input
                ref={menuPdfInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleMenuPdfChange}
                className="hidden"
              />
              <div className="flex flex-wrap gap-2 items-center">
                {hasMenuPdf ? (
                  <>
                    <a
                      href={settings.menuPdfUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-drd-primary bg-drd-primary/10 px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/20"
                    >
                      {tField(lang, "View PDF", "عرض الملف")}
                    </a>
                    <LoadingButton
                      type="button"
                      loading={uploadingPdf}
                      onClick={() => menuPdfInputRef.current?.click()}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-drd-text hover:bg-slate-50"
                    >
                      {tField(lang, "Replace PDF", "استبدال الملف")}
                    </LoadingButton>
                  </>
                ) : (
                  <LoadingButton
                    type="button"
                    loading={uploadingPdf}
                    onClick={() => menuPdfInputRef.current?.click()}
                    className="rounded-lg border border-drd-primary bg-drd-primary/10 px-4 py-2 text-sm font-medium text-drd-primary hover:bg-drd-primary/20"
                  >
                    {tField(lang, "Upload Menu PDF", "رفع ملف قائمة الطعام")}
                  </LoadingButton>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Order on BeeOrder", "رابط بي أوردر")}
              </label>
              <input
                type="url"
                value={settings.orderOnBeeorderUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, orderOnBeeorderUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="https://beeorder.app/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Order on Movo", "رابط موفو")}
              </label>
              <input
                type="url"
                value={settings.orderOnMovoUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, orderOnMovoUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-drd-text mb-4">
            {tField(lang, "Google Maps", "خرائط Google")}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Google Maps Embed HTML", "كود تضمين خرائط Google")}
              </label>
              <p className="text-xs text-drd-muted mb-2">
                {tField(lang, "Paste the iframe code from Google Maps (Share → Embed a map → Copy HTML).", "الصق كود iframe من خرائط Google (مشاركة → تضمين خريطة → نسخ HTML).")}
              </p>
              <textarea
                value={settings.mapsEmbedHtml ?? ""}
                onChange={(e) => setSettings({ ...settings, mapsEmbedHtml: e.target.value.trim() || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text font-mono text-sm min-h-[120px]"
                placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
                spellCheck={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Google Maps Link URL", "رابط خرائط Google")}
              </label>
              <input
                type="url"
                value={settings.googleMapsLinkUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, googleMapsLinkUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="https://maps.google.com/?q=..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Location (English, shown in Find us)", "الموقع (إنجليزي)")}
              </label>
              <input
                type="text"
                value={settings.locationEn ?? ""}
                onChange={(e) => setSettings({ ...settings, locationEn: e.target.value.trim() || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="Mazzeh - Uptown, Damascus, Syria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">
                {tField(lang, "Location (Arabic)", "الموقع (عربي)")}
              </label>
              <input
                type="text"
                value={settings.locationAr ?? ""}
                onChange={(e) => setSettings({ ...settings, locationAr: e.target.value.trim() || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="المزة - أب تاون، دمشق، سوريا"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-drd-text mb-4">
            {tField(lang, "Section Visibility", "إظهار الأقسام")}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {toggles.map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!settings[key]}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-drd-primary focus:ring-drd-primary"
                />
                <span className="text-sm text-drd-text">
                  {lang === "ar" ? toggleLabelsAr[key] : toggleLabelsEn[key]}
                </span>
              </label>
            ))}
          </div>
        </div>

        <LoadingButton
          type="submit"
          loading={saving}
          className="rounded-full bg-drd-primary px-6 py-2.5 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          {tField(lang, "Save Settings", "حفظ الإعدادات")}
        </LoadingButton>
      </form>
    </div>
  );
}
