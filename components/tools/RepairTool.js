"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function RepairTool() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function handleRepair() {
    if (!file) return setError("Please upload a PDF file first.");
    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/tools/repair", { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Repair failed.");
      downloadBlob(await res.blob(), "repaired.pdf");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div>
      <FileUpload onFilesChange={(f) => { setFile(f[0] || null); setStatus("idle"); }} />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button onClick={handleRepair} disabled={!file || status === "processing"} className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark">
        {status === "processing" ? "Repairing…" : "Repair PDF"}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your repaired PDF has downloaded.</p>}
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
