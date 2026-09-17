import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { TOOLS } from "@/lib/toolsCatalog";
import { GROUP_ICONS } from "@/components/icons/ToolIcons";

const FEATURED_KEYS = [
  "merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word", "word-to-pdf",
  "pdf-to-jpg", "jpg-to-pdf", "edit-pdf", "sign-pdf", "protect-pdf",
  "ocr-pdf", "rotate-pdf"
];

const WHY = [
  {
    title: "Fast",
    body: "PDF tools run in seconds, not minutes — no waiting on a queue.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    )
  },
  {
    title: "Simple",
    body: "Every tool is one page, one job. Upload, choose an option, download.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" /><path d="M8.5 12l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    )
  },
  {
    title: "Secure",
    body: "Files are stored temporarily and deleted automatically after processing.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    )
  }
];

const HOW = [
  { step: "Choose a tool", body: "Pick the PDF task you need from the tools page." },
  { step: "Upload your file", body: "Drag and drop, or browse from your device." },
  { step: "Download the result", body: "Your processed file is ready to save immediately." }
];

const TRUST_CHIPS = ["No signup required", "Files auto-deleted", "Works on mobile", "Free to start"];

export default function HomePage() {
  const featured = TOOLS.filter((t) => FEATURED_KEYS.includes(t.key));

  return (
    <>
      <Header />
      <main>
        {/* HERO ------------------------------------------------------- */}
        <section className="relative overflow-hidden">
          <div className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 text-center md:pt-28">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-tint px-4 py-1.5 text-xs font-semibold text-brand">
              25 PDF tools · one site
            </span>

            <h1 className="animate-fade-up mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-ink md:text-6xl" style={{ animationDelay: "60ms" }}>
              All your PDF tools.{" "}
              <span className="italic text-brand">Fast, simple,</span> online.
            </h1>

            <p className="animate-fade-up mx-auto mt-5 max-w-xl text-lg text-ink/60" style={{ animationDelay: "120ms" }}>
              Merge, split, compress, convert, edit, sign and manage PDF files —
              no installs, no account required to get started.
            </p>

            <div className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "180ms" }}>
              <Link href="/pdf-tools" className="group inline-flex items-center gap-2 rounded-card bg-brand px-6 py-3 font-semibold text-white shadow-lg shadow-brand/20 transition-transform hover:-translate-y-0.5 hover:bg-brand-dark">
                Explore PDF Tools
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link href="/compress-pdf" className="rounded-card border border-ink/15 bg-white px-6 py-3 font-semibold text-ink transition-colors hover:border-brand hover:text-brand">
                Compress a PDF
              </Link>
            </div>

            <ul className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-ink/45" style={{ animationDelay: "240ms" }}>
              {TRUST_CHIPS.map((chip) => (
                <li key={chip} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-brand/60" aria-hidden="true" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* POPULAR TOOLS ----------------------------------------------- */}
        <section aria-labelledby="popular-tools" className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand/70">Get started</p>
              <h2 id="popular-tools" className="mt-1 font-display text-2xl font-semibold text-ink md:text-3xl">
                Popular PDF tools
              </h2>
            </div>
            <Link href="/pdf-tools" className="hidden text-sm font-semibold text-brand hover:underline sm:block">
              See all 25 tools →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((tool) => {
              const Icon = GROUP_ICONS[tool.group] || GROUP_ICONS.organize;
              return (
                <ToolCard key={tool.key} name={tool.name} description={tool.description} href={tool.path} group={tool.group} icon={<Icon />} />
              );
            })}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/pdf-tools" className="text-sm font-semibold text-brand hover:underline">
              See all 25 tools →
            </Link>
          </div>
        </section>

        {/* WHY ----------------------------------------------------------- */}
        <section aria-labelledby="why-swiftpdf" className="border-y border-ink/5 bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 id="why-swiftpdf" className="text-center font-display text-2xl font-semibold text-ink md:text-3xl">
              Why SwiftPDF
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {WHY.map((item) => (
                <div key={item.title} className="text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                    {item.icon}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS ---------------------------------------------------- */}
        <section aria-labelledby="how-it-works" className="mx-auto max-w-6xl px-6 py-16">
          <h2 id="how-it-works" className="text-center font-display text-2xl font-semibold text-ink md:text-3xl">
            How SwiftPDF works
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {HOW.map((item, i) => (
              <li key={item.step} className="relative rounded-card border border-ink/10 bg-white p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand font-display text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display font-semibold text-ink">{item.step}</h3>
                <p className="mt-1.5 text-sm text-ink/55">{item.body}</p>
                {i < HOW.length - 1 && (
                  <span className="absolute right-[-14px] top-1/2 hidden -translate-y-1/2 text-xl text-ink/15 md:block" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* FINAL CTA --------------------------------------------------- */}
        <section className="relative overflow-hidden bg-brand py-16 text-center">
          <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.08] [filter:invert(1)]" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl px-6">
            <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
              Ready to get your PDF work done?
            </h2>
            <p className="mt-2 text-brand-tint/80">No account needed to try it — pick a tool and go.</p>
            <Link
              href="/pdf-tools"
              className="mt-6 inline-block rounded-card bg-white px-6 py-3 font-semibold text-brand shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-white/90"
            >
              Explore PDF Tools
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
