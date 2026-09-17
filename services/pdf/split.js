import { PDFDocument } from "pdf-lib";

/**
 * Split a PDF into separate documents.
 * @param {Buffer} buffer - source PDF bytes.
 * @param {object} options
 * @param {"every-page"|"ranges"} options.mode
 * @param {string} [options.ranges] - e.g. "1-3,5,7-9" (only for mode "ranges")
 * @returns {Promise<{name: string, bytes: Uint8Array}[]>}
 */
export async function splitPdf(buffer, { mode, ranges }) {
  const src = await PDFDocument.load(buffer);
  const totalPages = src.getPageCount();
  const outputs = [];

  if (mode === "every-page") {
    for (let i = 0; i < totalPages; i++) {
      const doc = await PDFDocument.create();
      const [page] = await doc.copyPages(src, [i]);
      doc.addPage(page);
      outputs.push({ name: `page-${i + 1}.pdf`, bytes: await doc.save() });
    }
    return outputs;
  }

  if (mode === "ranges") {
    const parsedRanges = parseRanges(ranges, totalPages);
    for (const [start, end] of parsedRanges) {
      const doc = await PDFDocument.create();
      const indices = [];
      for (let p = start; p <= end; p++) indices.push(p - 1);
      const pages = await doc.copyPages(src, indices);
      pages.forEach((p) => doc.addPage(p));
      outputs.push({
        name: start === end ? `page-${start}.pdf` : `pages-${start}-${end}.pdf`,
        bytes: await doc.save()
      });
    }
    return outputs;
  }

  throw new Error(`Unknown split mode: ${mode}`);
}

function parseRanges(rangeString, totalPages) {
  if (!rangeString || !rangeString.trim()) {
    throw new Error("Provide at least one page range, e.g. 1-3,5,7-9");
  }
  return rangeString.split(",").map((part) => {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      if (!start || !end || start > end || end > totalPages) {
        throw new Error(`Invalid range "${trimmed}" for a ${totalPages}-page document.`);
      }
      return [start, end];
    }
    const page = Number(trimmed);
    if (!page || page > totalPages) {
      throw new Error(`Invalid page "${trimmed}" for a ${totalPages}-page document.`);
    }
    return [page, page];
  });
}
