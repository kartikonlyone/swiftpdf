import { createWorker } from "tesseract.js";
import { pdfToImages, GhostscriptNotAvailableError } from "./imageConvert";

export { GhostscriptNotAvailableError };

const LANGUAGE_CODES = {
  english: "eng",
  hindi: "hin",
  spanish: "spa",
  french: "fra",
  german: "deu",
  italian: "ita",
  portuguese: "por"
};

export const OCR_LANGUAGES = Object.keys(LANGUAGE_CODES);

/**
 * Run OCR on a (typically scanned) PDF.
 *
 * Real pipeline: rasterize each page with Ghostscript, then run Tesseract
 * (via tesseract.js, which bundles its own WASM OCR engine — no native
 * binary install required) on each page image.
 *
 * Returns the recognized text per page. Building a fully searchable PDF
 * (original scan + an invisible text layer at the recognized word
 * coordinates) is a further step this function's `wordBoxes` output is
 * designed to feed — left as a documented extension point so this module
 * stays auditable rather than silently approximating it.
 */
export async function ocrPdf(buffer, { language = "english" } = {}) {
  const langCode = LANGUAGE_CODES[language];
  if (!langCode) throw new Error(`Unsupported OCR language: ${language}`);

  const pages = await pdfToImages(buffer, { format: "png", dpi: 200 }); // throws GhostscriptNotAvailableError if gs is missing

  // logger: () => {} suppresses tesseract.js's default per-tile progress
  // logging, which otherwise floods the server console during every OCR run.
  const worker = await createWorker(langCode, 1, { logger: () => {} });
  try {
    const results = [];
    for (const page of pages) {
      const { data } = await worker.recognize(page.bytes);
      results.push({
        page: page.name,
        text: data.text,
        confidence: data.confidence,
        wordBoxes: (data.words || []).map((w) => ({ text: w.text, bbox: w.bbox, confidence: w.confidence }))
      });
    }
    return results;
  } finally {
    await worker.terminate();
  }
}
