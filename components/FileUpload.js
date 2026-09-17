"use client";

import { useCallback, useRef, useState } from "react";

const DEFAULT_ACCEPT = ["application/pdf"];
const DEFAULT_MAX_SIZE_MB = 50;

/**
 * Reusable drag-and-drop file upload used by every PDF tool page.
 * Purely a client-side collector + orchestrator — the actual processing
 * request (and its progress) is driven by the parent tool page, which knows
 * which API route to call.
 */
export default function FileUpload({
  accept = DEFAULT_ACCEPT,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
  multiple = false,
  onFilesChange,
  helperText
}) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validate = useCallback(
    (fileList) => {
      const accepted = [];
      for (const file of fileList) {
        if (accept.length && !accept.includes(file.type)) {
          setError("Please upload a valid PDF file.");
          continue;
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
          setError(`This file exceeds the maximum allowed size of ${maxSizeMb}MB.`);
          continue;
        }
        accepted.push(file);
      }
      return accepted;
    },
    [accept, maxSizeMb]
  );

  const addFiles = useCallback(
    (incoming) => {
      setError(null);
      const accepted = validate(incoming);
      if (accepted.length === 0) return;

      setFiles((prev) => {
        const next = multiple ? [...prev, ...accepted] : [accepted[0]];
        onFilesChange?.(next);
        return next;
      });
    },
    [multiple, onFilesChange, validate]
  );

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  function handlePick(e) {
    addFiles(Array.from(e.target.files || []));
    e.target.value = "";
  }

  function removeFile(index) {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onFilesChange?.(next);
      return next;
    });
  }

  function moveFile(index, direction) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      onFilesChange?.(next);
      return next;
    });
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed p-10 text-center transition-colors cursor-pointer
          ${isDragging ? "border-brand bg-brand-tint" : "border-ink/15 bg-white hover:border-brand/50"}`}
      >
        <UploadIcon />
        <p className="text-ink font-medium">
          Drag and drop your file{multiple ? "s" : ""} here, or click to browse
        </p>
        <p className="text-sm text-ink/60">{helperText || `PDF files up to ${maxSizeMb}MB`}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          onChange={handlePick}
          className="hidden"
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-4 divide-y divide-ink/10 rounded-card border border-ink/10 bg-white">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center gap-3 p-3">
              <FileIcon />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{file.name}</p>
                <p className="text-xs text-ink/50">{formatBytes(file.size)}</p>
              </div>
              {multiple && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => moveFile(index, -1)}
                    className="rounded p-1 text-ink/50 hover:bg-ink/5"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => moveFile(index, 1)}
                    className="rounded p-1 text-ink/50 hover:bg-ink/5"
                  >
                    ↓
                  </button>
                </div>
              )}
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeFile(index)}
                className="rounded p-1 text-ink/50 hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="#004D40" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="#004D40" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="#00332B" strokeWidth="1.4" />
      <path d="M15 2v5h5" stroke="#00332B" strokeWidth="1.4" />
    </svg>
  );
}
