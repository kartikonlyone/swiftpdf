import { PDFDocument } from "pdf-lib";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile, readdir, unlink, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { nanoid } from "nanoid";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

/**
 * Real, dependency-free: pack one or more raster images into a single PDF,
 * one image per page, using pdf-lib's native JPEG/PNG embedding.
 */
export async function imagesToPdf(images) {
  // images: [{ buffer, mimeType }]
  const doc = await PDFDocument.create();

  for (const { buffer, mimeType } of images) {
    // Normalize to a PDF-embeddable format via sharp when needed.
    const isJpeg = mimeType === "image/jpeg" || mimeType === "image/jpg";
    const isPng = mimeType === "image/png";
    const normalized = isJpeg || isPng ? buffer : await sharp(buffer).png().toBuffer();
    const finalIsJpeg = isJpeg;

    const image = finalIsJpeg ? await doc.embedJpg(normalized) : await doc.embedPng(normalized);
    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  return doc.save();
}

/**
 * Rasterize each page of a PDF into an image (JPG or PNG). Requires
 * Ghostscript (`gs`) on the server — pdf-lib cannot rasterize pages itself.
 * Throws GhostscriptNotAvailableError if the binary is missing, rather than
 * returning a fake image.
 */
export class GhostscriptNotAvailableError extends Error {
  constructor() {
    super("PDF-to-image conversion requires Ghostscript (`gs`) on the server.");
    this.name = "GhostscriptNotAvailableError";
  }
}

export async function pdfToImages(buffer, { format = "jpg", dpi = 150 } = {}) {
  const workDir = join(tmpdir(), `sp-rasterize-${nanoid(10)}`);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  await writeFile(inPath, buffer);

  const device = format === "png" ? "png16m" : "jpeg";
  const outPattern = join(workDir, `page-%03d.${format === "png" ? "png" : "jpg"}`);

  try {
    await execFileAsync("gs", [
      `-sDEVICE=${device}`,
      `-r${dpi}`,
      "-dNOPAUSE",
      "-dBATCH",
      "-dQUIET",
      `-sOutputFile=${outPattern}`,
      inPath
    ]);
  } catch (err) {
    await rm(workDir, { recursive: true, force: true });
    if (err.code === "ENOENT") throw new GhostscriptNotAvailableError();
    throw err;
  }

  const files = (await readdir(workDir)).filter((f) => f.startsWith("page-")).sort();
  const pages = [];
  for (const file of files) {
    pages.push({ name: file, bytes: await readFile(join(workDir, file)) });
  }

  await rm(workDir, { recursive: true, force: true });
  return pages;
}
