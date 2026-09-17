"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

/**
 * Shared UI for organize-pdf, delete-pdf-pages, extract-pdf-pages, and
 * add-page-numbers-to-pdf — each is a thin configuration of the same
 * page-ops API and pdf-lib backend.
 */
export default function PageOpsTool({ operation, toolKey, actionLabel, fieldLabel }) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState("");
  const [position, setPosition] = useState("bottom-center");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const needsPageList = operation === "organize" || operation === "delete" || operation === "extract";

  async function handleRun() {
    if (!file) return setError("Please upload a PDF file first.");
    if (needsPageList && !pages.trim()) return setError(`Enter ${fieldLabel.toLowerCase()}.`);
    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("operation", operation);
      formData.append("toolKey", toolKey);
      if (operation === "organize") formData.append("order", pages);
      if (operation === "delete" || operation === "extract") formData.append("pages", pages);
      if (operation === "numbers") formData.append("position", position);

      const res = await fetch("/api/tools/page-ops", { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Something went wrong.");
      downloadBlob(await res.blob(), `${operation}.pdf`);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div>
      <FileUpload onFilesChange={(f) => { setFile(f[0] || null); setStatus("idle"); }} />

      {needsPageList && (
        <div className="mt-4">
          <label htmlFor="pages" className="text-sm font-medium text-ink">{fieldLabel}</label>
          <input id="pages" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="e.g. 1,3,2" className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        </div>
      )}

      {operation === "numbers" && (
        <div className="mt-4">
          <label htmlFor="position" className="text-sm font-medium text-ink">Position</label>
          <select id="position" value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm">
            <option value="bottom-center">Bottom center</option>
            <option value="bottom-right">Bottom right</option>
            <option value="top-right">Top right</option>
          </select>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button onClick={handleRun} disabled={!file || status === "processing"} className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark">
        {status === "processing" ? "Working…" : actionLabel}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your file has downloaded.</p>}
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
