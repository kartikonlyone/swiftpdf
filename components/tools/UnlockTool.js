"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function UnlockTool() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function handleUnlock() {
    if (!file) return setError("Please upload a PDF file first.");
    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);
      const res = await fetch("/api/tools/unlock", { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Something went wrong.");
      downloadBlob(await res.blob(), "unlocked.pdf");
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
        <label htmlFor="unlock-pw" className="text-sm font-medium text-ink">Current password (if any)</label>
        <input id="unlock-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button onClick={handleUnlock} disabled={!file || status === "processing"} className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark">
        {status === "processing" ? "Unlocking…" : "Unlock PDF"}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your unlocked PDF has downloaded.</p>}
      <p className="mt-4 text-xs text-ink/50">Only remove restrictions from PDFs you own or have permission to unlock.</p>
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
