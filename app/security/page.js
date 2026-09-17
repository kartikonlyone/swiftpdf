import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Security | SwiftPDF",
  description: "How SwiftPDF handles your files: storage, retention, and processing.",
  path: "/security"
});

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">Security</h1>

        <h2 className="mt-8 font-display text-xl font-semibold text-ink">File handling</h2>
        <p className="mt-2 text-ink/70">
          Files you upload are given a randomized name and stored only for as long as needed to
          complete your request. Original filenames and folder structures are never exposed in
          storage or download URLs.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-ink">Retention</h2>
        <p className="mt-2 text-ink/70">
          Uploaded and processed files are deleted automatically after the retention period
          configured in Admin → Settings (24 hours by default).
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-ink">Transport &amp; access</h2>
        <p className="mt-2 text-ink/70">
          File transfers use HTTPS. Downloads are served through short-lived signed URLs rather
          than public, permanently-accessible links.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-ink">Limitations</h2>
        <p className="mt-2 text-ink/70">
          No system is perfectly secure. Avoid uploading documents containing information you
          cannot afford to have exposed in the event of an incident.
        </p>
      </main>
      <Footer />
    </>
  );
}
