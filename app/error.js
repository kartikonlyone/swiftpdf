"use client";

import Link from "next/link";

export default function GlobalError({ reset }) {
  return (
    <html>
      <body>
        <main style={{ maxWidth: 480, margin: "6rem auto", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ color: "#666", marginTop: 8 }}>An unexpected error occurred. You can try again or head back home.</p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => reset()} style={{ padding: "10px 20px", background: "#004D40", color: "white", borderRadius: 8, border: "none" }}>
              Try again
            </button>
            <Link href="/" style={{ padding: "10px 20px", border: "1px solid #ccc", borderRadius: 8 }}>Go home</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
