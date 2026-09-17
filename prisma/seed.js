// Seeds the Tool table from the static catalog and creates a default
// Super Admin so you can log into /admin immediately after first deploy.
//
// Run: npm run seed
// (Change the default admin password immediately after first login.)

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const TOOLS = [
  { key: "merge-pdf", name: "Merge PDF", path: "/merge-pdf", description: "Combine PDF files in the order you want." },
  { key: "split-pdf", name: "Split PDF", path: "/split-pdf", description: "Extract pages or split a PDF into parts." },
  { key: "compress-pdf", name: "Compress PDF", path: "/compress-pdf", description: "Reduce file size while keeping quality." },
  { key: "rotate-pdf", name: "Rotate PDF", path: "/rotate-pdf", description: "Fix sideways or upside-down pages." },
  { key: "organize-pdf", name: "Organize PDF", path: "/organize-pdf", description: "Reorder, add, or remove pages." },
  { key: "delete-pdf-pages", name: "Delete PDF Pages", path: "/delete-pdf-pages", description: "Remove unwanted pages from a PDF." },
  { key: "extract-pdf-pages", name: "Extract PDF Pages", path: "/extract-pdf-pages", description: "Pull specific pages into a new file." },
  { key: "pdf-to-word", name: "PDF to Word", path: "/pdf-to-word", description: "Convert PDF files into editable Word documents." },
  { key: "word-to-pdf", name: "Word to PDF", path: "/word-to-pdf", description: "Convert Word documents into PDF." },
  { key: "pdf-to-jpg", name: "PDF to JPG", path: "/pdf-to-jpg", description: "Turn PDF pages into JPG images." },
  { key: "jpg-to-pdf", name: "JPG to PDF", path: "/jpg-to-pdf", description: "Combine JPG images into one PDF." },
  { key: "pdf-to-png", name: "PDF to PNG", path: "/pdf-to-png", description: "Turn PDF pages into PNG images." },
  { key: "png-to-pdf", name: "PNG to PDF", path: "/png-to-pdf", description: "Combine PNG images into one PDF." },
  { key: "pdf-to-excel", name: "PDF to Excel", path: "/pdf-to-excel", description: "Convert PDF tables into Excel spreadsheets." },
  { key: "excel-to-pdf", name: "Excel to PDF", path: "/excel-to-pdf", description: "Convert spreadsheets into PDF." },
  { key: "pdf-to-powerpoint", name: "PDF to PowerPoint", path: "/pdf-to-powerpoint", description: "Convert PDF slides into PowerPoint." },
  { key: "powerpoint-to-pdf", name: "PowerPoint to PDF", path: "/powerpoint-to-pdf", description: "Convert presentations into PDF." },
  { key: "edit-pdf", name: "Edit PDF", path: "/edit-pdf", description: "Add text to a PDF." },
  { key: "sign-pdf", name: "Sign PDF", path: "/sign-pdf", description: "Add a typed, drawn, or uploaded signature." },
  { key: "watermark-pdf", name: "Watermark PDF", path: "/watermark-pdf", description: "Stamp text across every page." },
  { key: "add-page-numbers-to-pdf", name: "Add Page Numbers", path: "/add-page-numbers-to-pdf", description: "Number every page automatically." },
  { key: "protect-pdf", name: "Protect PDF", path: "/protect-pdf", description: "Add a password and set permissions." },
  { key: "unlock-pdf", name: "Unlock PDF", path: "/unlock-pdf", description: "Remove a password you have the right to remove." },
  { key: "ocr-pdf", name: "OCR PDF", path: "/ocr-pdf", description: "Make scanned PDFs searchable." },
  { key: "repair-pdf", name: "Repair PDF", path: "/repair-pdf", description: "Attempt to fix a damaged PDF file." }
];

async function main() {
  for (const tool of TOOLS) {
    await prisma.tool.upsert({
      where: { key: tool.key },
      create: tool,
      update: { name: tool.name, path: tool.path, description: tool.description }
    });
  }
  console.log(`Seeded ${TOOLS.length} tools.`);

  const superAdminEmail = process.env.SEED_ADMIN_EMAIL || "admin@swiftpdf.example";
  const superAdminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await prisma.adminUser.findUnique({ where: { email: superAdminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(superAdminPassword, 12);
    await prisma.adminUser.create({
      data: { name: "Super Admin", email: superAdminEmail, passwordHash, role: "SUPER_ADMIN" }
    });
    console.log(`Created Super Admin: ${superAdminEmail} / ${superAdminPassword} — change this password immediately.`);
  } else {
    console.log("Super Admin already exists, skipping.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
