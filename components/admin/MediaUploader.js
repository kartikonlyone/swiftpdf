"use client";

import { useRef, useState } from "react";

/**
 * Reusable image uploader for the admin panel.
 * - `onUploaded(media)` fires with the created Media row after a successful upload.
 * - Used standalone on the Media Library page, and embedded in the blog
 *   editor (for the featured image and for inserting inline images).
 */
export default function MediaUploader({ onUploaded, buttonLabel = "Upload image" }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | error
  const [error, setError] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError(null);
    setStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Upload failed.");

      setStatus("idle");
      onUploaded?.(body.media, body.isPermanentUrl);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
        className="rounded-card border border-ink/15 bg-white px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand disabled:opacity-50"
      >
        {status === "uploading" ? "Uploading…" : buttonLabel}
      </button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} className="hidden" />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
