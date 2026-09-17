import { buildMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/ToolPageShell";
import OfficeConvertTool from "@/components/tools/OfficeConvertTool";

export const metadata = buildMetadata({
  title: "PDF to Excel – Convert PDF Tables to XLSX | SwiftPDF",
  description: "Convert PDF tables and data into an editable Excel spreadsheet.",
  path: "/pdf-to-excel"
});

export default function PdfToExcelPage() {
  return (
    <ToolPageShell
      toolKey="pdf-to-excel"
      title="PDF to Excel"
      intro="Convert PDF tables into an editable Excel spreadsheet."
      path="/pdf-to-excel"
      howTo={["Upload your PDF file.", "Click Convert to Excel.", "Download the .xlsx file."]}
      benefits={["Turn invoices and reports into working spreadsheets.", "Preserves table structure where the PDF has real tables.", "No manual retyping of numbers."]}
      faq={[{ question: "Does this work on scanned PDFs?", answer: "Best results come from text-based PDFs; scanned tables need OCR first." }]}
    >
      <OfficeConvertTool accept={["application/pdf"]} targetFormat="xlsx" toolKey="pdf-to-excel" actionLabel="Convert to Excel" />
    </ToolPageShell>
  );
}
