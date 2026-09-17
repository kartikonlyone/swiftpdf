export default function manifest() {
  return {
    name: "SwiftPDF",
    short_name: "SwiftPDF",
    description: "Fast, Simple PDF Tools for Everyone",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#004D40",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
