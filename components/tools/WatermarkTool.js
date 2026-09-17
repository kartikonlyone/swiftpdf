"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function WatermarkTool() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function handleApply() {
    if (!file) return setError("Please upload a PDF file first.");
    if (!text.trim()) return setError("Enter the watermark text.");
    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("text", text);
      const res = await fetch("/api/tools/watermark", { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Something went wrong.");
      downloadBlob(await res.blob(), "watermarked.pdf");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div>
      <FileUpload onFilesChange={(f) => { setFile(f[0] || null); setStatus("idle"); }} />
      <div className="mt-4">
        <label htmlFor="wm-text" className="text-sm font-medium text-ink">Watermark text</label>
        <input id="wm-text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button onClick={handleApply} disabled={!file || status === "processing"} className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark">
        {status === "processing" ? "Applying…" : "Add Watermark"}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your watermarked PDF has downloaded.</p>}
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
