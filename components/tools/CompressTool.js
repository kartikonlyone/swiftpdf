"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

const LEVELS = [
  { key: "extreme", label: "Extreme", hint: "Smaller file" },
  { key: "recommended", label: "Recommended", hint: "Balanced" },
  { key: "low", label: "Low", hint: "Best quality" }
];

export default function CompressTool() {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("recommended");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleCompress() {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    setError(null);
    setStatus("processing");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("level", level);

      const res = await fetch("/api/tools/compress", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      const originalSize = Number(res.headers.get("X-Original-Size"));
      const compressedSize = Number(res.headers.get("X-Compressed-Size"));
      const reduction = Number(res.headers.get("X-Reduction-Percent"));

      const blob = await res.blob();
      downloadBlob(blob, "compressed.pdf");
      setResult({ originalSize, compressedSize, reduction });
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
          setResult(null);
        }}
      />

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-ink">Compression level</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {LEVELS.map((l) => (
            <label
              key={l.key}
              className={`cursor-pointer rounded-card border p-3 text-center text-sm ${
                level === l.key ? "border-brand bg-brand-tint" : "border-ink/15"
              }`}
            >
              <input type="radio" name="level" className="sr-only" checked={level === l.key} onChange={() => setLevel(l.key)} />
              <span className="block font-medium text-ink">{l.label}</span>
              <span className="text-xs text-ink/50">{l.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleCompress}
        disabled={!file || status === "processing"}
        className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark"
      >
        {status === "processing" ? "Compressing…" : "Compress PDF"}
      </button>

      {result && (
        <div className="mt-4 rounded-card border border-ink/10 bg-white p-4 text-sm">
          <p>Original size: <strong>{formatBytes(result.originalSize)}</strong></p>
          <p>Compressed size: <strong>{formatBytes(result.compressedSize)}</strong></p>
          <p>Reduction: <strong>{result.reduction}%</strong></p>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
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
