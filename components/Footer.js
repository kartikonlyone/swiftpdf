import Link from "next/link";

const COLUMNS = [
  {
    heading: "PDF Tools",
    links: [
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Split PDF", href: "/split-pdf" },
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Rotate PDF", href: "/rotate-pdf" },
      { label: "All tools", href: "/pdf-tools" }
    ]
  },
  {
    heading: "Convert",
    links: [
      { label: "PDF to Word", href: "/pdf-to-word" },
      { label: "Word to PDF", href: "/word-to-pdf" },
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
      { label: "JPG to PDF", href: "/jpg-to-pdf" }
    ]
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Security", href: "/security" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie-policy" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white/70">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-6">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2" aria-label="SwiftPDF home">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="4" y="3" width="19" height="26" rx="3" fill="#FAFAF8" />
              <path d="M23 3l6 6h-6V3z" fill="#0B6B5C" />
              <path d="M9 21l4-9 3 6 3-4 4 7" stroke="#004D40" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span className="font-display text-lg font-semibold text-white">SwiftPDF</span>
          </Link>
          <p className="mt-3 max-w-[220px] text-sm text-white/50">
            Fast, simple PDF tools — merge, convert, compress, sign, and more, right in your browser.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h3 className="text-sm font-semibold text-white">{col.heading}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} SwiftPDF. Fast, simple PDF tools for everyone.
      </div>
    </footer>
  );
}
