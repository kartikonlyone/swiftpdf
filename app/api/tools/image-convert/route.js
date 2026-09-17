import { NextResponse } from "next/server";
import { imagesToPdf, pdfToImages, GhostscriptNotAvailableError } from "@/services/pdf/imageConvert";
import JSZip from "jszip";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "image-convert"));
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  const startedAt = Date.now();
  const formData = await request.formData();
  const direction = formData.get("direction"); // "to-pdf" | "from-pdf"
  const format = formData.get("format") || "jpg"; // used for "from-pdf"
  const toolKey = formData.get("toolKey") || "image-convert";

  try {
    if (direction === "to-pdf") {
      const files = formData.getAll("files");
      if (!files || files.length === 0) {
        return NextResponse.json({ error: "Please upload at least one image." }, { status: 400 });
      }
      const images = [];
      for (const file of files) {
        images.push({ buffer: Buffer.from(await file.arrayBuffer()), mimeType: file.type });
      }
      const pdfBytes = await imagesToPdf(images);

      await recordUsage(toolKey, true, Date.now() - startedAt).catch(() => {});
      return new NextResponse(Buffer.from(pdfBytes), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="converted.pdf"',
          "Cache-Control": "no-store"
        }
      });
    }

    if (direction === "from-pdf") {
      const file = formData.get("file");
      if (!file || file.type !== "application/pdf") {
        return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const pages = await pdfToImages(buffer, { format });

      const zip = new JSZip();
      for (const page of pages) zip.file(page.name, page.bytes);
      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

      await recordUsage(toolKey, true, Date.now() - startedAt).catch(() => {});
      return new NextResponse(zipBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": 'attachment; filename="pages.zip"',
          "Cache-Control": "no-store"
        }
      });
    }

    return NextResponse.json({ error: "Unknown conversion direction." }, { status: 400 });
  } catch (err) {
    await recordUsage(toolKey, false, Date.now() - startedAt).catch(() => {});
    if (err instanceof GhostscriptNotAvailableError) {
      return NextResponse.json({ error: err.message, code: "NOT_CONFIGURED" }, { status: 501 });
    }
    return NextResponse.json({ error: err.message || "Conversion failed." }, { status: 500 });
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
