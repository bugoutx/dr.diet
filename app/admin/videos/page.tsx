"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import InlineLoader from "@/components/admin/InlineLoader";

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

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleEn, setEditTitleEn] = useState("");
  const [editTitleAr, setEditTitleAr] = useState("");
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

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["video/mp4", "video/quicktime"];
    if (!allowed.includes(file.type) && !file.name.toLowerCase().endsWith(".mp4") && !file.name.toLowerCase().endsWith(".mov")) {
      toast.error("Please select an MP4 or MOV video file.");
      e.target.value = "";
      return;
    }
    if (videos.length >= MAX_VIDEOS) {
      toast.error("Maximum of 5 videos allowed.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", "videos");
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        toast.error(uploadData?.error ?? "Upload failed");
        return;
      }
      const videoUrl = uploadData?.url ?? uploadData?.downloadUrl;
      if (!videoUrl) {
        toast.error("Upload succeeded but no URL returned.");
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
        toast.error(createData?.error ?? "Failed to add video");
        return;
      }
      setVideos((prev) => [...prev, createData].sort((a, b) => a.sortOrder - b.sortOrder));
      toast.success("Video added");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this video?")) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
      setVideos(videos.filter((v) => v.id !== id));
      if (editingId === id) setEditingId(null);
      toast.success("Deleted");
    } catch {
      toast.error("Something went wrong");
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
      toast.success("Updated");
    } catch (e) {
      setVideos(videos.map((v) => (v.id === video.id ? { ...v, isActive: !next } : v)));
      toast.error(e instanceof Error ? e.message : "Something went wrong");
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
      toast.success("Updated");
    } catch {
      toast.error("Something went wrong");
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
        if (res.ok) toast.success("Order updated");
        else return res.json().then((d) => { throw new Error(d?.error ?? "Failed to reorder"); });
      })
      .catch((e) => {
        setVideos(videos);
        toast.error(e instanceof Error ? e.message : "Something went wrong");
      })
      .finally(() => setReordering(false));
  }

  if (loading) return <div className="text-drd-muted">Loading...</div>;

  return (
    <div>
      <AdminPageHeader
        title="Videos"
        backLabel="Dashboard"
        backHref="/admin"
        showBack={false}
      />
      <p className="text-drd-muted mb-6">Max 5 videos. They appear in the Reels section on the landing page (autoplay muted, click to open modal).</p>

      {/* Upload */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-drd-text mb-2">Upload Video</h2>
        <p className="text-sm text-drd-muted mb-4">You can upload up to 5 videos. MP4 or MOV.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,.mp4,.mov"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading || videos.length >= MAX_VIDEOS}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full bg-drd-primary px-6 py-2 font-semibold text-white hover:bg-drd-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading…" : videos.length >= MAX_VIDEOS ? "Maximum 5 videos" : "Upload Video"}
        </button>
        {uploading && <span className="ml-3 align-middle"><InlineLoader label="Uploading…" /></span>}
      </div>

      {/* List */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-drd-muted">Use ▲▼ to reorder</span>
        {reordering && <InlineLoader label="Saving order…" />}
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
                aria-label="Move up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveVideo(index, "down")}
                disabled={reordering || index === videos.length - 1}
                className="rounded p-1 text-drd-text/60 hover:bg-slate-100 disabled:opacity-30"
                aria-label="Move down"
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
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-sm text-drd-muted hover:underline"
                    >
                      Cancel
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
                    Edit titles
                  </button>
                </>
              )}
            </div>
            <label className="flex items-center gap-2">
              <span className="text-sm text-drd-muted">Active</span>
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
              Delete
            </button>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <p className="text-drd-muted">No videos yet. Upload one above.</p>
      )}
    </div>
  );
}
