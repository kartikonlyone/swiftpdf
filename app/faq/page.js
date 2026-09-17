import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoJsonLd from "@/components/SeoJsonLd";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Frequently Asked Questions | SwiftPDF",
  description: "Answers to common questions about using SwiftPDF's PDF tools.",
  path: "/faq"
});

const FAQ = [
  { question: "Is SwiftPDF free to use?", answer: "Yes — every core PDF tool is free, with a Pro plan available for larger files and higher volume." },
  { question: "Do I need to create an account?", answer: "No account is required to use the PDF tools. An account is only needed for the dashboard and saved file history." },
  { question: "How long are my files kept?", answer: "Uploaded files are processed and then deleted automatically after the configured retention period." },
  { question: "Which browsers are supported?", answer: "SwiftPDF works in current versions of Chrome, Firefox, Safari, and Edge, on desktop and mobile." }
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <SeoJsonLd data={faqJsonLd(FAQ)} />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">Frequently Asked Questions</h1>
        <dl className="mt-8 space-y-6">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-ink">{item.question}</dt>
              <dd className="mt-1 text-sm text-ink/60">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </main>
      <Footer />
    </>
  );
}
