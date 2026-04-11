import { Check } from "lucide-react";

const consumerFeatures = [
  "Live GPS + sensor dashboard",
  "AI damage prediction report",
  "Auto-claim on damage detection",
  "Return via Indomaret / JNE",
];

const b2bFeatures = [
  "Device pool management",
  "White-label dashboard option",
  "REST API + webhooks",
  "Priority 0G storage allocation",
];

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-ink-secondary">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-50">
        <Check size={10} className="text-teal-600" />
      </span>
      {text}
    </li>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-400">PRICING</p>
        <h2 className="mt-3 text-3xl font-medium text-ink-primary">Two ways to use SafeTrack</h2>
        <p className="mt-2 text-sm text-ink-secondary">Consumer or enterprise - we have you covered.</p>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-ink-muted/10 bg-surface-secondary p-6">
            <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs text-teal-800">
              Consumer
            </span>
            <h3 className="mt-4 text-xl font-medium text-ink-primary">Deposit &amp; Return</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              Pay a small deposit, device ships with your package. Return after delivery - refunded automatically via
              smart contract.
            </p>
            <ul className="mt-5 space-y-2">
              {consumerFeatures.map((feature) => (
                <FeatureItem key={feature} text={feature} />
              ))}
            </ul>
            <button className="mt-6 rounded-lg border border-ink-muted/30 px-4 py-2 text-sm text-ink-secondary transition-colors hover:border-teal-400">
              Get started
            </button>
          </div>

          <div className="rounded-2xl border-2 border-teal-400 bg-surface-primary p-6">
            <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs text-teal-800">B2B</span>
            <h3 className="mt-4 text-xl font-medium text-ink-primary">Logistics Partner</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              Integrate SafeTrack into your fleet. Offer premium secure shipping as a paid add-on to customers.
            </p>
            <ul className="mt-5 space-y-2">
              {b2bFeatures.map((feature) => (
                <FeatureItem key={feature} text={feature} />
              ))}
            </ul>
            <button className="mt-6 rounded-lg bg-teal-400 px-4 py-2 text-sm text-white transition-colors hover:bg-teal-600">
              Contact us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
