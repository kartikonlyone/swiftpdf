import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing | SwiftPDF",
  description: "SwiftPDF plans: Free, Pro, and Business. Pick the plan that fits how often you use PDF tools.",
  path: "/pricing"
});

const PLANS = [
  { name: "Free", price: "₹0", features: ["All core PDF tools", "50MB file size limit", "Standard processing speed"] },
  { name: "Pro", price: "₹299/mo", features: ["Larger file size limit", "Priority processing", "No daily usage limit"] },
  { name: "Business", price: "₹999/mo", features: ["Team accounts", "Highest file size limit", "Priority support"] }
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">Pricing</h1>
        <p className="mt-2 max-w-xl text-ink/60">Start free. Upgrade only if you need larger files or higher volume.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.name} className="rounded-card border border-ink/10 bg-white p-6">
              <h2 className="font-display text-xl font-semibold text-ink">{plan.name}</h2>
              <p className="mt-1 text-2xl font-semibold text-brand">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/70">
                {plan.features.map((f) => <li key={f}>• {f}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-ink/50">Prices are configured from Admin → Settings and processed securely through Razorpay.</p>
      </main>
      <Footer />
    </>
  );
}
