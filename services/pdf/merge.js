import { PDFDocument } from "pdf-lib";

/**
 * Merge multiple PDF buffers into one, in the given order.
 * @param {Buffer[]} buffers - raw bytes of each source PDF, already in the desired order.
 * @returns {Promise<Uint8Array>} bytes of the merged PDF.
 */
export async function mergePdfs(buffers) {
  if (!buffers || buffers.length < 2) {
    throw new Error("Merge requires at least two PDF files.");
  }

  const merged = await PDFDocument.create();

  for (const buffer of buffers) {
    const src = await PDFDocument.load(buffer, { ignoreEncryption: false });
    const pageIndices = src.getPageIndices();
    const copiedPages = await merged.copyPages(src, pageIndices);
    copiedPages.forEach((page) => merged.addPage(page));
  }

  return merged.save();
}
