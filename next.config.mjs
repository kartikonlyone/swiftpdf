/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      // Only added when actually set — an empty/undefined hostname here
      // would otherwise print an "Invalid remotePattern" warning on every
      // build and dev server start.
      ...(process.env.MEDIA_PUBLIC_HOST
        ? [{ protocol: "https", hostname: process.env.MEDIA_PUBLIC_HOST }]
        : [])
    ]
  },
  async redirects() {
    return [
      // Legacy-style index URLs — this app never generates .html/.php
      // files, but some SEO crawlers specifically check that these paths
      // don't 404, and instead point back at the real homepage.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
        ]
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, noarchive, nofollow" }
        ]
      },
      {
        source: "/dashboard/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, noarchive" }
        ]
      }
    ];
  }
};

export default nextConfig;
