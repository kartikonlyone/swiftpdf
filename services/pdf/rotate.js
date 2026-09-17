import { PDFDocument, degrees } from "pdf-lib";

/**
 * Rotate pages of a PDF.
 * @param {Buffer} buffer
 * @param {object} options
 * @param {number} options.angle - one of 90, 180, 270 (clockwise)
 * @param {number[]} [options.pages] - 1-indexed page numbers to rotate; omit to rotate all.
 */
export async function rotatePdf(buffer, { angle, pages }) {
  if (![90, 180, 270].includes(angle)) {
    throw new Error("Rotation angle must be 90, 180, or 270 degrees.");
  }

  const doc = await PDFDocument.load(buffer);
  const totalPages = doc.getPageCount();
  const targets = pages && pages.length > 0 ? pages : Array.from({ length: totalPages }, (_, i) => i + 1);

  for (const pageNumber of targets) {
    if (pageNumber < 1 || pageNumber > totalPages) {
      throw new Error(`Page ${pageNumber} does not exist in a ${totalPages}-page document.`);
    }
    const page = doc.getPage(pageNumber - 1);
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + angle) % 360));
  }

  return doc.save();
}
