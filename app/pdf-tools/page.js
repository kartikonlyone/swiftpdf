import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import SeoJsonLd from "@/components/SeoJsonLd";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { TOOLS } from "@/lib/toolsCatalog";
import { GROUP_ICONS } from "@/components/icons/ToolIcons";

export const metadata = buildMetadata({
  title: "PDF Tools — Merge, Split, Compress & Convert | SwiftPDF",
  description: "Browse every SwiftPDF tool: merge, split, compress, convert, edit, sign, and secure PDF files online, free.",
  path: "/pdf-tools"
});

const GROUPS = [
  { key: "organize", label: "Organize PDF", blurb: "Reorder, split, merge, and rearrange pages." },
  { key: "convert", label: "PDF conversion", blurb: "Move between PDF, Word, Excel, PowerPoint, and images." },
  { key: "edit", label: "Edit & sign", blurb: "Add text, watermarks, page numbers, and signatures." },
  { key: "optimize", label: "Optimize", blurb: "Shrink file size without losing quality." },
  { key: "security", label: "Security & repair", blurb: "Lock, unlock, scan, and fix damaged files." }
];

export default function PdfToolsPage() {
  return (
    <>
      <Header />
      <SeoJsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "PDF Tools", path: "/pdf-tools" }])} />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-ink/50">
          <a href="/" className="hover:text-brand">Home</a> / PDF Tools
        </nav>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">All PDF Tools</h1>
        <p className="mt-2 max-w-xl text-ink/60">
          Every tool runs on demand and processes real files — nothing here is pre-generated or faked.
        </p>

        {GROUPS.map((group) => {
          const tools = TOOLS.filter((t) => t.group === group.key);
          if (tools.length === 0) return null;
          const Icon = GROUP_ICONS[group.key];
          return (
            <section key={group.key} className="mt-12 first:mt-10">
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-xl font-semibold text-ink">{group.label}</h2>
                <span className="text-sm text-ink/40">{group.blurb}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {tools.map((tool) => (
                  <ToolCard key={tool.key} name={tool.name} description={tool.description} href={tool.path} group={tool.group} icon={<Icon />} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
