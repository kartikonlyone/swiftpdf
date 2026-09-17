import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import PageOpsTool from "@/components/tools/PageOpsTool";

export const metadata = buildMetadata({
  title: "Organize PDF – Reorder Pages Free | SwiftPDF",
  description: "Reorder the pages of a PDF into any sequence you choose.",
  path: "/organize-pdf"
});

export default function OrganizePdfPage() {
  return (
    <ToolPageShell
      toolKey="organize-pdf"
      title="Organize PDF"
      intro="Put your PDF's pages in a new order."
      path="/organize-pdf"
      howTo={["Upload your PDF file.", "Enter the new page order, e.g. 3,1,2,4.", "Click Organize PDF and download the result."]}
      benefits={["Fix pages that were scanned out of order.", "Reassemble a document without external software.", "Drop pages you don't want by leaving them out of the list."]}
      faq={[{ question: "What happens to pages I leave out of the list?", answer: "Any page number you don't include is removed from the result." }]}
    >
      <PageOpsTool operation="organize" toolKey="organize-pdf" actionLabel="Organize PDF" fieldLabel="New page order (e.g. 3,1,2,4)" />
    </ToolPageShell>
  );
}
