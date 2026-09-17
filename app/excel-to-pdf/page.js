import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import OfficeConvertTool from "@/components/tools/OfficeConvertTool";

export const metadata = buildMetadata({
  title: "Excel to PDF – Convert XLSX to PDF Free | SwiftPDF",
  description: "Convert an Excel spreadsheet into a print-ready PDF.",
  path: "/excel-to-pdf"
});

export default function ExcelToPdfPage() {
  return (
    <ToolPageShell
      toolKey="excel-to-pdf"
      title="Excel to PDF"
      intro="Convert a spreadsheet into a shareable, print-ready PDF."
      path="/excel-to-pdf"
      howTo={["Upload your Excel (.xlsx) file.", "Click Convert to PDF.", "Download your PDF."]}
      benefits={["Keeps sheet layout consistent for printing.", "Good for invoices, budgets, and reports.", "No formula recalculation needed after export."]}
      faq={[{ question: "What happens with multiple sheets?", answer: "Each sheet is converted to its own page range in the resulting PDF." }]}
    >
      <OfficeConvertTool
        accept={[".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}
        targetFormat="pdf"
        toolKey="excel-to-pdf"
        actionLabel="Convert to PDF"
      />
    </ToolPageShell>
  );
}
