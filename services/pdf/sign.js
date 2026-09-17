import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Place a signature onto one page of a PDF.
 * Supports:
 *  - typed signature (rendered as text in a script-style weight via StandardFonts.HelveticaOblique
 *    — swap in an embedded cursive TTF for a more authentic look)
 *  - drawn or uploaded signature (a PNG data URL from a <canvas> or file upload)
 *
 * @param {Buffer} buffer - source PDF
 * @param {object} options
 * @param {number} options.pageNumber - 1-indexed
 * @param {number} options.x - position from left, in PDF points
 * @param {number} options.y - position from bottom, in PDF points
 * @param {number} [options.width=180]
 * @param {number} [options.height=60]
 * @param {"typed"|"image"} options.type
 * @param {string} [options.text] - required when type is "typed"
 * @param {Buffer} [options.imageBuffer] - required when type is "image" (PNG bytes)
 */
export async function signPdf(buffer, options) {
  const { pageNumber, x, y, width = 180, height = 60, type, text, imageBuffer } = options;

  const doc = await PDFDocument.load(buffer);
  const totalPages = doc.getPageCount();
  if (pageNumber < 1 || pageNumber > totalPages) {
    throw new Error(`Page ${pageNumber} does not exist in a ${totalPages}-page document.`);
  }
  const page = doc.getPage(pageNumber - 1);

  if (type === "typed") {
    if (!text || !text.trim()) throw new Error("Enter a name to generate a typed signature.");
    const font = await doc.embedFont(StandardFonts.HelveticaOblique);
    const fontSize = Math.min(36, height * 0.6);
    page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.05, 0.15, 0.4) });
  } else if (type === "image") {
    if (!imageBuffer) throw new Error("No signature image was provided.");
    const image = await doc.embedPng(imageBuffer);
    page.drawImage(image, { x, y, width, height });
  } else {
    throw new Error(`Unknown signature type: ${type}`);
  }

  return doc.save();
}
