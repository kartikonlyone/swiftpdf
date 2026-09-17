"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function SplitTool() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("every-page");
  const [ranges, setRanges] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function handleSplit() {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    if (mode === "ranges" && !ranges.trim()) {
      setError("Enter page ranges, e.g. 1-3,5,7-9");
      return;
    }

    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", mode);
      formData.append("ranges", ranges);

      const res = await fetch("/api/tools/split", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      const blob = await res.blob();
      downloadBlob(blob, "split-pages.zip");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div>
      <FileUpload
        onFilesChange={(files) => {
          setFile(files[0] || null);
          setStatus("idle");
        }}
      />

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-ink">Split method</legend>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <label className={`flex-1 cursor-pointer rounded-card border p-3 text-sm ${mode === "every-page" ? "border-brand bg-brand-tint" : "border-ink/15"}`}>
            <input type="radio" name="mode" className="mr-2" checked={mode === "every-page"} onChange={() => setMode("every-page")} />
            Split every page into its own file
          </label>
          <label className={`flex-1 cursor-pointer rounded-card border p-3 text-sm ${mode === "ranges" ? "border-brand bg-brand-tint" : "border-ink/15"}`}>
            <input type="radio" name="mode" className="mr-2" checked={mode === "ranges"} onChange={() => setMode("ranges")} />
            Extract specific page ranges
          </label>
        </div>
      </fieldset>

      {mode === "ranges" && (
        <div className="mt-3">
          <label htmlFor="ranges" className="text-sm font-medium text-ink">Page ranges</label>
          <input
            id="ranges"
            type="text"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="e.g. 1-3,5,7-9"
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm"
          />
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleSplit}
        disabled={!file || status === "processing"}
        className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark"
      >
        {status === "processing" ? "Splitting…" : "Split PDF"}
      </button>

      {status === "done" && <p className="mt-3 text-sm text-brand">Your ZIP file has downloaded.</p>}
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
