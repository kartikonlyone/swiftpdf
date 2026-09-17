import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About SwiftPDF",
  description: "SwiftPDF builds fast, simple, and secure PDF tools that work in your browser without an account.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">About SwiftPDF</h1>
        <p className="mt-4 text-ink/70">
          SwiftPDF is built around one idea: everyday PDF tasks — merging, splitting, compressing,
          converting, signing — shouldn't require installing software or creating an account.
        </p>
        <p className="mt-4 text-ink/70">
          Every tool processes your file on demand. Nothing is pre-generated, and files are never
          kept longer than necessary to complete the job you asked for.
        </p>
      </main>
      <Footer />
    </>
  );
}
