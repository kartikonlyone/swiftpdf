"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function MergeTool() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | processing | done | error
  const [error, setError] = useState(null);

  async function handleMerge() {
    if (files.length < 2) {
      setError("Please add at least two PDF files.");
      return;
    }
    setError(null);
    setStatus("processing");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/tools/merge", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      const blob = await res.blob();
      downloadBlob(blob, "merged.pdf");
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
        onFilesChange={(f) => {
          setFiles(f);
          setStatus("idle");
        }}
        helperText="Add two or more PDF files, then reorder them with the arrows."
      />

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleMerge}
        disabled={files.length < 2 || status === "processing"}
        className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark"
      >
        {status === "processing" ? "Merging…" : "Merge PDF"}
      </button>

      {status === "done" && (
        <p className="mt-3 text-sm text-brand">Your merged PDF has downloaded.</p>
      )}
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
