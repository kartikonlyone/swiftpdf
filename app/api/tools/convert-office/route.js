import { NextResponse } from "next/server";
import { convertViaWorker, officeConversionStatus, ConversionWorkerNotConfiguredError } from "@/services/pdf/officeConvert";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TARGETS = new Set(["pdf", "docx", "xlsx", "pptx"]);

export async function GET() {
  // Lets the frontend show a real "not configured" banner before the user
  // even uploads a file.
  return NextResponse.json(officeConversionStatus());
}

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "office-convert"));
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
  }

  const startedAt = Date.now();
  const formData = await request.formData();
  const file = formData.get("file");
  const targetFormat = formData.get("targetFormat");
  const toolKey = formData.get("toolKey") || "office-convert";

  if (!file) {
    return NextResponse.json({ error: "Please upload a file." }, { status: 400 });
  }
  if (!ALLOWED_TARGETS.has(targetFormat)) {
    return NextResponse.json({ error: "Unsupported target format." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const converted = await convertViaWorker(buffer, file.name, targetFormat);

    await recordUsage(toolKey, true, Date.now() - startedAt).catch(() => {});

    return new NextResponse(converted, {
      status: 200,
      headers: {
        "Content-Type": mimeFor(targetFormat),
        "Content-Disposition": `attachment; filename="converted.${targetFormat}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    await recordUsage(toolKey, false, Date.now() - startedAt).catch(() => {});
    if (err instanceof ConversionWorkerNotConfiguredError) {
      return NextResponse.json({ error: err.message, code: "NOT_CONFIGURED" }, { status: 501 });
    }
    return NextResponse.json({ error: err.message || "Conversion failed." }, { status: 500 });
  }
}

function mimeFor(format) {
  return {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  }[format];
}

async function recordUsage(toolKey, succeeded, durationMs) {
  const tool = await prisma.tool.findUnique({ where: { key: toolKey } });
  if (!tool) return;
  await prisma.toolUsage.create({ data: { toolId: tool.id, succeeded, durationMs } });
}
