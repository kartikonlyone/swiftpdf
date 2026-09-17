import { NextResponse } from "next/server";
import JSZip from "jszip";
import { splitPdf } from "@/services/pdf/split";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "split-pdf"));
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  const startedAt = Date.now();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const mode = formData.get("mode") || "every-page";
    const ranges = formData.get("ranges") || "";

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const outputs = await splitPdf(buffer, { mode, ranges });

    const zip = new JSZip();
    for (const output of outputs) zip.file(output.name, output.bytes);
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    await recordUsage("split-pdf", true, Date.now() - startedAt).catch(() => {});

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="split-pages.zip"',
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    await recordUsage("split-pdf", false, Date.now() - startedAt).catch(() => {});
    return NextResponse.json({ error: err.message || "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
