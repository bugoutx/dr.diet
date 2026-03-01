"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import LoadingButton from "@/components/admin/LoadingButton";

type Settings = {
  phoneNumber: string | null;
  instagramUrl: string | null;
  instagramHandle: string | null;
  menuPdfUrl: string | null;
  orderOnBeeorderUrl: string | null;
  googleMapsEmbedUrl: string | null;
  googleMapsLinkUrl: string | null;
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
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
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
      toast.success("Saved");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return <div className="text-drd-muted">Loading...</div>;
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
  const toggleLabels: Record<string, string> = {
    showHero: "Hero",
    showMenu: "Menu",
    showPlates: "Our Most-Loved Plates",
    showScience: "Science",
    showVideos: "Videos",
    showTestimonials: "Testimonials",
    showPlans: "Plans",
    showContact: "Contact",
  };

  return (
    <div>
      <AdminPageHeader
        title="Main Settings"
        backLabel="Dashboard"
        backHref="/admin"
        showBack={false}
      />
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold text-drd-text mb-4">Contact & Social</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Phone</label>
              <input
                type="text"
                value={settings.phoneNumber ?? ""}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagramUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="https://instagram.com/dr.diet.sy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Instagram Handle</label>
              <input
                type="text"
                value={settings.instagramHandle ?? ""}
                onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="@dr.diet.sy"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-drd-text mb-4">Menu PDF</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Menu PDF URL</label>
              <input
                type="url"
                value={settings.menuPdfUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, menuPdfUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="https://... or upload via Upload section"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Order on Beeorder (URL for &quot;Order Now&quot; button)</label>
              <input
                type="url"
                value={settings.orderOnBeeorderUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, orderOnBeeorderUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
                placeholder="https://beeorder.app/..."
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-drd-text mb-4">Google Maps</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Embed URL</label>
              <input
                type="url"
                value={settings.googleMapsEmbedUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, googleMapsEmbedUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-drd-text mb-1">Normal Link URL</label>
              <input
                type="url"
                value={settings.googleMapsLinkUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, googleMapsLinkUrl: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-drd-text mb-4">Section Visibility</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {toggles.map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!settings[key]}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-drd-primary focus:ring-drd-primary"
                />
                <span className="text-sm text-drd-text">{toggleLabels[key]}</span>
              </label>
            ))}
          </div>
        </div>

        <LoadingButton
          type="submit"
          loading={saving}
          className="rounded-full bg-drd-primary px-6 py-2.5 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
        >
          Save Settings
        </LoadingButton>
      </form>
    </div>
  );
}
