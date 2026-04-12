"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import InlineLoader from "@/components/admin/InlineLoader";
import LoadingButton from "@/components/admin/LoadingButton";
import { useLang } from "@/lib/LangContext";
import { tField } from "@/lib/tField";
import { MAX_VIDEO_BYTES, uploadAdminVideoBlob } from "@/lib/uploadVideoClient";

const MAX_VIDEOS = 5;

type Video = {
  id: string;
  videoUrl: string;
  posterUrl: string | null;
  titleEn: string | null;
  titleAr: string | null;
  isActive: boolean;
  sortOrder: number;
};

type SectionContent = {
  videosTitleEn: string | null;
  videosTitleAr: string | null;
  videosSubtitleEn: string | null;
  videosSubtitleAr: string | null;
};

export default function AdminVideosPage() {
  const { lang } = useLang();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleEn, setEditTitleEn] = useState("");
  const [editTitleAr, setEditTitleAr] = useState("");
  const [sectionContent, setSectionContent] = useState<SectionContent>({
    videosTitleEn: null,
    videosTitleAr: null,
    videosSubtitleEn: null,
    videosSubtitleAr: null,
  });
  const [sectionSaving, setSectionSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function fetchVideos() {
    fetch("/api/admin/videos")
      .then((r) => r.json())
      .then(setVideos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSectionContent({
          videosTitleEn: data.videosTitleEn ?? null,
          videosTitleAr: data.videosTitleAr ?? null,
          videosSubtitleEn: data.videosSubtitleEn ?? null,
          videosSubtitleAr: data.videosSubtitleAr ?? null,
        });
      })
      .catch(() => {});
  }, []);

  async function handleSaveSectionContent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSectionSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videosTitleEn: sectionContent.videosTitleEn?.trim() || null,
          videosTitleAr: sectionContent.videosTitleAr?.trim() || null,
          videosSubtitleEn: sectionContent.videosSubtitleEn?.trim() || null,
          videosSubtitleAr: sectionContent.videosSubtitleAr?.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(tField(lang, "Saved", "تم الحفظ"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setSectionSaving(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedMime = ["video/mp4", "video/quicktime", "video/webm"];
    const ext = file.name.toLowerCase();
    const extOk = ext.endsWith(".mp4") || ext.endsWith(".mov") || ext.endsWith(".webm");
    if (!allowedMime.includes(file.type) && !extOk) {
      toast.error(
        tField(
          lang,
          "That file type isn’t supported. Use MP4, MOV, or WebM.",
          "نوع الملف غير مدعوم. استخدم MP4 أو MOV أو WebM."
        )
      );
      e.target.value = "";
      return;
    }
    if (videos.length >= MAX_VIDEOS) {
      toast.error(tField(lang, "Maximum of 5 videos allowed.", "الحد الأقصى 5 فيديوهات."));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      toast.error(
        tField(
          lang,
          `This file is too large. Maximum size is ${Math.floor(MAX_VIDEO_BYTES / 1024 / 1024)} MB — try compressing the video or choosing a shorter clip.`,
          `الملف كبير جداً. الحد الأقصى ${Math.floor(MAX_VIDEO_BYTES / 1024 / 1024)} ميجابايت — جرّب ضغط الفيديو أو اختيار مقطع أقصر.`
        )
      );
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      let videoUrl: string;
      try {
        const out = await uploadAdminVideoBlob(file);
        videoUrl = out.url;
      } catch (uploadErr: unknown) {
        const code = uploadErr instanceof Error ? uploadErr.message : "";
        if (code === "INVALID_TYPE") {
          toast.error(
            tField(
              lang,
              "That file type isn’t supported. Use MP4, MOV, or WebM.",
              "نوع الملف غير مدعوم. استخدم MP4 أو MOV أو WebM."
            )
          );
          return;
        }
        if (code === "FILE_TOO_LARGE") {
          toast.error(
            tField(
              lang,
              `This file is too large. Maximum size is ${Math.floor(MAX_VIDEO_BYTES / 1024 / 1024)} MB.`,
              `الملف كبير جداً. الحد الأقصى ${Math.floor(MAX_VIDEO_BYTES / 1024 / 1024)} ميجابايت.`
            )
          );
          return;
        }
        toast.error(
          uploadErr instanceof Error
            ? uploadErr.message
            : tField(lang, "We couldn’t upload the video. Check your connection and try again.", "تعذّر رفع الفيديو. تحقق من الاتصال وحاول مرة أخرى.")
        );
        return;
      }
      if (!videoUrl) {
        toast.error(tField(lang, "Upload succeeded but no URL returned.", "تم الرفع لكن لم يُرجع رابط."));
        return;
      }
      const createRes = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ videoUrl }),
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        toast.error(createData?.error ?? tField(lang, "Failed to add video", "فشل إضافة الفيديو"));
        return;
      }
      setVideos((prev) => [...prev, createData].sort((a, b) => a.sortOrder - b.sortOrder));
      toast.success(
        tField(lang, "Video uploaded successfully and added to your list.", "تم رفع الفيديو بنجاح وإضافته إلى القائمة.")
      );
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(tField(lang, "Delete this video?", "حذف هذا الفيديو؟"))) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      setVideos(videos.filter((v) => v.id !== id));
      if (editingId === id) setEditingId(null);
      toast.success(tField(lang, "Deleted", "تم الحذف"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    }
  }

  async function handleToggleActive(video: Video) {
    const next = !video.isActive;
    setVideos(videos.map((v) => (v.id === video.id ? { ...v, isActive: next } : v)));
    setTogglingId(video.id);
    try {
      const res = await fetch(`/api/admin/videos/${video.id}`, {
        method: "PUT",
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
      setVideos(videos.map((v) => (v.id === video.id ? { ...v, isActive: !next } : v)));
      toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
    } finally {
      setTogglingId(null);
    }
  }

  function startEdit(video: Video) {
    setEditingId(video.id);
    setEditTitleEn(video.titleEn ?? "");
    setEditTitleAr(video.titleAr ?? "");
  }

  async function saveEdit() {
    if (!editingId) return;
    const video = videos.find((v) => v.id === editingId);
    if (!video) return;
    try {
      const res = await fetch(`/api/admin/videos/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ titleEn: editTitleEn.trim() || null, titleAr: editTitleAr.trim() || null }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setVideos(videos.map((v) => (v.id === editingId ? { ...v, titleEn: editTitleEn.trim() || null, titleAr: editTitleAr.trim() || null } : v)));
      setEditingId(null);
      toast.success(tField(lang, "Updated", "تم التحديث"));
    } catch {
      toast.error(tField(lang, "Something went wrong", "حدث خطأ ما"));
    }
  }

  function moveVideo(index: number, direction: "up" | "down") {
    const newVideos = [...videos];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newVideos.length || reordering) return;
    [newVideos[index], newVideos[target]] = [newVideos[target], newVideos[index]];
    const videoIds = newVideos.map((v) => v.id);
    setVideos(newVideos);
    setReordering(true);
    fetch("/api/admin/videos/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ videoIds }),
    })
      .then((res) => {
        if (res.ok) toast.success(tField(lang, "Order updated", "تم تحديث الترتيب"));
        else return res.json().then((d) => { throw new Error(d?.error ?? "Failed to reorder"); });
      })
      .catch((e) => {
        setVideos(videos);
        toast.error(e instanceof Error ? e.message : tField(lang, "Something went wrong", "حدث خطأ ما"));
      })
      .finally(() => setReordering(false));
  }

  if (loading) return <div className="text-drd-muted">{tField(lang, "Loading...", "جاري التحميل...")}</div>;

  return (
    <div>
      <AdminPageHeader
        title={tField(lang, "Videos", "الفيديوهات")}
        backLabel={tField(lang, "Dashboard", "لوحة التحكم")}
        backHref="/admin"
        showBack={false}
      />
      <p className="text-drd-muted mb-6">{tField(lang, "Max 5 videos. They appear in the Reels section on the landing page (autoplay muted, click to open modal).", "حد أقصى 5 فيديوهات. تظهر في قسم الريلز على الصفحة الرئيسية.")}</p>

      {/* Section title & subtitle (saved to SiteSettings) */}
      <form onSubmit={handleSaveSectionContent} className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-drd-text mb-4">{tField(lang, "Section title & subtitle", "عنوان القسم والعنوان الفرعي")}</h2>
        <p className="text-sm text-drd-muted mb-4">Shown at the top of the Videos / Reels section on the landing page. Leave empty to use defaults.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-drd-text mb-1">{tField(lang, "Title (English)", "العنوان (إنجليزي)")}</label>
            <input
              type="text"
              value={sectionContent.videosTitleEn ?? ""}
              onChange={(e) => setSectionContent((s) => ({ ...s, videosTitleEn: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="See the Real Plates"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-drd-text mb-1">{tField(lang, "Title (Arabic)", "العنوان (عربي)")}</label>
            <input
              type="text"
              value={sectionContent.videosTitleAr ?? ""}
              onChange={(e) => setSectionContent((s) => ({ ...s, videosTitleAr: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="شاهد الأطباق الحقيقية"
              dir="rtl"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-drd-text mb-1">{tField(lang, "Subtitle (English)", "العنوان الفرعي (إنجليزي)")}</label>
            <input
              type="text"
              value={sectionContent.videosSubtitleEn ?? ""}
              onChange={(e) => setSectionContent((s) => ({ ...s, videosSubtitleEn: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="Real, freshly prepared meals — straight from our kitchen..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-drd-text mb-1">{tField(lang, "Subtitle (Arabic)", "العنوان الفرعي (عربي)")}</label>
            <input
              type="text"
              value={sectionContent.videosSubtitleAr ?? ""}
              onChange={(e) => setSectionContent((s) => ({ ...s, videosSubtitleAr: e.target.value || null }))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-drd-text"
              placeholder="أطباق حقيقية طازجة — من مطبخنا مباشرة..."
              dir="rtl"
            />
          </div>
        </div>
        <div className="mt-4">
          <LoadingButton
            type="submit"
            loading={sectionSaving}
            loadingLabel={tField(lang, "Saving…", "جاري الحفظ…")}
            className="rounded-full bg-drd-primary px-5 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-70"
          >
            {tField(lang, "Save section title & subtitle", "حفظ عنوان القسم والعنوان الفرعي")}
          </LoadingButton>
        </div>
      </form>

      {/* Upload */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-drd-text mb-2">{tField(lang, "Upload Video", "رفع فيديو")}</h2>
        <p className="text-sm text-drd-muted mb-2">
          {tField(
            lang,
            `Up to ${MAX_VIDEOS} videos. Formats: MP4, MOV, or WebM. Max ${Math.floor(MAX_VIDEO_BYTES / 1024 / 1024)} MB per file.`,
            `حتى ${MAX_VIDEOS} فيديوهات. الصيغ: MP4 أو MOV أو WebM. بحد أقصى ${Math.floor(MAX_VIDEO_BYTES / 1024 / 1024)} ميجابايت لكل ملف.`
          )}
        </p>
        <div className="mb-4 rounded-lg border border-drd-primary/20 bg-drd-primary/5 px-4 py-3 text-sm text-drd-text/90">
          <p className="font-medium text-drd-text mb-1">
            {tField(lang, "Direct upload", "رفع مباشر")}
          </p>
          <p className="leading-relaxed text-drd-text/80">
            {tField(
              lang,
              "Videos upload straight from your browser to secure storage (not through our small upload API). Larger files can take several minutes — keep this tab open until the upload finishes.",
              "تُرفع الفيديوهات مباشرة من المتصفح إلى التخزين الآمن (وليس عبر مسار الرفع الصغير). الملفات الكبيرة قد تحتاج عدة دقائق — أبقِ هذه الصفحة مفتوحة حتى يكتمل الرفع."
            )}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <button
          type="button"
          disabled={uploading || videos.length >= MAX_VIDEOS}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading
            ? tField(lang, "Uploading video…", "جاري رفع الفيديو…")
            : videos.length >= MAX_VIDEOS
              ? tField(lang, "Maximum 5 videos", "حد أقصى 5 فيديوهات")
              : tField(lang, "Upload Video", "رفع فيديو")}
        </button>
        {uploading && (
          <span className="ml-3 align-middle" aria-hidden>
            <InlineLoader label="" />
          </span>
        )}
      </div>

      {/* List */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-drd-muted">{tField(lang, "Use ▲▼ to reorder", "استخدم ▲▼ لإعادة الترتيب")}</span>
        {reordering && <InlineLoader label={tField(lang, "Saving order…", "جاري حفظ الترتيب…")} />}
      </div>
      <div className="space-y-4">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => moveVideo(index, "up")}
                disabled={reordering || index === 0}
                className="rounded p-1 text-drd-text/60 hover:bg-slate-100 disabled:opacity-30"
                aria-label={tField(lang, "Move up", "تحريك لأعلى")}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveVideo(index, "down")}
                disabled={reordering || index === videos.length - 1}
                className="rounded p-1 text-drd-text/60 hover:bg-slate-100 disabled:opacity-30"
                aria-label={tField(lang, "Move down", "تحريك لأسفل")}
              >
                ▼
              </button>
            </div>
            <div className="relative h-24 w-[135px] shrink-0 overflow-hidden rounded-lg bg-black">
              <video
                src={video.videoUrl}
                poster={video.posterUrl ?? undefined}
                muted
                preload="metadata"
                className="h-full w-full object-cover"
                playsInline
              />
            </div>
            <div className="min-w-0 flex-1">
              {editingId === video.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editTitleEn}
                    onChange={(e) => setEditTitleEn(e.target.value)}
                    placeholder="Title (English)"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                  />
                  <input
                    type="text"
                    value={editTitleAr}
                    onChange={(e) => setEditTitleAr(e.target.value)}
                    placeholder="العنوان (عربي)"
                    dir="rtl"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-right"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="text-sm text-drd-primary hover:underline"
                    >
                      {tField(lang, "Save", "حفظ")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-sm text-drd-muted hover:underline"
                    >
                      {tField(lang, "Cancel", "إلغاء")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-medium text-drd-text">{video.titleEn || "—"}</p>
                  <p className="text-sm text-drd-muted" dir="rtl">{video.titleAr || "—"}</p>
                  <button
                    type="button"
                    onClick={() => startEdit(video)}
                    className="mt-1 text-sm text-drd-primary hover:underline"
                  >
                    {tField(lang, "Edit titles", "تعديل العناوين")}
                  </button>
                </>
              )}
            </div>
            <label className="flex items-center gap-2">
              <span className="text-sm text-drd-muted">{tField(lang, "Active", "مفعل")}</span>
              <input
                type="checkbox"
                checked={video.isActive}
                onChange={() => handleToggleActive(video)}
                disabled={togglingId === video.id}
                className="rounded border-slate-300"
              />
              {togglingId === video.id && <InlineLoader label="" />}
            </label>
            <button
              type="button"
              onClick={() => handleDelete(video.id)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              {tField(lang, "Delete", "حذف")}
            </button>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <p className="text-drd-muted">{tField(lang, "No videos yet. Upload one above.", "لا توجد فيديوهات بعد. ارفع واحداً أعلاه.")}</p>
      )}
    </div>
  );
}
