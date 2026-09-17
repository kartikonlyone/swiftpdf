import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import MergeTool from "@/components/tools/MergeTool";

export const metadata = buildMetadata({
  title: "Merge PDF Online – Combine PDF Files Free | SwiftPDF",
  description: "Combine two or more PDF files into a single document online. Drag, reorder, and merge — free and fast.",
  path: "/merge-pdf"
});

const FAQ = [
  { question: "Is there a limit to how many PDFs I can merge?", answer: "You can merge as many files as you like in one session, each up to 50MB." },
  { question: "Will the page order be preserved?", answer: "Yes — files merge in the exact order shown in the upload list, which you can reorder with the arrows." },
  { question: "Does SwiftPDF keep a copy of my files?", answer: "No. Files are processed in memory and are not stored after your merged PDF is returned." }
];

export default function MergePdfPage() {
  return (
    <ToolPageShell
      toolKey="merge-pdf"
      title="Merge PDF Online"
      intro="Combine multiple PDF files into one document, in the order you choose."
      path="/merge-pdf"
      howTo={[
        "Upload two or more PDF files.",
        "Reorder them using the up and down arrows.",
        "Click Merge PDF and your combined file downloads automatically."
      ]}
      benefits={[
        "Combine reports, scans, or chapters into a single file.",
        "No installation — everything runs in your browser session.",
        "Original page order and formatting are preserved."
      ]}
      faq={FAQ}
    >
      <MergeTool />
    </ToolPageShell>
  );
}
