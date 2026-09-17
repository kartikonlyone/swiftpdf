import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import SplitTool from "@/components/tools/SplitTool";

export const metadata = buildMetadata({
  title: "Split PDF Online – Extract or Divide PDF Pages | SwiftPDF",
  description: "Split a PDF into separate files by page range, or break every page into its own PDF. Free and fast.",
  path: "/split-pdf"
});

const FAQ = [
  { question: "Can I extract just a few pages?", answer: "Yes — choose \"Extract specific page ranges\" and enter something like 1-3,5,7-9." },
  { question: "What do I get back?", answer: "A ZIP file containing each resulting PDF, ready to download." }
];

export default function SplitPdfPage() {
  return (
    <ToolPageShell
      toolKey="split-pdf"
      title="Split PDF Online"
      intro="Break a PDF apart by page range, or split every page into its own file."
      path="/split-pdf"
      howTo={[
        "Upload the PDF you want to split.",
        "Choose to split every page, or enter specific page ranges.",
        "Download a ZIP file with the resulting PDFs."
      ]}
      benefits={[
        "Pull out just the pages you need from a longer document.",
        "Turn a scanned bundle into individual files.",
        "No page limit on the source document."
      ]}
      faq={FAQ}
    >
      <SplitTool />
    </ToolPageShell>
  );
}
