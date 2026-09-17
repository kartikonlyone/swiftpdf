"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function RotateTool() {
  const [file, setFile] = useState(null);
  const [angle, setAngle] = useState(90);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function handleRotate() {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("angle", String(angle));

      const res = await fetch("/api/tools/rotate", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      const blob = await res.blob();
      downloadBlob(blob, "rotated.pdf");
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
        <legend className="text-sm font-medium text-ink">Rotation</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[90, 180, 270].map((a) => (
            <label key={a} className={`cursor-pointer rounded-card border p-3 text-center text-sm ${angle === a ? "border-brand bg-brand-tint" : "border-ink/15"}`}>
              <input type="radio" name="angle" className="sr-only" checked={angle === a} onChange={() => setAngle(a)} />
              {a}°
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleRotate}
        disabled={!file || status === "processing"}
        className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark"
      >
        {status === "processing" ? "Rotating…" : "Rotate PDF"}
      </button>

      {status === "done" && <p className="mt-3 text-sm text-brand">Your rotated PDF has downloaded.</p>}
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
