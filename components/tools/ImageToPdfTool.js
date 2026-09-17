"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function ImageToPdfTool({ accept, toolKey }) {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function handleConvert() {
    if (files.length === 0) {
      setError("Please add at least one image.");
      return;
    }
    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      formData.append("direction", "to-pdf");
      formData.append("toolKey", toolKey);

      const res = await fetch("/api/tools/image-convert", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      const blob = await res.blob();
      downloadBlob(blob, "converted.pdf");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div>
      <FileUpload
        multiple
        accept={accept}
        helperText="Add one or more images. Each becomes a page, in order."
        onFilesChange={(f) => {
          setFiles(f);
          setStatus("idle");
        }}
      />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleConvert}
        disabled={files.length === 0 || status === "processing"}
        className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark"
      >
        {status === "processing" ? "Converting…" : "Convert to PDF"}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your PDF has downloaded.</p>}
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
