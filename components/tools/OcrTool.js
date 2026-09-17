"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

const LANGUAGES = ["english", "hindi", "spanish", "french", "german", "italian", "portuguese"];

export default function OcrTool() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("english");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [pages, setPages] = useState(null);

  async function handleRun() {
    if (!file) return setError("Please upload a PDF file first.");
    setError(null);
    setNotConfigured(false);
    setPages(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);
      const res = await fetch("/api/tools/ocr", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) {
        if (body.code === "NOT_CONFIGURED") setNotConfigured(true);
        throw new Error(body.error || "OCR failed.");
      }
      setPages(body.pages);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  function downloadText() {
    const combined = pages.map((p) => p.text).join("\n\n---\n\n");
    const blob = new Blob([combined], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ocr-text.txt"; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <FileUpload onFilesChange={(f) => { setFile(f[0] || null); setStatus("idle"); setPages(null); }} />

      <div className="mt-4">
        <label htmlFor="lang" className="text-sm font-medium text-ink">Language</label>
        <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm capitalize">
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {notConfigured && (
        <p className="mt-2 text-sm text-ink/60">
          OCR requires Ghostscript on the server to rasterize scanned pages before recognition. See the README.
        </p>
      )}

      <button onClick={handleRun} disabled={!file || status === "processing"} className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark">
        {status === "processing" ? "Recognizing text…" : "Run OCR"}
      </button>

      {pages && (
        <div className="mt-4 rounded-card border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/70">Recognized text from {pages.length} page{pages.length !== 1 ? "s" : ""}.</p>
          <button onClick={downloadText} className="mt-2 text-sm font-semibold text-brand hover:underline">
            Download extracted text (.txt)
          </button>
        </div>
      )}
    </div>
  );
}
