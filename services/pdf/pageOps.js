import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Organize PDF: reorder and/or drop pages in one pass.
 * @param {Buffer} buffer
 * @param {number[]} order - 1-indexed page numbers in the desired final order
 *   (omit a page number to delete it; a number may not repeat).
 */
export async function organizePdf(buffer, order) {
  const src = await PDFDocument.load(buffer);
  const totalPages = src.getPageCount();

  const indices = order.map((n) => {
    if (n < 1 || n > totalPages) throw new Error(`Page ${n} does not exist in a ${totalPages}-page document.`);
    return n - 1;
  });
  if (new Set(indices).size !== indices.length) {
    throw new Error("Each page can only appear once in the new order.");
  }

  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, indices);
  pages.forEach((p) => doc.addPage(p));
  return doc.save();
}

/** Delete specific pages, keeping the rest in original order. */
export async function deletePages(buffer, pageNumbersToDelete) {
  const src = await PDFDocument.load(buffer);
  const totalPages = src.getPageCount();
  const toDelete = new Set(pageNumbersToDelete);

  const keepIndices = [];
  for (let i = 1; i <= totalPages; i++) {
    if (!toDelete.has(i)) keepIndices.push(i - 1);
  }
  if (keepIndices.length === 0) {
    throw new Error("You cannot delete every page in the document.");
  }

  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, keepIndices);
  pages.forEach((p) => doc.addPage(p));
  return doc.save();
}

/** Extract specific pages into a new document, preserving their order. */
export async function extractPages(buffer, pageNumbers) {
  const src = await PDFDocument.load(buffer);
  const totalPages = src.getPageCount();

  const indices = pageNumbers.map((n) => {
    if (n < 1 || n > totalPages) throw new Error(`Page ${n} does not exist in a ${totalPages}-page document.`);
    return n - 1;
  });

  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, indices);
  pages.forEach((p) => doc.addPage(p));
  return doc.save();
}

/**
 * Add page numbers to every page.
 * @param {object} options
 * @param {"bottom-center"|"bottom-right"|"top-right"} [options.position]
 * @param {number} [options.startAt]
 */
export async function addPageNumbers(buffer, { position = "bottom-center", startAt = 1 } = {}) {
  const doc = await PDFDocument.load(buffer);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  pages.forEach((page, i) => {
    const { width } = page.getSize();
    const label = String(startAt + i);
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(label, fontSize);

    let x;
    let y = 24;
    if (position === "bottom-right") x = width - textWidth - 36;
    else if (position === "top-right") {
      x = width - textWidth - 36;
      y = page.getSize().height - 36;
    } else x = width / 2 - textWidth / 2;

    page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
  });

  return doc.save();
}

/**
 * Attempt to repair a mildly-damaged PDF by loading with lenient parsing
 * and re-serializing it as a clean, valid document. This genuinely fixes
 * many structural issues (broken xref tables, dangling objects) but cannot
 * recover a file with no valid PDF structure at all — in that case it
 * throws, and the API surfaces a clear failure rather than a fake "fixed" file.
 */
export async function repairPdf(buffer) {
  const doc = await PDFDocument.load(buffer, {
    ignoreEncryption: true,
    throwOnInvalidObject: false,
    updateMetadata: false
  });
  return doc.save({ useObjectStreams: true });
}
