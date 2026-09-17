"use client";

import { useRef, useState } from "react";
import FileUpload from "@/components/FileUpload";

export default function SignTool() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("typed"); // typed | draw | upload
  const [typedText, setTypedText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  function startDraw(e) {
    drawing.current = true;
    draw(e);
  }
  function endDraw() {
    drawing.current = false;
  }
  function draw(e) {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0B1E3A";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  function clearCanvas() {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  async function handleSign() {
    if (!file) return setError("Please upload a PDF file first.");
    setError(null);
    setStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageNumber", String(pageNumber));
      formData.append("x", "60");
      formData.append("y", "60");
      formData.append("width", "180");
      formData.append("height", "60");

      if (mode === "typed") {
        if (!typedText.trim()) throw new Error("Type your name to generate a signature.");
        formData.append("type", "typed");
        formData.append("text", typedText);
      } else if (mode === "draw") {
        const blob = await new Promise((resolve) => canvasRef.current.toBlob(resolve, "image/png"));
        if (!blob) throw new Error("Draw your signature first.");
        formData.append("type", "image");
        formData.append("image", blob, "signature.png");
      } else if (mode === "upload") {
        if (!uploadedImage) throw new Error("Upload a signature image first.");
        formData.append("type", "image");
        formData.append("image", uploadedImage);
      }

      const res = await fetch("/api/tools/sign", { method: "POST", body: formData });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Something went wrong.");
      downloadBlob(await res.blob(), "signed.pdf");
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
        <label htmlFor="page-num" className="text-sm font-medium text-ink">Page to sign</label>
        <input id="page-num" type="number" min={1} value={pageNumber} onChange={(e) => setPageNumber(Number(e.target.value))} className="mt-1 w-24 rounded-card border border-ink/15 px-3 py-2 text-sm" />
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-ink">Signature method</legend>
        <div className="mt-2 flex gap-2">
          {[["typed", "Type"], ["draw", "Draw"], ["upload", "Upload"]].map(([key, label]) => (
            <button
              type="button"
              key={key}
              onClick={() => setMode(key)}
              className={`rounded-card border px-4 py-2 text-sm ${mode === key ? "border-brand bg-brand-tint text-brand" : "border-ink/15 text-ink/70"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {mode === "typed" && (
        <input
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          placeholder="Your name"
          className="mt-4 w-full rounded-card border border-ink/15 px-3 py-2 font-display text-xl italic"
        />
      )}

      {mode === "draw" && (
        <div className="mt-4">
          <canvas
            ref={canvasRef}
            width={360}
            height={140}
            className="touch-none rounded-card border border-ink/15 bg-white"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          <button type="button" onClick={clearCanvas} className="mt-2 text-sm text-ink/60 hover:text-ink">
            Clear
          </button>
        </div>
      )}

      {mode === "upload" && (
        <input
          type="file"
          accept="image/png"
          onChange={(e) => setUploadedImage(e.target.files?.[0] || null)}
          className="mt-4 text-sm"
        />
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button onClick={handleSign} disabled={!file || status === "processing"} className="mt-6 w-full rounded-card bg-brand py-3 font-semibold text-white disabled:opacity-40 hover:bg-brand-dark">
        {status === "processing" ? "Signing…" : "Sign PDF"}
      </button>
      {status === "done" && <p className="mt-3 text-sm text-brand">Your signed PDF has downloaded.</p>}
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
