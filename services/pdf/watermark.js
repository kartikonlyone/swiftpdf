import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

/**
 * Stamp a diagonal text watermark on every page.
 * @param {Buffer} buffer
 * @param {object} options
 * @param {string} options.text
 * @param {number} [options.opacity=0.3]
 * @param {number} [options.fontSize=48]
 */
export async function watermarkPdf(buffer, { text, opacity = 0.3, fontSize = 48 }) {
  if (!text || !text.trim()) throw new Error("Watermark text is required.");

  const doc = await PDFDocument.load(buffer);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45)
    });
  }

  return doc.save();
}
