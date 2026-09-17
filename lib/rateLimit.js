// Minimal in-memory sliding-window rate limiter for single-instance deploys.
// For multi-instance production deployments, swap this for a Redis-backed
// limiter (e.g. Upstash Ratelimit) — the call signature below is designed
// to drop in a replacement without touching call sites.

const buckets = new Map();

export function rateLimit(key, {
  max = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 20,
  windowSeconds = Number(process.env.RATE_LIMIT_WINDOW_SECONDS) || 60
} = {}) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const bucket = buckets.get(key) || [];

  const recent = bucket.filter((ts) => now - ts < windowMs);
  recent.push(now);
  buckets.set(key, recent);

  return {
    allowed: recent.length <= max,
    remaining: Math.max(0, max - recent.length),
    resetInSeconds: windowSeconds
  };
}

export function clientKeyFromRequest(request, prefix = "rl") {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return `${prefix}:${ip}`;
}
