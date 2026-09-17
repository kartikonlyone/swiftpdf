import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import PageOpsTool from "@/components/tools/PageOpsTool";

export const metadata = buildMetadata({
  title: "Extract PDF Pages Free Online | SwiftPDF",
  description: "Pull specific pages out of a PDF into a new file.",
  path: "/extract-pdf-pages"
});

export default function ExtractPdfPagesPage() {
  return (
    <ToolPageShell
      toolKey="extract-pdf-pages"
      title="Extract PDF Pages"
      intro="Create a new PDF from just the pages you need."
      path="/extract-pdf-pages"
      howTo={["Upload your PDF file.", "Enter the page numbers to extract, e.g. 1,4,7.", "Click Extract Pages and download the result."]}
      benefits={["Pull out a chapter or section from a longer document.", "Keeps the pages in the order you list them.", "Original file is untouched."]}
      faq={[{ question: "Can I extract the same page twice?", answer: "Yes — list a page number more than once to duplicate it in the output." }]}
    >
      <PageOpsTool operation="extract" toolKey="extract-pdf-pages" actionLabel="Extract Pages" fieldLabel="Pages to extract (e.g. 1,4,7)" />
    </ToolPageShell>
  );
}
