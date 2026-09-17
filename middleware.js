import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// --- Admin-managed redirects (Admin > Redirects) -----------------------
// Middleware runs on the Edge runtime and can't use Prisma directly, so the
// active redirect list is fetched from a small Node.js API route instead —
// but only once every REDIRECT_CACHE_TTL_MS, not on every request. The
// earlier version of this file fetched on every single page load, which
// added a full extra network + database round-trip to every navigation and
// was the main cause of the site feeling slow. This module-level cache
// persists for the lifetime of the Edge isolate, so in practice most
// requests cost zero extra round-trips.
const REDIRECT_CACHE_TTL_MS = 60_000;
let redirectCache = { map: new Map(), fetchedAt: 0 };
let inFlightFetch = null;

async function getRedirectMap(origin) {
  const isFresh = Date.now() - redirectCache.fetchedAt < REDIRECT_CACHE_TTL_MS;
  if (isFresh) return redirectCache.map;

  // Avoid a thundering herd of parallel requests all refetching at once.
  if (!inFlightFetch) {
    inFlightFetch = fetch(new URL("/api/public/redirect-check", origin), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const map = new Map((data.redirects || []).map((r) => [r.fromPath, r]));
        redirectCache = { map, fetchedAt: Date.now() };
        return map;
      })
      .catch(() => redirectCache.map) // keep serving the last-known-good list on failure
      .finally(() => {
        inFlightFetch = null;
      });
  }
  return inFlightFetch;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // --- Admin auth gate --------------------------------------------------
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.userType !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // --- Public redirects ---------------------------------------------------
  if (!pathname.startsWith("/api") && !pathname.startsWith("/_next") && !isStaticAsset(pathname)) {
    const map = await getRedirectMap(request.url);
    const redirect = map.get(pathname);
    if (redirect) {
      const target = new URL(redirect.toPath, request.url);
      return NextResponse.redirect(target, redirect.type === "PERMANENT" ? 308 : 307);
    }
  }

  return NextResponse.next();
}

function isStaticAsset(pathname) {
  return /\.(png|jpg|jpeg|svg|ico|css|js|txt|xml|webmanifest)$/.test(pathname);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
