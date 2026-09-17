import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoJsonLd from "@/components/SeoJsonLd";
import { breadcrumbJsonLd, faqJsonLd, softwareApplicationJsonLd } from "@/lib/seo";
import { relatedTools } from "@/lib/toolsCatalog";
import Link from "next/link";

/**
 * Shared shell for every tool page: breadcrumbs, H1, structured data,
 * FAQ, and related-tools internal linking — so every /xxx-pdf page ships
 * with the SEO content the spec requires without duplicating markup.
 */
export default function ToolPageShell({
  toolKey,
  title,
  intro,
  children,
  howTo,
  benefits,
  faq = [],
  path
}) {
  const related = relatedTools(toolKey);

  return (
    <>
      <Header />
      <SeoJsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "PDF Tools", path: "/pdf-tools" }, { name: title, path }]),
          softwareApplicationJsonLd({ name: title, path, description: intro }),
          faqJsonLd(faq)
        ].filter(Boolean)}
      />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-ink/45">
          <Link href="/" className="hover:text-brand">Home</Link> /{" "}
          <Link href="/pdf-tools" className="hover:text-brand">PDF Tools</Link> / <span className="text-ink/70">{title}</span>
        </nav>

        <div className="mt-4 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">{title}</h1>
          <p className="mx-auto mt-2 max-w-lg text-ink/55">{intro}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm shadow-ink/[0.03] sm:p-8">
          {children}
        </div>

        {howTo && howTo.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold text-ink">How it works</h2>
            <ol className="mt-5 grid gap-4 sm:grid-cols-3">
              {howTo.map((step, i) => (
                <li key={i} className="rounded-card border border-ink/10 bg-white p-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-tint font-display text-sm font-semibold text-brand">
                    {i + 1}
                  </span>
                  <p className="mt-3 text-sm text-ink/65">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {benefits && benefits.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">Why use this tool</h2>
            <ul className="mt-4 space-y-2.5">
              {benefits.map((b, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink/65">
                  <span className="mt-0.5 text-brand" aria-hidden="true">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </section>
        )}

        {faq.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">Frequently asked questions</h2>
            <dl className="mt-4 space-y-5">
              {faq.map((item, i) => (
                <div key={i}>
                  <dt className="font-medium text-ink">{item.question}</dt>
                  <dd className="mt-1 text-sm text-ink/60">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-10 border-t border-ink/10 pt-8">
            <h2 className="font-display text-lg font-semibold text-ink">Related tools</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {related.map((tool) => (
                <Link
                  key={tool.key}
                  href={tool.path}
                  className="rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink/70 hover:border-brand hover:text-brand"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
