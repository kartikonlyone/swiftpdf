"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function PdfToImageTool({ format, toolKey }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [notConfigured, setNotConfigured] = useState(false);

  async function handleConvert() {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    setError(null);
    setNotConfigured(false);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("direction", "from-pdf");
      formData.append("format", format);
      formData.append("toolKey", toolKey);

      const res = await fetch("/api/tools/image-convert", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.code === "NOT_CONFIGURED") setNotConfigured(true);
        throw new Error(body.error || "Something went wrong.");
      }
      const blob = await res.blob();
      downloadBlob(blob, "pages.zip");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div>
      <FileUpload onFilesChange={(files) => { setFile(files[0] || null); setStatus("idle"); }} />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {notConfigured && (
        <p className="mt-2 text-sm text-ink/60">
          This server doesn't have Ghostscript installed yet — required to rasterize PDF pages into images. See the README's deployment section.
        </p>
      )}
      <button
        type="button"
        onClick={handleConvert}
        disabled={!file || status === "processing"}
        className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark"
      >
        {status === "processing" ? "Converting…" : `Convert to ${format.toUpperCase()}`}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your ZIP of images has downloaded.</p>}
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
