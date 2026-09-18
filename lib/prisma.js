import { PrismaClient } from "@prisma/client";

// Prevent multiple Prisma Client instances in dev (Next.js hot reload).
const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });
}

// IMPORTANT: the real PrismaClient is constructed lazily, on first actual
// property access — never at module import time.
//
// Next.js's build step imports every route/page module (including this one,
// transitively, via lib/auth.js -> the NextAuth route) to "collect page
// data" — this happens during `next build` itself, before any request ever
// arrives. `new PrismaClient()` validates that DATABASE_URL is resolvable
// the instant it's constructed and throws immediately if not, which used to
// crash the build here even when DATABASE_URL was correctly set for
// runtime (e.g. Vercel env vars marked "Sensitive" are withheld from the
// build step and only injected into the actual serverless function at
// request time).
//
// Wrapping the client in a Proxy means importing this module does nothing
// but create a cheap placeholder object; the real PrismaClient — and the
// env var it needs — is only touched the first time a query actually runs,
// which is always at real request time, long after the build has finished.
export const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
      }
      return globalForPrisma.prisma[prop];
    }
  }
);
