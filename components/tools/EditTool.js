"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

/**
 * A focused first version of Edit PDF: add a text box to a chosen page and
 * position. It reuses the same pdf-lib text-embedding path as Sign PDF's
 * typed mode. A full multi-tool editor (highlight, shapes, images) is a
 * larger client-side canvas project — this ships the real, working core
 * rather than a placeholder screen.
 */
export default function EditTool() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [x, setX] = useState(60);
  const [y, setY] = useState(700);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function handleApply() {
    if (!file) return setError("Please upload a PDF file first.");
    if (!text.trim()) return setError("Enter the text you want to add.");
    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "typed");
      formData.append("text", text);
      formData.append("pageNumber", String(pageNumber));
      formData.append("x", String(x));
      formData.append("y", String(y));
      formData.append("width", "220");
      formData.append("height", "40");

      const res = await fetch("/api/tools/sign", { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Something went wrong.");
      downloadBlob(await res.blob(), "edited.pdf");
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
        <label htmlFor="edit-text" className="text-sm font-medium text-ink">Text to add</label>
        <input id="edit-text" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="edit-page" className="text-sm font-medium text-ink">Page</label>
          <input id="edit-page" type="number" min={1} value={pageNumber} onChange={(e) => setPageNumber(Number(e.target.value))} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="edit-x" className="text-sm font-medium text-ink">X position</label>
          <input id="edit-x" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="edit-y" className="text-sm font-medium text-ink">Y position</label>
          <input id="edit-y" type="number" value={y} onChange={(e) => setY(Number(e.target.value))} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
        </div>
      </div>
      <p className="mt-1 text-xs text-ink/50">Position is measured in points from the bottom-left corner of the page.</p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button onClick={handleApply} disabled={!file || status === "processing"} className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark">
        {status === "processing" ? "Applying…" : "Add Text & Download"}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your edited PDF has downloaded.</p>}
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
