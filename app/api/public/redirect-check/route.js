import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Returns the FULL active redirect list in one call, so middleware.js can
// cache it in memory for ~60s instead of hitting this route (and the
// database behind it) on every single page navigation. Fetching per-path,
// per-request was adding a full extra network round-trip to every page
// load — the earlier version of this route did that and was a real
// performance regression.
export async function GET() {
  const redirects = await prisma.redirect
    .findMany({ where: { isActive: true }, select: { fromPath: true, toPath: true, type: true } })
    .catch(() => []);

  return NextResponse.json({ redirects }, { headers: { "Cache-Control": "no-store" } });
}
