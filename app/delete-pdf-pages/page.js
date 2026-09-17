import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import PageOpsTool from "@/components/tools/PageOpsTool";

export const metadata = buildMetadata({
  title: "Delete PDF Pages Free Online | SwiftPDF",
  description: "Remove specific pages from a PDF file.",
  path: "/delete-pdf-pages"
});

export default function DeletePdfPagesPage() {
  return (
    <ToolPageShell
      toolKey="delete-pdf-pages"
      title="Delete PDF Pages"
      intro="Remove pages you don't need from a PDF."
      path="/delete-pdf-pages"
      howTo={["Upload your PDF file.", "Enter the page numbers to delete, e.g. 2,5.", "Click Delete Pages and download the result."]}
      benefits={["Remove blank or unwanted scanned pages.", "Keeps remaining pages in their original order.", "No page limit."]}
      faq={[{ question: "Can I delete every page?", answer: "No — at least one page must remain in the resulting document." }]}
    >
      <PageOpsTool operation="delete" toolKey="delete-pdf-pages" actionLabel="Delete Pages" fieldLabel="Pages to delete (e.g. 2,5)" />
    </ToolPageShell>
  );
}
