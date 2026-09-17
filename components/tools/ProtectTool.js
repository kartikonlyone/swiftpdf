"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function ProtectTool() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [notConfigured, setNotConfigured] = useState(false);

  async function handleProtect() {
    if (!file) return setError("Please upload a PDF file first.");
    if (password.length < 4) return setError("Choose a password with at least 4 characters.");
    setError(null);
    setNotConfigured(false);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);
      const res = await fetch("/api/tools/protect", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.code === "NOT_CONFIGURED") setNotConfigured(true);
        throw new Error(body.error || "Something went wrong.");
      }
      downloadBlob(await res.blob(), "protected.pdf");
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
        <label htmlFor="pw" className="text-sm font-medium text-ink">Password</label>
        <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2 text-sm" />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {notConfigured && (
        <p className="mt-2 text-sm text-ink/60">
          Password protection requires the <code className="rounded bg-ink/10 px-1">qpdf</code> binary on the server. See the README.
        </p>
      )}
      <button onClick={handleProtect} disabled={!file || status === "processing"} className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark">
        {status === "processing" ? "Protecting…" : "Protect PDF"}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your protected PDF has downloaded.</p>}
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
