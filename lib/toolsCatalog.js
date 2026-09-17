// Static fallback catalog — the source of truth in production is the `Tool`
// table (editable from Admin > Tools without a redeploy). This file seeds
// that table and is used for prisma/seed.js and for local dev before the DB
// is migrated.

export const TOOLS = [
  { key: "merge-pdf", name: "Merge PDF", path: "/merge-pdf", description: "Combine PDF files in the order you want.", group: "organize" },
  { key: "split-pdf", name: "Split PDF", path: "/split-pdf", description: "Extract pages or split a PDF into parts.", group: "organize" },
  { key: "compress-pdf", name: "Compress PDF", path: "/compress-pdf", description: "Reduce file size while keeping quality.", group: "optimize" },
  { key: "rotate-pdf", name: "Rotate PDF", path: "/rotate-pdf", description: "Fix sideways or upside-down pages.", group: "organize" },
  { key: "organize-pdf", name: "Organize PDF", path: "/organize-pdf", description: "Reorder, add, or remove pages.", group: "organize" },
  { key: "delete-pdf-pages", name: "Delete PDF Pages", path: "/delete-pdf-pages", description: "Remove unwanted pages from a PDF.", group: "organize" },
  { key: "extract-pdf-pages", name: "Extract PDF Pages", path: "/extract-pdf-pages", description: "Pull specific pages into a new file.", group: "organize" },
  { key: "pdf-to-word", name: "PDF to Word", path: "/pdf-to-word", description: "Convert PDF files into editable Word documents.", group: "convert" },
  { key: "word-to-pdf", name: "Word to PDF", path: "/word-to-pdf", description: "Convert Word documents into PDF.", group: "convert" },
  { key: "pdf-to-jpg", name: "PDF to JPG", path: "/pdf-to-jpg", description: "Turn PDF pages into JPG images.", group: "convert" },
  { key: "jpg-to-pdf", name: "JPG to PDF", path: "/jpg-to-pdf", description: "Combine JPG images into one PDF.", group: "convert" },
  { key: "pdf-to-png", name: "PDF to PNG", path: "/pdf-to-png", description: "Turn PDF pages into PNG images.", group: "convert" },
  { key: "png-to-pdf", name: "PNG to PDF", path: "/png-to-pdf", description: "Combine PNG images into one PDF.", group: "convert" },
  { key: "pdf-to-excel", name: "PDF to Excel", path: "/pdf-to-excel", description: "Convert PDF tables into Excel spreadsheets.", group: "convert" },
  { key: "excel-to-pdf", name: "Excel to PDF", path: "/excel-to-pdf", description: "Convert spreadsheets into PDF.", group: "convert" },
  { key: "pdf-to-powerpoint", name: "PDF to PowerPoint", path: "/pdf-to-powerpoint", description: "Convert PDF slides into PowerPoint.", group: "convert" },
  { key: "powerpoint-to-pdf", name: "PowerPoint to PDF", path: "/powerpoint-to-pdf", description: "Convert presentations into PDF.", group: "convert" },
  { key: "edit-pdf", name: "Edit PDF", path: "/edit-pdf", description: "Add text, images, and shapes to a PDF.", group: "edit" },
  { key: "sign-pdf", name: "Sign PDF", path: "/sign-pdf", description: "Add a typed, drawn, or uploaded signature.", group: "edit" },
  { key: "watermark-pdf", name: "Watermark PDF", path: "/watermark-pdf", description: "Stamp text across every page.", group: "edit" },
  { key: "add-page-numbers-to-pdf", name: "Add Page Numbers", path: "/add-page-numbers-to-pdf", description: "Number every page automatically.", group: "edit" },
  { key: "protect-pdf", name: "Protect PDF", path: "/protect-pdf", description: "Add a password and set permissions.", group: "security" },
  { key: "unlock-pdf", name: "Unlock PDF", path: "/unlock-pdf", description: "Remove a password you have the right to remove.", group: "security" },
  { key: "ocr-pdf", name: "OCR PDF", path: "/ocr-pdf", description: "Make scanned PDFs searchable.", group: "security" },
  { key: "repair-pdf", name: "Repair PDF", path: "/repair-pdf", description: "Attempt to fix a damaged PDF file.", group: "security" }
];

export function getToolByKey(key) {
  return TOOLS.find((t) => t.key === key);
}

export function relatedTools(key, count = 4) {
  const current = getToolByKey(key);
  if (!current) return TOOLS.slice(0, count);
  return TOOLS.filter((t) => t.group === current.group && t.key !== key).slice(0, count);
}
