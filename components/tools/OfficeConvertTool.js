"use client";

import { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";

/**
 * Shared UI for the six Office <-> PDF converters. Checks the worker status
 * up front so the person sees an honest "Configure Integration" state
 * instead of a broken upload button.
 */
export default function OfficeConvertTool({ accept, targetFormat, toolKey, actionLabel }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [workerConfigured, setWorkerConfigured] = useState(null); // null = checking

  useEffect(() => {
    fetch("/api/tools/convert-office")
      .then((r) => r.json())
      .then((data) => setWorkerConfigured(data.configured))
      .catch(() => setWorkerConfigured(false));
  }, []);

  async function handleConvert() {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }
    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFormat", targetFormat);
      formData.append("toolKey", toolKey);

      const res = await fetch("/api/tools/convert-office", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Conversion failed.");
      }
      const blob = await res.blob();
      downloadBlob(blob, `converted.${targetFormat}`);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (workerConfigured === false) {
    return (
      <div className="rounded-card border border-dashed border-ink/20 bg-ink/[0.02] p-6 text-center">
        <p className="font-display font-semibold text-ink">Conversion Service — Not Connected</p>
        <p className="mt-2 text-sm text-ink/60">
          This conversion runs on a dedicated document-conversion worker (LibreOffice headless) that
          hasn't been deployed yet. Set <code className="rounded bg-ink/10 px-1">CONVERSION_WORKER_URL</code> in
          your environment once it's running — see the README.
        </p>
      </div>
    );
  }

  return (
    <div>
      <FileUpload
        accept={accept}
        helperText={workerConfigured === null ? "Checking conversion service…" : undefined}
        onFilesChange={(files) => { setFile(files[0] || null); setStatus("idle"); }}
      />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleConvert}
        disabled={!file || status === "processing" || workerConfigured === null}
        className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark"
      >
        {status === "processing" ? "Converting…" : actionLabel}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your file has downloaded.</p>}
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
