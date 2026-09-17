import { PDFDocument } from "pdf-lib";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { nanoid } from "nanoid";

const execFileAsync = promisify(execFile);

const LEVELS = {
  low: { gsPreset: "/prepress", label: "Low compression, best quality" },
  recommended: { gsPreset: "/ebook", label: "Recommended — balanced size and quality" },
  extreme: { gsPreset: "/screen", label: "Extreme compression, smaller file" }
};

/**
 * Compress a PDF.
 *
 * Real compression of embedded raster images (the biggest lever for file
 * size) requires re-encoding those image streams — pdf-lib alone cannot do
 * this safely for arbitrary PDFs. This function:
 *
 *  1. Always applies pdf-lib's structural compaction (object streams,
 *     removing unused objects) — a real, if modest, size reduction that
 *     works with zero external dependencies.
 *  2. If Ghostscript (`gs`) is available on the host, additionally runs the
 *     requested preset for genuine image down-sampling. This is the
 *     "Extreme / Recommended / Low" behaviour described in the product spec.
 *
 * If Ghostscript isn't installed, step 2 is skipped and the response
 * clearly reports which stage actually ran — never a fabricated size.
 */
export async function compressPdf(buffer, level = "recommended") {
  if (!LEVELS[level]) throw new Error(`Unknown compression level: ${level}`);

  const originalSize = buffer.length;

  // Stage 1: structural compaction via pdf-lib (always available).
  const doc = await PDFDocument.load(buffer);
  let stage1 = Buffer.from(await doc.save({ useObjectStreams: true }));

  // Stage 2: Ghostscript image recompression (optional, if the binary exists).
  let stage2 = null;
  let ghostscriptUsed = false;
  try {
    stage2 = await runGhostscript(stage1, LEVELS[level].gsPreset);
    ghostscriptUsed = true;
  } catch (err) {
    // Ghostscript not installed or failed — fall back to stage 1 result only.
    ghostscriptUsed = false;
  }

  const finalBytes = stage2 && stage2.length < stage1.length ? stage2 : stage1;

  return {
    bytes: finalBytes,
    originalSizeBytes: originalSize,
    compressedSizeBytes: finalBytes.length,
    reductionPercent: Math.max(
      0,
      Math.round(((originalSize - finalBytes.length) / originalSize) * 100)
    ),
    level,
    levelLabel: LEVELS[level].label,
    ghostscriptUsed
  };
}

async function runGhostscript(buffer, preset) {
  const inPath = join(tmpdir(), `sp-in-${nanoid(10)}.pdf`);
  const outPath = join(tmpdir(), `sp-out-${nanoid(10)}.pdf`);
  await writeFile(inPath, buffer);

  try {
    await execFileAsync("gs", [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      `-dPDFSETTINGS=${preset}`,
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      `-sOutputFile=${outPath}`,
      inPath
    ]);
    return await readFile(outPath);
  } finally {
    await unlink(inPath).catch(() => {});
    await unlink(outPath).catch(() => {});
  }
}

export const COMPRESSION_LEVELS = LEVELS;
