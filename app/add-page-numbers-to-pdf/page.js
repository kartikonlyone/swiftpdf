import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import PageOpsTool from "@/components/tools/PageOpsTool";

export const metadata = buildMetadata({
  title: "Add Page Numbers to PDF Free | SwiftPDF",
  description: "Number every page of a PDF automatically.",
  path: "/add-page-numbers-to-pdf"
});

export default function AddPageNumbersPage() {
  return (
    <ToolPageShell
      toolKey="add-page-numbers-to-pdf"
      title="Add Page Numbers"
      intro="Automatically number every page of your PDF."
      path="/add-page-numbers-to-pdf"
      howTo={["Upload your PDF file.", "Choose where the numbers should appear.", "Click Add Page Numbers and download the result."]}
      benefits={["Prepare documents for printing or binding.", "Consistent numbering across every page.", "Choose bottom-center, bottom-right, or top-right placement."]}
      faq={[{ question: "Can numbering start from something other than 1?", answer: "This tool currently starts numbering at 1; a custom start page is on the roadmap." }]}
    >
      <PageOpsTool operation="numbers" toolKey="add-page-numbers-to-pdf" actionLabel="Add Page Numbers" fieldLabel="" />
    </ToolPageShell>
  );
}
