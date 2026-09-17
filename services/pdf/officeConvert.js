/**
 * Office <-> PDF conversion (Word/Excel/PowerPoint) genuinely requires a
 * rendering engine — there is no reliable pure-JS way to do this inside the
 * Next.js runtime. The correct architecture (and what this module implements)
 * is a small internal worker service running LibreOffice in headless mode,
 * which this app calls over HTTP:
 *
 *   Next.js API route --> CONVERSION_WORKER_URL (LibreOffice headless) --> result
 *
 * A minimal worker looks like:
 *   POST /convert  { file, targetFormat }
 *   -> soffice --headless --convert-to <targetFormat> --outdir /tmp <file>
 *
 * This keeps LibreOffice (a large, non-serverless-friendly binary) off the
 * Next.js deployment and lets it scale independently. If the worker isn't
 * configured, this throws — the API route surfaces a clear
 * "Configure Integration" response instead of a fake converted file.
 */

export class ConversionWorkerNotConfiguredError extends Error {
  constructor() {
    super("Office document conversion requires CONVERSION_WORKER_URL to be configured.");
    this.name = "ConversionWorkerNotConfiguredError";
  }
}

function isConfigured() {
  return Boolean(process.env.CONVERSION_WORKER_URL);
}

export function officeConversionStatus() {
  return { configured: isConfigured(), workerUrl: isConfigured() ? process.env.CONVERSION_WORKER_URL : null };
}

/**
 * @param {Buffer} buffer - source file bytes
 * @param {string} sourceFilename - original filename, extension matters to LibreOffice
 * @param {string} targetFormat - "pdf" | "docx" | "xlsx" | "pptx"
 */
export async function convertViaWorker(buffer, sourceFilename, targetFormat) {
  if (!isConfigured()) throw new ConversionWorkerNotConfiguredError();

  const form = new FormData();
  form.append("file", new Blob([buffer]), sourceFilename);
  form.append("targetFormat", targetFormat);

  const response = await fetch(`${process.env.CONVERSION_WORKER_URL}/convert`, {
    method: "POST",
    headers: process.env.CONVERSION_WORKER_TOKEN
      ? { Authorization: `Bearer ${process.env.CONVERSION_WORKER_TOKEN}` }
      : undefined,
    body: form
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Conversion worker failed (${response.status}): ${detail}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
